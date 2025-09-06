from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils.video import get_frames_from_video_bytes, analyze_emotions_and_gaze
from utils.audio import transcribe
from models import get_sentiment_pipeline
from scoring import score_sentiment, score_emotion, overall_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisResponse(BaseModel):
    transcript: str
    sentiment_series: list
    emotion_timeline: list
    eye_contact_pct: float
    scores: dict


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    video_bytes = await file.read()

    # 1) ASR -> transcript
    transcript = transcribe(video_bytes)

    # 2) Sentiment over utterances (simple: whole transcript)
    nlp = get_sentiment_pipeline()
    sentiment = nlp(transcript) if transcript else []

    # 3) Video: emotions + eye contact
    frames = get_frames_from_video_bytes(video_bytes, every_nth=5)
    emotion_timeline, eye_contact_pct, _ = analyze_emotions_and_gaze(frames)

    # 4) Scoring
    s_sent = score_sentiment(sentiment)
    s_emot = score_emotion(emotion_timeline)
    total = overall_score(s_sent, eye_contact_pct, s_emot)

    return {
        "transcript": transcript,
        "sentiment_series": sentiment,
        "emotion_timeline": emotion_timeline,
        "eye_contact_pct": eye_contact_pct,
        "scores": {
            "sentiment": round(s_sent, 1),
            "eye_contact": round(eye_contact_pct, 1),
            "emotion": round(s_emot, 1),
            "overall": total,
        },
    }
