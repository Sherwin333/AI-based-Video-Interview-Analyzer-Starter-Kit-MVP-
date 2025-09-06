import os
import tempfile
from typing import List, Tuple

import cv2
import numpy as np

from .gaze import estimate_eye_contact
from models import get_emotion_detector


def get_frames_from_video_bytes(video_bytes: bytes, every_nth: int = 5) -> List[np.ndarray]:
    """
    Decode video bytes to a list of frames (BGR numpy arrays).
    Writes to a temporary file (more reliable cross-platform for OpenCV).
    """
    tf = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    try:
        tf.write(video_bytes)
        tf.flush()
        tf.close()

        cap = cv2.VideoCapture(tf.name)
        frames: List[np.ndarray] = []
        i = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if i % every_nth == 0:
                frames.append(frame)
            i += 1

        cap.release()
        return frames
    finally:
        # ensure temp file is removed
        try:
            os.unlink(tf.name)
        except Exception:
            pass


def analyze_emotions_and_gaze(frames: List[np.ndarray]) -> Tuple[List[dict], float, int]:
    """
    Analyze frames for emotions and eye contact.
    Returns (emotion_timeline, eye_contact_pct, total_faces_detected)
    """
    detector = get_emotion_detector()
    emotion_timeline: List[dict] = []  # [{'t': idx, 'emotions': {...}}]
    eye_contact_hits = 0
    total_faces = 0

    for idx, frame in enumerate(frames):
        # Emotion detection (robust to detector errors)
        try:
            result = detector.detect_emotions(frame)
        except Exception:
            result = []

        # Aggregate emotions (if multiple faces, take primary = largest box)
        if result:
            # count face (we treat a non-empty result as at least one face)
            total_faces += 1
            # sort by box area (assumes box = [x, y, w, h])
            result.sort(key=lambda r: r.get('box', [0, 0, 0, 0])[2] * r.get('box', [0, 0, 0, 0])[3], reverse=True)
            primary_emotions = result[0].get('emotions', {})
            emotion_timeline.append({'t': idx, 'emotions': primary_emotions})
        else:
            emotion_timeline.append({'t': idx, 'emotions': {}})

        # Gaze / eye contact flag (robust to errors)
        try:
            looking = estimate_eye_contact(frame)
            if looking:
                eye_contact_hits += 1
        except Exception:
            pass

    eye_contact_pct = (eye_contact_hits / max(len(frames), 1)) * 100.0
    return emotion_timeline, eye_contact_pct, total_faces
