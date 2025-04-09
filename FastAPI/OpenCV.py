import cv2
import mediapipe as mp
import requests
import time

FASTAPI_URL = "http://127.0.0.1:8000"

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_drawing = mp.solutions.drawing_utils

session = requests.Session()
previous_states = { "thumb": None, "index": None, "middle": None, "ring": None, "pinky": None }

def control_led(finger, state):
    try:
        response = session.post(f"{FASTAPI_URL}/led/control", json={"finger": finger, "state": state})
        print(f"Sent {finger} {'ON' if state else 'OFF'}, FastAPI Response: {response.json()}")
    except requests.RequestException as e:
        print(f"Failed to send command: {e}")

def count_fingers(hand_landmarks):
    # Detect finger states (up or down)
    states = {
        "thumb": hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP].x < hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP].x,
        "index": hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y < hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP].y,
        "middle": hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP].y < hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_PIP].y,
        "ring": hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP].y < hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_PIP].y,
        "pinky": hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP].y < hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_PIP].y
    }

    for finger, is_up in states.items():
        if previous_states[finger] is None or previous_states[finger] != is_up:
            control_led(finger, is_up)
            previous_states[finger] = is_up 

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            count_fingers(hand_landmarks)

    cv2.imshow('Hand Gesture Recognition', frame)       
    if cv2.waitKey(5) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
