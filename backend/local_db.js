const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE = path.join(__dirname, 'local_db.json');

function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { users: [], scans: [], notifications: [], posts: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], scans: [], notifications: [], posts: [] };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save local DB:', e);
  }
}

function matchQuery(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key of Object.keys(query)) {
    const qVal = query[key];
    const iVal = item[key];

    if (qVal && typeof qVal === 'object' && !Array.isArray(qVal)) {
      if (qVal.$gt !== undefined) {
        const itemTime = new Date(iVal).getTime();
        const compTime = new Date(qVal.$gt).getTime();
        if (!(itemTime > compTime)) return false;
        continue;
      }
      if (qVal.$gte !== undefined) {
        if (!(new Date(iVal).getTime() >= new Date(qVal.$gte).getTime())) return false;
        continue;
      }
    }

    if (key === 'email' && typeof qVal === 'string' && typeof iVal === 'string') {
      if (qVal.toLowerCase() !== iVal.toLowerCase()) return false;
      continue;
    }

    if (key === '_id' || key === 'userId' || key === 'authorId') {
      if (String(iVal) !== String(qVal)) return false;
      continue;
    }

    if (String(iVal) !== String(qVal)) return false;
  }
  return true;
}

class BaseDocument {
  constructor(collectionName, data = {}) {
    this._collectionName = collectionName;
    Object.assign(this, data);
    if (!this._id) {
      this._id = new mongoose.Types.ObjectId().toString();
    } else {
      this._id = String(this._id);
    }
  }

  async save() {
    const db = loadDB();
    const list = db[this._collectionName] || [];
    const idx = list.findIndex(item => String(item._id) === String(this._id));
    const raw = this.toObject();
    if (idx >= 0) {
      list[idx] = raw;
    } else {
      list.push(raw);
    }
    db[this._collectionName] = list;
    saveDB(db);
    return this;
  }

  toObject() {
    const obj = {};
    for (const k of Object.keys(this)) {
      if (!k.startsWith('_collectionName')) {
        obj[k] = this[k];
      }
    }
    return obj;
  }

  toJSON() {
    return this.toObject();
  }
}

class QueryPromise {
  constructor(collectionName, query = {}, isSingle = false) {
    this._collectionName = collectionName;
    this._query = query;
    this._isSingle = isSingle;
    this._sortObj = null;
    this._limitNum = null;
    this._excludedFields = [];
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  limit(num) {
    this._limitNum = num;
    return this;
  }

  select(selectStr) {
    if (typeof selectStr === 'string') {
      selectStr.split(/\s+/).forEach(f => {
        if (f.startsWith('-')) {
          this._excludedFields.push(f.substring(1));
        }
      });
    }
    return this;
  }

  async exec() {
    const db = loadDB();
    const list = db[this._collectionName] || [];

    if (this._isSingle) {
      const found = list.find(item => matchQuery(item, this._query));
      if (!found) return null;
      const doc = new BaseDocument(this._collectionName, { ...found });
      for (const field of this._excludedFields) {
        delete doc[field];
      }
      return doc;
    }

    let results = list.filter(item => matchQuery(item, this._query));

    if (this._sortObj) {
      const sortKey = Object.keys(this._sortObj)[0];
      const sortDir = this._sortObj[sortKey];
      results.sort((a, b) => {
        const valA = a[sortKey] ? new Date(a[sortKey]).getTime() || a[sortKey] : 0;
        const valB = b[sortKey] ? new Date(b[sortKey]).getTime() || b[sortKey] : 0;
        return sortDir === -1 ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
      });
    }

    if (this._limitNum) {
      results = results.slice(0, this._limitNum);
    }

    return results.map(item => {
      const doc = new BaseDocument(this._collectionName, { ...item });
      for (const field of this._excludedFields) {
        delete doc[field];
      }
      return doc;
    });
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

function createModel(collectionName, MongooseModel, defaults = {}) {
  const ModelProxy = function (data = {}) {
    if (mongoose.connection.readyState === 1 && MongooseModel) {
      try {
        return new MongooseModel(data);
      } catch (e) {
        // fallback
      }
    }
    const merged = { ...defaults, ...data };
    return new BaseDocument(collectionName, merged);
  };

  ModelProxy.findOne = function (query) {
    if (mongoose.connection.readyState === 1 && MongooseModel) {
      return MongooseModel.findOne(query);
    }
    return new QueryPromise(collectionName, query, true);
  };

  ModelProxy.findById = function (id) {
    if (mongoose.connection.readyState === 1 && MongooseModel) {
      return MongooseModel.findById(id);
    }
    return new QueryPromise(collectionName, { _id: id }, true);
  };

  ModelProxy.find = function (query = {}) {
    if (mongoose.connection.readyState === 1 && MongooseModel) {
      return MongooseModel.find(query);
    }
    return new QueryPromise(collectionName, query, false);
  };

  ModelProxy.deleteMany = async function (query = {}) {
    if (mongoose.connection.readyState === 1 && MongooseModel) {
      return MongooseModel.deleteMany(query);
    }
    const db = loadDB();
    const list = db[collectionName] || [];
    db[collectionName] = list.filter(item => !matchQuery(item, query));
    saveDB(db);
    return { acknowledged: true, deletedCount: list.length - db[collectionName].length };
  };

  return ModelProxy;
}

module.exports = {
  createModel,
  loadDB,
  saveDB
};

