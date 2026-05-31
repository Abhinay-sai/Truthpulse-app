import tensorflow as tf

from tensorflow.keras.applications import EfficientNetB0

from tensorflow.keras.models import Sequential

from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import GlobalAveragePooling2D

from tensorflow.keras.preprocessing.image import ImageDataGenerator

# SETTINGS

IMG_SIZE = 224

BATCH_SIZE = 32

EPOCHS = 5

# DATA GENERATOR

datagen = ImageDataGenerator(

    rescale=1./255,

    validation_split=0.2
)

# TRAIN DATA

train_data = datagen.flow_from_directory(

    'dataset',

    target_size=(IMG_SIZE, IMG_SIZE),

    batch_size=BATCH_SIZE,

    class_mode='binary',

    subset='training'
)

# VALIDATION DATA

val_data = datagen.flow_from_directory(

    'dataset',

    target_size=(IMG_SIZE, IMG_SIZE),

    batch_size=BATCH_SIZE,

    class_mode='binary',

    subset='validation'
)

# LOAD PRETRAINED MODEL

base_model = EfficientNetB0(

    include_top=False,

    weights='imagenet',

    input_shape=(224,224,3)
)

base_model.trainable = False

# BUILD MODEL

model = Sequential([

    base_model,

    GlobalAveragePooling2D(),

    Dense(
        128,
        activation='relu'
    ),

    Dropout(0.5),

    Dense(
        1,
        activation='sigmoid'
    )
])

# COMPILE

model.compile(

    optimizer='adam',

    loss='binary_crossentropy',

    metrics=['accuracy']
)

# SUMMARY

model.summary()

# TRAIN

history = model.fit(

    train_data,

    validation_data=val_data,

    epochs=EPOCHS
)

# SAVE MODEL

model.save("deepfake_model.h5")

print("\nADVANCED MODEL TRAINED SUCCESSFULLY")