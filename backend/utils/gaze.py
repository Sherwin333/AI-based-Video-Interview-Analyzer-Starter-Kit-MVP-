import mediapipe as mp
import numpy as np

face_mesh = mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True,
    refine_landmarks=True
)

# Very simple heuristic: if pupils (iris landmarks) are roughly centered
# horizontally, treat as eye contact
# (You can refine later with head pose estimation.)
LEFT_IRIS = [468, 469, 470, 471]
RIGHT_IRIS = [473, 474, 475, 476]


def iris_center(landmarks, idxs, w, h):
    pts = np.array([[landmarks[i].x * w, landmarks[i].y * h] for i in idxs])
    return pts.mean(axis=0)


def estimate_eye_contact(frame_bgr, tol=0.08):
    h, w, _ = frame_bgr.shape
    rgb = frame_bgr[:, :, ::-1]
    res = face_mesh.process(rgb)

    if not res.multi_face_landmarks:
        return False

    lms = res.multi_face_landmarks[0].landmark
    left = iris_center(lms, LEFT_IRIS, w, h)
    right = iris_center(lms, RIGHT_IRIS, w, h)

    # normalize horizontal position to [0,1] by frame width
    eye_mid_x = (left[0] + right[0]) / 2.0

    # eye contact if mid ~ center of frame
    cx = eye_mid_x / w
    return abs(cx - 0.5) < tol
