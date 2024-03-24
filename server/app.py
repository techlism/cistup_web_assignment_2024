from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

cars_cascade = cv2.CascadeClassifier('haarcascade_car.xml')
body_cascade = cv2.CascadeClassifier('fullbody.xml')

def detect_cars_and_pedestrians(frame):
    cars = cars_cascade.detectMultiScale(frame, 1.15, 4)
    pedestrians = body_cascade.detectMultiScale(frame, 1.15, 4)
    for (x, y, w, h) in cars:
        cv2.rectangle(frame, (x, y), (x+w, y+h), color=(255, 0, 0), thickness=2)
    for (x, y, w, h) in pedestrians:
        cv2.rectangle(frame, (x, y), (x+w, y+h), color=(0, 255, 255), thickness=2)
    return frame

@app.route('/')
def base_route():
    return {'message': 'Welcome'}, 200

@app.route('/process-image', methods=['POST'])
def process_image():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided.'}), 400

    # Decode the base64 string
    encoded_data = data['image']
    decoded_data = base64.b64decode(encoded_data)

    # Convert binary data to OpenCV image
    nparr = np.frombuffer(decoded_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Process the image
    processed_img = detect_cars_and_pedestrians(img)

    # Convert back to base64
    _, buffer = cv2.imencode('.jpg', processed_img)
    io_buf = BytesIO(buffer)
    encoded_img = base64.b64encode(io_buf.getvalue()).decode('utf-8')

    return jsonify({'image': encoded_img})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
