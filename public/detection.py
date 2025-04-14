import os
import json
from collections import Counter
from ultralytics import YOLO
import torch
from PIL import Image, ImageDraw
from torchvision import transforms
from enum import Enum
from torchvision.models import efficientnet_b0
import torch.nn as nn
import argparse

CLASSIFIER_MODEL_PATH   = "best_model.pth"
DETECTION_MODEL         = "best.pt"
class IGAlevel(Enum):
    SEM_ACNES   = 0
    LEVE        = 1
    MODERADA    = 2
    GRAVE       = 3
    MUITO_GRAVE = 4

def get_iga_level(iga_score):
    """get the IGA classification"""
    if iga_score == 0:
        return IGAlevel.SEM_ACNES
    if iga_score <= 5:
        return IGAlevel.LEVE
    if iga_score <= 15:
        return IGAlevel.MODERADA
    if iga_score <= 30:
        return IGAlevel.GRAVE
    return IGAlevel.MUITO_GRAVE


def calculate_iga(detections):
    """Calculates the IGA"""
    acne_weights = {0: 1, 5: 1, 3: 2, 4: 3, 2: 4, 1: 0}
    acne_count = Counter(detections)
    return sum(acne_weights[cls] * acne_count.get(cls, 0) for cls in acne_weights)

def get_next_folder(base_path):
    """Finds the next available sequential folder name."""
    existing_folders = [int(f) for f in os.listdir(base_path) if f.isdigit()]
    next_number = max(existing_folders, default=0) + 1
    return os.path.join(base_path, str(next_number))

def draw_crosshairs(image_path, boxes, classes):
    """Draws colored crosshairs around detected acne spots based on class"""
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    class_colors = {
        5: "#7DFABE",  # Whiteheads
        1: "#6AE899",  # Dark Spots
        3: "#76DB9B",  # Papules
        0: "#56FF95",  # Blackheads
        4: "#30B27F",  # Pustules
        2: "#1F7A5D"   # Nodules
    }

    def draw_corner_lines(x, y, sign_x, sign_y, color, size):
        """draw the lines in the boxes"""
        draw.line([(x, y), (x + sign_x * size, y)], fill=color, width=2)
        draw.line([(x, y), (x, y + sign_y * size)], fill=color, width=2)

    for (x1, y1, x2, y2), cls in zip(boxes, classes):
        color = class_colors.get(cls, "#000000")
        crosshair_size = min(x2 - x1, y2 - y1) * 0.3
        draw_corner_lines(x1, y1, 1, 1, color, crosshair_size)
        draw_corner_lines(x2, y1, -1, 1, color, crosshair_size)
        draw_corner_lines(x1, y2, 1, -1, color, crosshair_size)
        draw_corner_lines(x2, y2, -1, -1, color, crosshair_size)

    return image

def load_classifier():
    """load the classification model"""
    model = efficientnet_b0(pretrained=False)
    model.classifier[1] = nn.Sequential(nn.Linear(model.classifier[1].in_features, 6))
    state_dict = torch.load(CLASSIFIER_MODEL_PATH, map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()
    return model

def classify_crop(image):
    """classifies acne crop"""
    transform = transforms.Compose([
        transforms.Resize((384, 384)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    image_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        output = classifier(image_tensor)
        prediction = output.argmax(dim=1).item()
    return prediction

def process_image(image_path, model, consulta_id, conf=0.25):
    """Processes an image, calculates the IGA, draws crosshairs, and saves results in a structured folder"""
    if not os.path.exists(image_path):
        return json.dumps({"error": "Image not found"}, ensure_ascii=False)

    results = model(image_path, conf=conf, iou=0.2, verbose=False)[0]
    detected_boxes = results.boxes.xyxy.tolist() if results.boxes else []

    image = Image.open(image_path).convert("RGB")
    detected_classes = []

    for box in detected_boxes:
        x1, y1, x2, y2 = map(int, box)
        crop = image.crop((x1, y1, x2, y2))
        pred_class = classify_crop(crop)
        detected_classes.append(pred_class)

    iga_score = calculate_iga(detected_classes)
    consulta_folder = os.path.join("detections", consulta_id)
    os.makedirs(consulta_folder, exist_ok=True)

    output_folder = get_next_folder(consulta_folder)
    os.makedirs(output_folder)
    detected_image_path = os.path.join(output_folder, "detected_image.jpg")
    json_path = os.path.join(output_folder, "result.json")

    acne_labels = {
        5: "Cravos Brancos", 1: "Manchas Escuras",
        3: "Pápulas", 0: "Cravos Pretos",
        4: "Pústulas", 2: "Nódulos"
    }

    acne_count = Counter(detected_classes)
    acne_quantity = {acne_labels[cls]: acne_count.get(cls, 0) for cls in acne_labels}

    result_data = {
        "image": os.path.basename(image_path),
        "image_path": detected_image_path,
        "detected_classes": detected_classes,
        "acne_quantity": acne_quantity,
        "iga_score": iga_score,
        "iga_level": get_iga_level(iga_score).value
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result_data, f, indent=4, ensure_ascii=False)

    image_with_crosshairs = draw_crosshairs(image_path, detected_boxes, detected_classes)
    image_with_crosshairs.convert("RGB").save(detected_image_path)

    return json.dumps({"success": True, "created_folder": output_folder}, indent=4, ensure_ascii=False)

def detect(image_path, consulta_id):
    """Runs acne detection on the given image with a specific consultation ID"""
    model = YOLO(DETECTION_MODEL)
    return process_image(image_path, model, consulta_id, .010)

if __name__ == "__main__":
    classifier = load_classifier()
    
    parser = argparse.ArgumentParser(description="Acne detection on images using YOLO.")
    parser.add_argument("image_path", type=str, help="Path to the image to be processed.")
    parser.add_argument("consult_id", type=str, help="ID of the consultation.")
    args = parser.parse_args()
    result = detect(args.image_path, args.consult_id)
    print(result)
