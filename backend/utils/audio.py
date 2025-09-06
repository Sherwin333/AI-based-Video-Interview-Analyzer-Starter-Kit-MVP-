# backend/utils/audio.py
import tempfile
import subprocess
import os

# Use faster_whisper but force CPU; tiny model for fast dev
try:
    from faster_whisper import WhisperModel
except Exception:
    WhisperModel = None

_whisper = None

def get_whisper():
    """
    Initialize WhisperModel on CPU using a small model for development.
    device='cpu' forces CPU; compute_type int8 is CPU-friendly.
    """
    global _whisper
    if _whisper is None:
        if WhisperModel is None:
            raise RuntimeError("faster_whisper is not installed. Install faster-whisper or stub transcribe() for dev.")
        # Use tiny for speed on CPU. Change to "base" when you want higher accuracy.
        _whisper = WhisperModel("tiny", device="cpu", compute_type="int8")
    return _whisper


def extract_audio_ffmpeg(video_bytes: bytes, ext: str = "webm") -> str:
    """
    Write incoming bytes to a temp file, use ffmpeg to extract mono 16k WAV.
    """
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
    """
    Extract audio and run ASR. If faster-whisper isn't installed,
    raise an informative error (or stub this in dev).
    """
    audio_path = extract_audio_ffmpeg(video_bytes)
    model = get_whisper()
    segments, info = model.transcribe(audio_path)

    text = " ".join([s.text for s in segments])

    try:
        os.remove(audio_path)
    except Exception:
        pass

    return text.strip()
