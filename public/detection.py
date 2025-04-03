import os
import json
import argparse
from collections import Counter
from ultralytics import YOLO
from PIL import Image, ImageDraw
import glob

def calculate_iga(detections):
    """Calculates the IGA"""
    acne_weights = {0: 1, 5: 1, 3: 2, 4: 3, 2: 4, 1: 0}
    acne_count = Counter(detections)
    iga_score = sum(acne_weights.get(cls, 0) * acne_count.get(cls, 0) for cls in acne_weights)
    return iga_score

def get_next_folder(base="detection"):
    """Finds the next available folder name inside 'detections/'."""
    os.makedirs("detections", exist_ok=True)
    existing_folders = sorted(
        [f for f in os.listdir("detections") if f.startswith(base) and f[len(base):].isdigit()]
    )

    last_number = max([int(f[len(base):]) for f in existing_folders], default=0)
    return f"detections/{base}{last_number + 1:02d}"

def draw_crosshairs(image_path, boxes):
    """Draws colored crosshairs around detected acne spots"""
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    colors = ["#ADD8E6", "#87CEEB", "#4682B4", "#4169E1", "#0000FF", "#8A2BE2", "#9400D3", "#A52A2A", "#B22222", "#FF0000"]

    for i, (x1, y1, x2, y2) in enumerate(boxes):
        color = colors[i % len(colors)]
        crosshair_size = min(x2 - x1, y2 - y1) * 0.3

        draw.line([(x1, y1), (x1 + crosshair_size, y1)], fill=color, width=2)
        draw.line([(x1, y1), (x1, y1 + crosshair_size)], fill=color, width=2)
        draw.line([(x2, y1), (x2 - crosshair_size, y1)], fill=color, width=2)
        draw.line([(x2, y1), (x2, y1 + crosshair_size)], fill=color, width=2)
        draw.line([(x1, y2), (x1 + crosshair_size, y2)], fill=color, width=2)
        draw.line([(x1, y2), (x1, y2 - crosshair_size)], fill=color, width=2)
        draw.line([(x2, y2), (x2 - crosshair_size, y2)], fill=color, width=2)
        draw.line([(x2, y2), (x2, y2 - crosshair_size)], fill=color, width=2)

    return image

def process_image(image_path, model, conf=0.25):
    """Processes an image, calculates the IGA, draws crosshairs, and saves files in a numbered folder."""
    if not os.path.exists(image_path):
        return json.dumps({"error": "Image not found"}, ensure_ascii=False)

    results = model(image_path, conf=conf)[0]
    detected_classes = results.boxes.cls.tolist() if hasattr(results.boxes, 'cls') else []
    detected_boxes = results.boxes.xyxy.tolist() if hasattr(results.boxes, 'xyxy') else []

    iga_score = calculate_iga(detected_classes)

    output_folder = get_next_folder()
    os.makedirs(output_folder, exist_ok=True)

    json_path = os.path.join(output_folder, "result.json")
    result_data = {"image": os.path.basename(image_path), "detected_classes": detected_classes, "iga_score": iga_score}

    try:
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(result_data, f, indent=4, ensure_ascii=False)
    except IOError as e:
        print(f"Erro ao salvar JSON: {e}")

    image_with_crosshairs = draw_crosshairs(image_path, detected_boxes)
    image_with_crosshairs.convert("RGB").save(os.path.join(output_folder, "detected_image.jpg"))

    return json.dumps({"success": True, "created_folder": output_folder}, indent=4, ensure_ascii=False)

def detect(image_path):
    """Runs acne detection on the given image."""
    model = YOLO("public/best.pt")
    json_result = process_image(image_path, model)
    return json_result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Acne detection on images using YOLO.")
    parser.add_argument("image_path", type=str, help="Path to the image to be processed.")
    args = parser.parse_args()
    
    result = detect(args.image_path)
    print(result)
