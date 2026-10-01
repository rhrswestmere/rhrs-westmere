import json
import sys

import pymupdf

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PDF = "C:/Users/armaa/AppData/Local/Temp/opencode/verify/appointment.pdf"
EXPECTED = "C:/Users/armaa/AppData/Local/Temp/opencode/verify/expected.json"

expected = json.load(open(EXPECTED, encoding="utf-8"))
doc = pymupdf.open(PDF)
text = "\n".join(page.get_text() for page in doc)
flat = " ".join(text.split())

failures = []

# 1. every panel value must appear on the letter, verbatim
for key, value in expected.items():
    v = " ".join(str(value).split())
    if not v:
        failures.append(f"{key}: expected value is empty")
    elif v not in flat:
        failures.append(f"{key}: '{v}' NOT found on the letter")

# 2. the appointment number must show twice (header box + details table)
no = expected["appointment_no"]
count = flat.count(no)
if count < 2:
    failures.append(f"appointment_no appears {count}x, expected >= 2")

# 3. no legacy/duplicated number prefixes anywhere on the letter
for bad in ("RHRS-APPT-", "RHRS-RCPT-", "undefined", "NaN", "Invalid Date"):
    if bad in flat:
        failures.append(f"forbidden token on letter: {bad}")

# 4. panel formatting equals letter formatting for the time
if expected["panel_time"] not in flat:
    failures.append(f"panel time '{expected['panel_time']}' missing on letter")

print("--- extracted letter text ---")
print(flat)
print("--- checks ---")
if failures:
    for f in failures:
        print("FAIL:", f)
    sys.exit(1)
print(f"OK: all {len(expected)} panel values present, appointment_no x{count}, no bad tokens")
