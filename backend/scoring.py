import numpy as np

# weight knobs
W_SENTIMENT = 0.4
W_EYE = 0.3
W_EMOTION = 0.3

POS_LABELS = {"positive", "joy", "happy"}
NEG_LABELS = {"negative", "anger", "sad", "fear"}


def score_sentiment(sentiment_series):
    # sentiment_series: list of dicts [{label, score}]
    pos = [s['score'] for s in sentiment_series if s['label'].lower().startswith('positive')]
    neg = [s['score'] for s in sentiment_series if s['label'].lower().startswith('negative')]

    pos_avg = np.mean(pos) if pos else 0.5
    neg_avg = np.mean(neg) if neg else 0.5

    return max(0.0, min(100.0, (pos_avg * 100.0 - neg_avg * 30.0) + 50.0))


def score_emotion(emotion_timeline):
    # prefer neutral/positive dominance
    if not emotion_timeline:
        return 50.0

    happy = []
    neutral = []

    for p in emotion_timeline:
        e = p.get('emotions', {})
        if not e:
            continue
        happy.append(e.get('happy', 0))
        neutral.append(e.get('neutral', 0))

    h = np.mean(happy) if happy else 0.3
    n = np.mean(neutral) if neutral else 0.4

    return max(0.0, min(100.0, (0.6 * h + 0.4 * n) * 100.0))


def overall_score(sentiment_score, eye_contact_pct, emotion_score):
    return round(
        W_SENTIMENT * sentiment_score +
        W_EYE * eye_contact_pct +
        W_EMOTION * emotion_score, 1
    )
