import tempfile
import subprocess
import os
from faster_whisper import WhisperModel

_whisper = None


def get_whisper():
    global _whisper
    if _whisper is None:
        _whisper = WhisperModel("base", compute_type="int8")
    return _whisper


def extract_audio_ffmpeg(video_bytes: bytes, ext: str = "mp4") -> str:
    # writes bytes -> temp video -> extracts wav mono 16k
    vfd = tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}")
    vfd.write(video_bytes)
    vfd.flush()
    vfd.close()

    out_wav = vfd.name + ".wav"
    cmd = [
        "ffmpeg", "-y", "-i", vfd.name,
        "-ac", "1", "-ar", "16000", out_wav
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return out_wav


def transcribe(video_bytes: bytes) -> str:
    audio_path = extract_audio_ffmpeg(video_bytes)
    model = get_whisper()
    segments, info = model.transcribe(audio_path)

    text = " ".join([s.text for s in segments])

    try:
        os.remove(audio_path)
    except Exception:
        pass

    return text.strip()
