from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import cv2
import torch
import numpy as np
import os
from collections import defaultdict
from torchvision import transforms, models
from torch import nn
from torchvision.models import convnext_tiny, ConvNeXt_Tiny_Weights
from PIL import Image
from ultralytics import YOLO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


yolo_model = YOLO("yolov8n.pt") 


num_classes = 5

model = convnext_tiny(weights=None)
in_features = model.classifier[2].in_features

model.classifier[2] = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(in_features, num_classes)
)

checkpoint = torch.load("snake_model_convnext_tiny.pth", map_location=device)
model.load_state_dict(checkpoint["model_state_dict"])

model = model.to(device)
model.eval()

# -------------------- TRANSFORMS --------------------
weights = ConvNeXt_Tiny_Weights.DEFAULT
transform = weights.transforms()

class_map = {
    0: "Nerodia sipedon - Northern Watersnake",
    1: "Thamnophis sirtalis - Common Garter snake",
    2: "Storeria dekayi - DeKay's Brown snake",
    3: "Pantherophis obsoletus - Black Rat snake",
    4: "Crotalus atrox - Western Diamondback rattlesnake"
}



def classify_image(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(img)

    img = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img)
        probs = torch.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)

    pred_class = pred.item()
    return class_map[pred_class], conf.item(), pred_class

def extract_frames(video_path, fps_skip=5):
    cap = cv2.VideoCapture(video_path)
    frames = []

    fps = int(cap.get(cv2.CAP_PROP_FPS))
    step = max(1, fps // fps_skip)

    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if count % step == 0:
            frames.append(frame)

        count += 1

    cap.release()
    return frames


def format_response(label, conf, class_id, source="model"):
    if label == "No snake detected":
        return {
            "speciesName": "No snake detected",
            "scientificName": "Unknown",
            "confidence": 0.0,
            "venomous": False,
            "safetyNote": "No clear detection. Stay cautious.",
            "source": source
        }
    parts = label.split(" - ")
    scientific_name = parts[0] if len(parts) > 1 else label
    species_name = parts[1] if len(parts) > 1 else label
    venomous = (class_id == 4)
    
    return {
        "speciesName": species_name,
        "scientificName": scientific_name,
        "confidence": round(float(conf) * 100, 2),
        "venomous": venomous,
        "safetyNote": "Seek immediate medical attention if bitten by a venomous snake." if venomous else "Keep distance from all snakes.",
        "source": source
    }

# 🔥 Main API
@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    
    # Read image
    image = Image.open(file.file).convert("RGB")
    image_np = np.array(image)

    # 🔥 Direct classification (NO YOLO)
    label, conf, class_id = classify_image(image_np)

    return format_response(label, conf, class_id)

@app.post("/predict-video")
async def predict_video(file: UploadFile = File(...)):

    video_path = "temp.mp4"

    # Save uploaded video
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    frames = extract_frames(video_path)

    predictions = []

    for frame in frames:
        results = yolo_model(frame)

        detected = False  # 🔥 track if YOLO found something

        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy() if r.boxes is not None else []

            if len(boxes) > 0:
                detected = True

                # pick largest object
                areas = [(b[2]-b[0])*(b[3]-b[1]) for b in boxes]
                box = boxes[np.argmax(areas)]

                x1, y1, x2, y2 = map(int, box[:4])
                crop = frame[y1:y2, x1:x2]

                if crop is None or crop.size == 0:
                    continue

                label, conf, class_id = classify_image(crop)
                predictions.append((label, conf, class_id))

        # 🔥 FALLBACK (VERY IMPORTANT)
        if not detected:
            label, conf, class_id = classify_image(frame)
            predictions.append((label, conf, class_id))

    # -------------------- FINAL RESULT --------------------
    if predictions:
        vote_dict = defaultdict(float)

        for label, conf, _ in predictions:
            vote_dict[label] += conf  # weighted voting

        final_label = max(vote_dict, key=vote_dict.get)

        final_class_id = next(
            p[2] for p in predictions if p[0] == final_label
        )

        avg_conf = vote_dict[final_label] / len(predictions)

        os.remove(video_path)

        res = format_response(final_label, avg_conf, final_class_id)
        res["frames_processed"] = len(frames)
        res["detections"] = len(predictions)
        return res

    os.remove(video_path)

    res = format_response("No snake detected", 0.0, -1)
    res["frames_processed"] = len(frames)
    res["detections"] = 0
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)