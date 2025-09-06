# backend/models.py
from transformers import pipeline

# Try to import FER (moviepy dependency). If not available, use a stub.
try:
    from fer import FER
    _emotion = None
    _fer_available = True
except Exception:
    FER = None
    _emotion = None
    _fer_available = False

_sentiment = None

def get_sentiment_pipeline():
    """
    Returns a transformers sentiment pipeline forced to CPU.
    device=-1 ensures CPU usage.
    """
    global _sentiment
    if _sentiment is None:
        _sentiment = pipeline(
            task="sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            device=-1  # -1 forces CPU
        )
    return _sentiment

def get_emotion_detector():
    """
    Returns a FER emotion detector if available; otherwise a stub
    to let the server run during development without moviepy/FER installed.
    """
    global _emotion
    if _emotion is not None:
        return _emotion

    if _fer_available:
        # real FER detector (may be slower)
        _emotion = FER(mtcnn=True)
        return _emotion

    # Fallback stub detector used when FER / moviepy aren't installed.
    class StubDetector:
        def detect_emotions(self, image):
            # Return empty list (no faces detected) so pipeline keeps running.
            return []

    _emotion = StubDetector()
    return _emotion
