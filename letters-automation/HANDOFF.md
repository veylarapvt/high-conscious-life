# Letters From Your Future Self — Handoff / Continuation Brief

> Give this file to a new session. It captures the full feature, every decision, the
> current state, and exactly what's left to do. All files referenced live in this
> folder (`letters-automation/`) in the repo `veylarapvt/high-conscious-life`.

## 1. What this feature is
An email automation for **High Conscious Life** (highconsciouslife.in), a mental-wellness
brand for urban Indian professionals. People subscribe (via Instagram → Tally form), and
receive personalized emails written as if from **their own future self, 5 years from now**,
arriving on **one random day each week**.

**Hard constraint: NO AI at runtime, zero recurring cost.** Letters come from a
pre-written 12-letter bank (`letters.json`) with merge-field personalization. Free tiers only:
Resend (3,000 emails/mo), the user's existing n8n cloud, free Google Sheets.

## 2. Architecture
```
Instagram (ManyChat, keyword "FUTURE") → auto-DM with Tally link
Tally form (first_name, email, dream_answer) → webhook → n8n Workflow 1 (Intake)
  → dedupe vs Google Sheet → append row → send Letter #1 via Resend → set next_send_date = +2 days
n8n Workflow 2 (Scheduler): daily cron 7:30 AM IST
  → read sheet → whoever's next_send_date == today & active → send their next letter via Resend
  → letter_count++, last_sent_date = today, next_send_date = today + random(5–9) days
n8n Workflow 3 (Preview): manual trigger to email yourself any letter 1–12 for review
```
- **n8n instance:** `veylara.app.n8n.cloud`
- **Intake webhook path:** `/webhook/letters-intake` (production)
- **Email sender (Resend):** `Your Future Self · High Conscious Life <letters@highconsciouslife.in>`
- **Unsubscribe:** `mailto:letters@highconsciouslife.in?subject=Unsubscribe me` + `List-Unsubscribe` header (mailto). Real 1-click unsubscribe = optional future upgrade.

## 3. Files in this folder (all committed & pushed to master)
| File | Purpose |
|---|---|
| `letters.json` | The 12 letters. Each: `{ id, subject, body: [ "paragraph", ... ] }` |
| `email-template.html` | Cream/paper/forest-green/gold email design (inline CSS, Georgia serif, Gmail-mobile safe). Placeholders `{{BODY}}`, `{{unsubscribe_url}}` |
| `n8n-code-intake.js` | Readable copy of Intake "Build Letter" code node (letters + template + logic embedded) |
| `n8n-code-scheduler.js` | Readable copy of Scheduler "Prepare Sends" code node |
| `n8n-code-preview.js` | Readable copy of Preview "Choose Letter" code node |
| `n8n-workflow-1-intake.json` | Importable n8n workflow (validated JSON) |
| `n8n-workflow-2-scheduler.json` | Importable n8n workflow (validated JSON) |
| `n8n-workflow-3-preview.json` | Importable n8n workflow (validated JSON) |
| `.env.example` | Reference of needed values (RESEND_API_KEY, SHEET_ID) — no AI keys |
| `SETUP.md` | Full step-by-step setup + testing guide |

## 4. Google Sheet (subscriber DB)
- Tab name: **`Subscribers`**. Row 1 headers **exactly**:
  `first_name | email | dream_answer | signup_date | letter_count | last_sent_date | next_send_date | status`
- Dates stored as `YYYY-MM-DD` (IST). `status` = `active` | `unsubscribed`.
- Google Sheets nodes use **Map Automatically** (auto-map by header name); Scheduler updates via
  `appendOrUpdate` matched on `email`.

## 5. Merge fields (available in any letter subject/body)
`{{first_name}}`, `{{dream_answer}}`, `{{future_date}}` (= send date + 5 years, e.g. "March 14, 2031"),
`{{future_year}}` (send year + 5). Computed in the code node in Asia/Kolkata time.

## 6. Letter selection / loop logic
`next id = letter_count + 1`. New signup has `letter_count 0` → Letter 1 (stored as 1).
After Letter 12 it loops **back to 5** and cycles 5→12 forever (letters 1–4 = onboarding arc,
never repeat). Code: `let n = count+1; if (n > 12) n = 5 + ((n-5) % 8);`

## 7. The 12 letters (arc)
1 Arrival/proof · 2 Noticing · 3 Returning · 4 Residing · 5 Stillness · 6 Self-trust ·
7 Clearing mental noise · 8 Inner child · 9 Rest · 10 Comparison · 11 Small consistent action · 12 Gratitude.
- `{{dream_answer}}` woven into letters **1, 3, 6, 9**.
- Soft P.S. inviting to High Conscious Life in letters **3, 6, 9, 12**.
- Every letter: opens "Hey {{first_name}}," + "It's {{future_date}}.", ends "— you, five years from now",
  contains one concrete "This week:" action. No emojis, no coaching jargon, no promised external outcomes.
- **User intends to edit these into her own voice before launch** (she is the facilitator, Pradhishta).

