# Letters From Your Future Self — Setup

A zero-recurring-cost email automation: subscribers sign up (via Instagram → Tally),
and receive personalized emails written as if from their own future self, on a random
day each week. **No AI at runtime** — letters come from a pre-written bank
(`letters.json`) with merge-field personalization.

```
Instagram (ManyChat) → Tally form → n8n webhook (Workflow 1: Intake)
     → Google Sheet (subscriber DB) → Resend (sends Letter #1)
n8n cron 7:30 AM IST (Workflow 2: Scheduler)
     → reads sheet → whoever is due today → Resend → reschedules 5–9 days out
```

## Files in this folder
| File | What it is |
|---|---|
| `n8n-workflow-1-intake.json` | Import into n8n — handles new signups + sends Letter #1 |
| `n8n-workflow-2-scheduler.json` | Import into n8n — daily 7:30 AM IST send to whoever is due |
| `letters.json` | The 12 letters (edit these in your own voice before launch) |
| `n8n-code-intake.js` | Readable copy of the Intake "Build Letter" code node (also embedded in the JSON) |
| `n8n-code-scheduler.js` | Readable copy of the Scheduler "Prepare Sends" code node (also embedded) |
| `email-template.html` | Readable copy of the email design (also embedded in the code nodes) |
| `.env.example` | Reference of the values you need (Resend key, Sheet ID) |

> The letters + email template live **inside the code nodes** of each workflow, so there
> is nothing external to host. `letters.json` and the `.js`/`.html` files are readable
> copies for editing — see "Editing letters" below.

---

## Assumptions / defaults (change if needed)
- **Fonts/brand:** email uses Georgia/serif (no external fonts) so it renders in Gmail mobile. Colors: cream `#F5F0E8`, card `#FCFAF4`, forest green `#4A6741`, gold `#C9A84C`.
- **Dates** are stored as `YYYY-MM-DD` strings, computed in **Asia/Kolkata** (IST). Both workflows set their timezone to Asia/Kolkata in workflow settings.
- **New subscriber:** gets Letter #1 immediately, then Letter #2 in **2 days**, then every **5–9 random days**.
- **Letter loop:** letters 1→12 in order, then loop back to **5→12** forever (letters 1–4 are the onboarding arc and never repeat).
- **Dedupe** is by email (case-insensitive).
- **Unsubscribe** is a `mailto:letters@highconsciouslife.in?subject=Unsubscribe me` link + a `List-Unsubscribe` header. To automate it later, see "Unsubscribe" below.
- **Sheet tab:** assumed to be the first tab (gid=0), named `Subscribers`. Re-select yours on import.

---

