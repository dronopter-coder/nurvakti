# Seslendirmeyi kelime zamanlarıyla yazıya döker (video altyazısı ve sahne geçişleri için; yalnızca teşhis)
import json, sys, wave
import numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
ham = wave.open(sys.argv[1]).readframes(10**9)  # 16 kHz tek kanal 16 bit WAV
ses = np.frombuffer(ham, np.int16).astype(np.float32) / 32768.0
seg, info = m.transcribe(ses, language="tr", word_timestamps=True, vad_filter=False, beam_size=5)
out = []
for s in seg:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    out.append([round(s.start, 2), round(s.end, 2), s.text.strip(), [[round(w.start, 2), round(w.end, 2), w.word.strip()] for w in s.words]])
print("JSON:" + json.dumps(out, ensure_ascii=False))
