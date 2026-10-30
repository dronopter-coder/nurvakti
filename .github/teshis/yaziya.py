# Seslendirmeyi kelime zamanlarıyla yazıya döker (video altyazısı ve sahne geçişleri için; yalnızca teşhis)
import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
seg, info = m.transcribe(sys.argv[1], language="tr", word_timestamps=True, vad_filter=False, beam_size=5)
out = []
for s in seg:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    out.append([round(s.start, 2), round(s.end, 2), s.text.strip(), [[round(w.start, 2), round(w.end, 2), w.word.strip()] for w in s.words]])
print("JSON:" + json.dumps(out, ensure_ascii=False))
