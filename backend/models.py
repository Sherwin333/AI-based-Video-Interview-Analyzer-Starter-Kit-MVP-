from transformers import pipeline
from fer import FER

_sentiment = None
_emotion = None


def get_sentiment_pipeline():
    global _sentiment
    if _sentiment is None:
        _sentiment = pipeline(
            task="sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest"
        )
    return _sentiment


def get_emotion_detector():
    global _emotion
    if _emotion is None:
        # uses MTCNN for face detection; fallback to Haar if needed
        _emotion = FER(mtcnn=True)
    return _emotion