## 8. Workflow node graphs
**WF1 Intake:** Webhook (POST letters-intake, responseNode) → Normalize Input (Code; reads flat JSON
or Tally `data.fields` by label) → Read Subscribers (Google Sheets read, alwaysOutputData) →
Check Duplicate (Code; compares email) → Is New? (IF on `_duplicate`) → [true] Respond Already Subscribed
/ [false] Build Letter (Code; renders Letter 1 + builds row) → Send Email (HTTP POST api.resend.com/emails,
Header Auth) → Save Row (Code) → Append Subscriber (Google Sheets append, auto-map) → Respond OK.

**WF2 Scheduler:** Schedule Trigger (cron `30 7 * * *`, workflow timezone Asia/Kolkata) →
Read Subscribers (Google Sheets read) → Prepare Sends (Code; filters active + due today, renders next
letter, computes updated row incl. random 5–9 day reschedule) → Send Email (HTTP Resend) →
Build Row (Code) → Update Subscriber (Google Sheets appendOrUpdate matched on email).

**WF3 Preview:** Manual Trigger → Choose Letter (Code; edit LETTER_ID/TEST_EMAIL/TEST_NAME/TEST_DREAM
at top; subject prefixed `[TEST]`) → Send Email (HTTP Resend).

Resend HTTP body (all workflows):
`={{ JSON.stringify({ from: 'Your Future Self · High Conscious Life <letters@highconsciouslife.in>', to: [$json.to], subject: $json.subject, html: $json.html, headers: { 'List-Unsubscribe': '<mailto:letters@highconsciouslife.in?subject=Unsubscribe%20me>' } }) }}`

## 9. IMPORTANT — n8n connector reality (discovered this session)
- The **n8n MCP connector cannot import exported workflow JSON.** It only creates workflows from
  **n8n Workflow SDK code** (`create_workflow_from_code`). Hand-translating the letter-heavy code
  nodes into SDK code is error-prone (nested quotes/regex in the jsCode string don't survive escaping).
- **Credentials currently in the user's n8n** (via `list_credentials`):
  - `Google Sheets account` — type `googleSheetsOAuth2Api`, id `a3lDls8ptt444Dau` (personal project `sQIPdjkQNRlaajiy`)
  - `Google Sheets account 2` — id `tx9Ogq6D8dyvnOnf`
  - `Gmail account` — type `gmailOAuth2`, id `9bvFM0vGHnnnsfQk`
  - **No Resend credential yet.** **No Google service-account (`googleApi`) credential** — so use the
    existing **Google Sheets OAuth** credential, not a service account (the JSON files assumed a service
    account; on UI import the user just re-selects OAuth).

### Two ways to get the workflows into n8n
- **(A) UI import (recommended, reliable, keeps embedded design):** n8n → ⋯ → Import from File → the 3
  JSON files. Then pick `Google Sheets account` on the Sheets nodes, create a Resend Header-Auth
  credential (`Authorization = Bearer re_…`) for the Send nodes.
- **(B) Push via connector (`create_workflow_from_code`):** requires reworking the code nodes to **fetch
  `letters.json` + `email-template.html` from the live site** (`https://www.highconsciouslife.in/letters-automation/…`)
  instead of embedding them (keeps jsCode small enough to author in SDK reliably). Still zero-cost.
  If the next session does this: use SDK `newCredential('Resend API')` for the HTTP send, and reference the
  existing Google Sheets OAuth credential id `a3lDls8ptt444Dau`. Avoid regex/backticks in the jsCode string.

## 10. Status
- **DONE:** all 12 letters drafted, email template, 3 importable workflow JSONs (validated), 3 readable
  code files, `.env.example`, `SETUP.md`. All committed/pushed. Files are also live (public, no secrets) at
  `highconsciouslife.in/letters-automation/…`.
- **PENDING (user / next session):**
  1. Decide path A or B above and get the 3 workflows into n8n.
  2. Create the Google Sheet with the 8 headers; wire the Sheets credential.
  3. Get a Resend API key; verify sender domain (highconsciouslife.in is already verified for the site's
     other emails, so `letters@` should work).
  4. Give the Intake webhook URL to Tally; set up ManyChat keyword `FUTURE`; record the reel.
  5. Test end-to-end with the user's own email first (SETUP.md §5). Edit letters into her voice.
  6. Optional: build a real 1-click unsubscribe webhook workflow (sets `status = unsubscribed`).

## 11. Manual setup the user does (not code)
- Tally form: First name → Email → "In one line, what does your dream life look like in 5 years?"
  (label the questions so they contain "name", "email", "dream"/"life"). Tally → Integrations → Webhooks → paste n8n intake URL.
- Instagram must be a Professional/Creator account (her known blocker). ManyChat free: keyword "FUTURE"
  on a reel → auto-DM: "okay, sending you your first letter 🌱 drop your details here →" + Tally link.
- Reel: "pov: you get an email from yourself... from 2031" + screen-record a letter opening in Gmail.
