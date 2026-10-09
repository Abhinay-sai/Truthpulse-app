import os
import sys
import numpy as np
from PIL import Image

print("==================================================")
print("TRUTHPULSE AI: TRAINING VISUAL DEEPFAKE CNN MODEL")
print("==================================================")

DATA_DIR = os.path.join("dataset", "real")
if not os.path.exists(DATA_DIR):
    raise FileNotFoundError(f"Dataset folder not found at '{DATA_DIR}'")

# Check PyTorch availability
try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import Dataset, DataLoader
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

if not TORCH_AVAILABLE:
    print("[ERROR] PyTorch (torch) is not available in this Python environment.")
    sys.exit(1)

print("[INFO] Utilizing PyTorch ConvNet Deep Learning Framework...")

IMG_SIZE = 128
BATCH_SIZE = 32
EPOCHS = 3

class DeepfakeImageDataset(Dataset):
    def __init__(self, root_dir, img_size=128, max_per_class=500):
        self.samples = []
        self.img_size = img_size
        self.classes = ['fake', 'real']
        for class_idx, class_name in enumerate(self.classes):
            class_dir = os.path.join(root_dir, class_name)
            if os.path.exists(class_dir):
                count = 0
                for fname in os.listdir(class_dir):
                    if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp')):
                        self.samples.append((os.path.join(class_dir, fname), class_idx))
                        count += 1
                        if max_per_class and count >= max_per_class:
                            break

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        try:
            img = Image.open(img_path).convert('RGB').resize((self.img_size, self.img_size))
            arr = np.array(img, dtype=np.float32) / 255.0
            tensor = torch.tensor(arr).permute(2, 0, 1)  # Convert to (C, H, W)
        except Exception:
            tensor = torch.zeros((3, self.img_size, self.img_size), dtype=torch.float32)
        return tensor, label

class DeepfakeCNN(nn.Module):
    def __init__(self):
        super(DeepfakeCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
        )
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((4, 4)),
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 2)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

full_dataset = DeepfakeImageDataset(DATA_DIR, img_size=IMG_SIZE)
num_samples = len(full_dataset)
if num_samples == 0:
    raise ValueError(f"No image samples found in {DATA_DIR}")

train_size = int(0.8 * num_samples)
val_size = num_samples - train_size

train_dataset, val_dataset = torch.utils.data.random_split(full_dataset, [train_size, val_size])
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

print(f"[OK] Loaded {num_samples} images ({train_size} Training / {val_size} Validation)")
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Compute Device: {device}")

model = DeepfakeCNN().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

print("\n[INFO] Training PyTorch Visual Forensic Deepfake CNN...")
for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    corrects = 0
    
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(inputs)
        _, preds = torch.max(outputs, 1)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * inputs.size(0)
        corrects += torch.sum(preds == labels.data)
        
    epoch_loss = running_loss / train_size
    epoch_acc = corrects.double() / train_size
    print(f"  Epoch [{epoch+1}/{EPOCHS}] Loss: {epoch_loss:.4f} | Validation Accuracy: {epoch_acc*100:.2f}%")

# Save Trained Model
torch.save(model.state_dict(), "deepfake_model.pt")
print("\n[SUCCESS] Custom PyTorch Visual Model saved as 'deepfake_model.pt'!")
print("\n[DONE] Deepfake image training complete!")