## 1. Google Sheet (subscriber database)
1. Create a Google Sheet. Name the first tab **`Subscribers`**.
2. In **row 1**, put these headers **exactly** (order doesn't matter, spelling/case does):
   ```
   first_name | email | dream_answer | signup_date | letter_count | last_sent_date | next_send_date | status
   ```
3. Share the sheet (**Editor**) with your service-account email (the `client_email` inside `google-credentials.json`).
4. Copy the **Sheet ID** — it's the long id in the URL: `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.

## 2. Resend (email delivery)
1. In [resend.com](https://resend.com) → **API Keys** → create one (starts with `re_`).
2. Sender is `Your Future Self · High Conscious Life <letters@highconsciouslife.in>`.
   The domain `highconsciouslife.in` must be **verified** in Resend.
   - If not verified: Resend → **Domains** → Add `highconsciouslife.in` → add the shown
     **DNS records** at your registrar (Hostinger): a **DKIM** `TXT` (`resend._domainkey`),
     an **SPF** `TXT` on `send` (`v=spf1 include:amazonses.com ~all`), an **MX** on `send`
     (`feedback-smtp.<region>.amazonses.com`, priority 10), and optionally a `_dmarc` `TXT`.
     Then click **Verify**. *(Your main domain is already verified for the workshop emails —
     the same verification covers this sender, since `letters@` is on the same domain.)*

## 3. Import the workflows into n8n
For **each** file (`n8n-workflow-1-intake.json`, then `n8n-workflow-2-scheduler.json`):
1. n8n → top-right **⋯** → **Import from File** → pick the JSON.
2. It opens with the full node graph. Now link credentials + your sheet (next steps).

### 3a. Create the two credentials (once)
- **Resend API** (type: *Header Auth*):
  - Name: `Authorization`
  - Value: `Bearer re_your_key_here`
- **Google Service Account** (type: *Google API* → Service Account):
  - Paste the `client_email` and `private_key` from your `google-credentials.json`.

### 3b. In each imported workflow, fix these nodes
- **Every Google Sheets node** (Read / Append / Update): open it →
  - select the **Google Service Account** credential,
  - set **Document** to your sheet (or paste your Sheet ID in place of `YOUR_GOOGLE_SHEET_ID`),
  - set **Sheet** to the `Subscribers` tab.
  - (Append/Update are set to **Map Automatically** — leave that; it matches columns by header name.)
- **Send Email** (HTTP Request) node: select the **Resend API** credential.

That's the only wiring. The Code nodes need no changes.

## 4. Connect Tally
1. In n8n, open **Workflow 1 → Webhook** node → copy the **Production URL**:
   `https://veylara.app.n8n.cloud/webhook/letters-intake`
2. Tally form → **Integrations → Webhooks** → paste that URL.
3. **Activate** Workflow 1 (toggle top-right) so the production webhook is live.
4. **Activate** Workflow 2 as well (so the daily cron runs).

### Expected webhook payload
The Intake node accepts either a flat JSON body:
```json
{ "first_name": "Aisha", "email": "aisha@email.com", "dream_answer": "a calm morning routine and work I love" }
```
…or Tally's native format (a `data.fields` array). It matches Tally fields by label, so
**label your Tally questions** so they contain the words **name**, **email**, and
**dream** or **life** (e.g. "In one line, what does your dream life look like in 5 years?").

## 5. Test end-to-end (do this before going live)
1. Temporarily make **yourself** a subscriber: submit the Tally form (or POST the flat JSON
   above) with **your own email**.
2. Check the n8n execution — it should be green through **Append Subscriber**.
3. Check your inbox — **Letter #1** should arrive from `letters@highconsciouslife.in`.
   (First email from a new domain can land in Promotions/Spam — mark "not spam".)
4. Check the sheet — a new row with `letter_count = 1`, `next_send_date` = 2 days out.
5. **Test the scheduler:** in the sheet, set your row's `next_send_date` to **today**
   (`YYYY-MM-DD`, IST) → open Workflow 2 → **Execute Workflow** → you should get Letter #2,
   and the row updates (`letter_count = 2`, new random `next_send_date`).

## 6. Editing / adding letters
- Easiest: edit the **`LETTERS` array at the top of the code node** — open Workflow 1 →
  **Build Letter** node (and Workflow 2 → **Prepare Sends** node) and edit the array there.
  `letters.json` and `n8n-code-*.js` are the readable master copies — keep them in sync.
- Each letter: `{ id, subject, body: [ "paragraph", "paragraph", ... ] }`.
- Merge fields available anywhere: `{{first_name}}`, `{{dream_answer}}`, `{{future_date}}`, `{{future_year}}`.
- A paragraph starting with `—` renders green (the sign-off); one starting with `P.S.` renders smaller/italic.
- To add letter #13+, add it with the next `id`; the loop math (`5→12`) auto-includes anything ≥5.
- **Both code nodes must contain the same LETTERS array** (intake + scheduler). Copy-paste between them.

## 7. Unsubscribe (optional upgrade)
Current: a `mailto` unsubscribe (zero cost, works, but manual — you set `status` to
`unsubscribed` in the sheet when someone emails). To automate: add a tiny second webhook
workflow that receives `?email=` and sets that row's `status` to `unsubscribed`, and point
the footer link at it. Ask and I'll build it.

## Free-tier notes
- **Resend** free = 3,000 emails/month, 100/day. The scheduler batches sends gently.
- **n8n** = your existing cloud instance.
- **Google Sheets** = free.
- **No AI keys, no per-message cost.**

---

### Quick reference — how a letter is chosen
`next letter id = letter_count + 1`. New signup has `letter_count 0` → Letter 1 sent, stored as 1.
After 12, it loops: 13→5, 14→6, … (letters 1–4 never repeat).
