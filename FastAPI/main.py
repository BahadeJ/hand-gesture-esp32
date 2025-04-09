from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import cv2
import threading
import mediapipe as mp
import time
from collections import deque
import logging

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GestureSystem")

# Replace with your ESP32's IP address
ESP32_IP = "http://192.168.137.242"

# Camera setup
camera = cv2.VideoCapture(0)
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
latest_frame = None

# MediaPipe setup with higher accuracy
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)
mp_drawing = mp.solutions.drawing_utils

# Landmark buffer for smoothing
landmark_buffer = {
    "thumb": deque(maxlen=5),
    "index": deque(maxlen=5),
    "middle": deque(maxlen=5),
    "ring": deque(maxlen=5),
    "pinky": deque(maxlen=5)
}

# Track previous states and debounce
previous_states = {
    "thumb": None,
    "index": None,
    "middle": None,
    "ring": None,
    "pinky": None
}
last_trigger_time = {finger: 0 for finger in previous_states}

# Global state for the latest gesture
latest_gesture_data = {
    "gesture": None,
    "translatedMessage": ""
}

gesture_translations = {
    "thumb": "OK gesture",
    "index": "I need help",
    "middle": "Emergency!",
    "ring": "I'm hungry",
    "pinky": "Bathroom please"
}

# Smooth landmark values
def smooth_landmark(finger, value):
    buffer = landmark_buffer[finger]
    buffer.append(value)
    return sum(buffer) / len(buffer)


def send_gesture_command(finger: str):
    now = time.time()
    if now - last_trigger_time[finger] > 1.0:
        url = f"{ESP32_IP}/gesture/{finger}"
        try:
            response = requests.get(url, timeout=2)
            translated_msg = gesture_translations.get(finger, "")
            logger.info(f"➡️ Sent gesture: {finger} | ESP32 Response: {response.text}")
            last_trigger_time[finger] = now
            # Save to latest gesture state
            latest_gesture_data["gesture"] = finger
            latest_gesture_data["translatedMessage"] = translated_msg
        except requests.RequestException as e:
            logger.error(f"❌ Failed to send gesture to ESP32: {e}")

# Detect raised fingers and send commands
def count_fingers(hand_landmarks):
    states = {
        "thumb": smooth_landmark("thumb", hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP].x) <
                 hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP].x,
        "index": smooth_landmark("index", hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y) <
                 hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP].y,
        "middle": smooth_landmark("middle", hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP].y) <
                  hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_PIP].y,
        "ring": smooth_landmark("ring", hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP].y) <
                hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_PIP].y,
        "pinky": smooth_landmark("pinky", hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP].y) <
                 hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_PIP].y
    }

    any_finger_up = False

    for finger, is_up in states.items():
        if is_up:
            any_finger_up = True
            if previous_states[finger] is None or previous_states[finger] != is_up:
                send_gesture_command(finger)
        previous_states[finger] = is_up

    # If no fingers are up and it’s a new state, update gesture status
    if not any_finger_up and any(previous_states.values()):
        for finger in previous_states:
            previous_states[finger] = False  # Reset all to False
        latest_gesture_data["gesture"] = "none"
        latest_gesture_data["translatedMessage"] = "No fingers detected"
        logger.info("✋ No fingers detected")


# Frame capture and processing
def capture_loop():
    global latest_frame
    logger.info("📸 OpenCV capture loop started")
    prev_time = time.time()

    while True:
        success, frame = camera.read()
        if not success:
            logger.warning("❌ Failed to read frame from camera.")
            break

        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                count_fingers(hand_landmarks)
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        _, buffer = cv2.imencode('.jpg', frame)
        latest_frame = buffer.tobytes()

        # Optional: Calculate and print FPS
        curr_time = time.time()
        fps = 1 / (curr_time - prev_time)
        prev_time = curr_time
        # logger.debug(f"FPS: {fps:.2f}")

        time.sleep(0.03)  # Approx 30 FPS

# MJPEG stream generator
def gen_frames():
    global latest_frame
    while True:
        if latest_frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + latest_frame + b'\r\n')
        time.sleep(0.03)

# FastAPI endpoints
@app.get("/")
def read_root():
    return {"message": "FastAPI backend for ESP32 gesture display"}

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(gen_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/gesture/status")
def get_gesture_status():
    return latest_gesture_data


@app.on_event("startup")
def on_startup():
    thread = threading.Thread(target=capture_loop)
    thread.daemon = True
    thread.start()
    logger.info("🚀 Gesture detection service started")
