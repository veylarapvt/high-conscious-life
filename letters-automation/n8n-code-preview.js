// ============================================================================
// n8n Code node — PREVIEW  ("Choose Letter")
// Manually send yourself any letter (1-12) to preview it. No sheet needed.
// EDIT the four values in the CONFIG block below, then Execute the workflow.
// ============================================================================

// ===== EDIT ME =====
const LETTER_ID  = 1;                               // which letter to send (1..12)
const TEST_EMAIL = 'highconsciouslife@gmail.com';   // where to send it
const TEST_NAME  = 'Pradhishta';                    // sample first name
const TEST_DREAM = 'a calm morning routine and work I love'; // sample dream_answer
// ===================

const LETTERS = [
  { id: 1, subject: "A message from your future self", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. Five years from the day you sat down, a little unsure, and typed out what you wanted your life to feel like. I know this is strange — an email from you, to you. But I promise it's real. I'm writing on a quiet morning, tea going cold beside me, and I wanted you to know: we made it here.",
    "The life you described — {{dream_answer}} — I remember writing that down. I remember how far away it felt, like something that happened to other people. It didn't arrive all at once. It arrived in small, ordinary choices you're about to start making. This is one of them.",
    "You don't need to believe me yet. You only need to stay. These letters will find you on random days, whenever you least expect them. Read them slowly. They're the only proof I can send back through time.",
    "This week: tonight, before you sleep, write down one honest sentence about how you actually feel — not how you think you should feel. Just true.",
    "I've got you. I always did.",
    "— you, five years from now"
  ]},
  { id: 2, subject: "I wrote to you again", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. I'm back — I told you I would be.",
    "From here, the thing I'm most grateful you learned is how to notice. Right now your days probably blur together: wake, scroll, work, worry, sleep, repeat. You move through them like a train that never stops at a single station. I remember that speed. I remember how tiring it was to be everywhere except where I actually was.",
    "Noticing is where it started to change. Not a retreat, not a course — just catching yourself. The warmth of the cup in your hands. The particular grey of the sky. The breath you'd been holding without knowing. You started collecting these small moments like coins, and slowly you felt less poor.",
    "You don't have to fix anything. You only have to see it.",
    "This week: once a day, pause for ten seconds and name three things you can hear. That's all. Ten seconds. You'd be amazed what a life is made of when you finally look.",
    "— you, five years from now"
  ]},
  { id: 3, subject: "From {{future_year}}", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. Writing to you from a version of your life that still surprises me some mornings.",
    "I want to tell you about returning. You're going to drift — from yourself, from your intentions, from the quiet you're only beginning to find. Everyone does. The difference isn't that I stopped drifting. It's that I got faster at coming back.",
    "The life you once described — {{dream_answer}} — I remember writing that down. What I didn't understand then was that it wasn't a destination. It was a direction I had to keep choosing, gently, after every time I lost it. You'll forget all of this by next Tuesday. That's fine. Just return.",
    "Be kinder to yourself in the forgetting. The harshness you carry — you can set some of it down. It was never helping anyway.",
    "This week: the next time you catch yourself spiralling, don't fight the thought. Just say, quietly, I'm here now, and take one slow breath. Then carry on.",
    "— you, five years from now",
    "P.S. When you're ready to practise this with others instead of alone, High Conscious Life is where I found my people. No rush — the door stays open."
  ]},
  { id: 4, subject: "You almost gave up on this", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. Some part of you wants to unsubscribe from these by now — too gentle, too slow, nothing happening. Stay a little longer. I know, because I almost quit on myself around here too.",
    "This one is about residing. Noticing was catching the moment. Returning was coming back to it. Residing is staying — actually living inside your own life instead of hovering above it, planning the next one.",
    "You've spent years being a guest in your own days: polite, distracted, always half-packed to leave for somewhere better. From where I sit, I can tell you there is no better somewhere. There's only here, made deeper. The peace you're chasing was never in the achievement. It's in how present you are for an ordinary Tuesday.",
    "Move in. Unpack. This is your life, and it's allowed to be enough.",
    "This week: eat one meal with no screen and no scrolling — just the food and you. Taste it like you mean it.",
    "— you, five years from now"
  ]},
  { id: 5, subject: "The quiet you're looking for", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. The house is still, and I've learned to love it this way.",
    "Stillness used to frighten you. The moment things went quiet, your mind would rush in to fill the silence — a worry, a plan, a video, anything but the emptiness. You treated stillness like a problem to solve. It took me years to understand it was the answer, not the problem.",
    "Nothing dramatic happens in the stillness. That's the point. You sit, the noise keeps knocking, and you simply don't answer the door. Underneath all that mental traffic you find something that was always there, patient, waiting: you. The real one. The one who isn't performing for anybody.",
    "You don't need a mountain or a monastery. You need five honest minutes and the willingness to be a little bored.",
    "This week: one morning, don't touch your phone for the first twenty minutes after you wake. Let the day begin before a screen decides how you feel.",
    "— you, five years from now"
  ]},
  { id: 6, subject: "You knew before you knew", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. I trust myself now, and I want to tell you how that happened, because it's the quiet miracle of these five years.",
    "You outsource everything right now — what to want, how to live, whether you're doing enough. You check the opinion of everyone except the one person who actually has to live your life. I did that for years. So loud on the outside, so unheard on the inside.",
    "The life you once wrote down — {{dream_answer}} — you already knew it was right. You felt it in your body before your mind agreed. That knowing was self-trust: small, unpractised, real. It grows the way a muscle does — by being used, especially when you're unsure.",
    "Start listening to yourself like someone worth listening to. You are.",
    "This week: make one small decision purely on instinct — where to eat, what to read, whether to say yes — without asking anyone or looking it up. Then notice that you survived.",
    "— you, five years from now",
    "P.S. If you'd like a room full of people learning to hear themselves again, that's exactly what we do at High Conscious Life. Come sit with us sometime."
  ]},
  { id: 7, subject: "Too many tabs open", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. My mind is quieter than you'd believe possible. I remember yours — mine — and the way it used to run.",
    "You've got too many tabs open, all the time. Conversations you're replaying, decisions you haven't made, people you're managing in your head, a low hum of should and shouldn't that never fully switches off. You think that's just how a mind is. It isn't. That's just a mind that's never been allowed to close anything.",
    "Clearing the noise isn't about silencing your thoughts. It's about no longer believing all of them. Most of what your mind says is old fear wearing today's clothes. You can hear a thought without obeying it. You can let it pass through like weather.",
    "The relief, when it came, wasn't loud. It was just space. Room to breathe between one thought and the next.",
    "This week: pick one worry you keep rehearsing and write it on paper, fully, once. Then close the notebook. You've heard it. It doesn't need to keep knocking.",
    "— you, five years from now"
  ]},
  { id: 8, subject: "The kid you used to be", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. I found an old photo of us today — small, gap-toothed, completely unbothered — and I sat with it for a long while.",
    "That kid is still in there. Under the deadlines and the composure and the careful adult you've built, there's a version of you who just wanted to feel safe, seen, and allowed to play. A lot of your tiredness isn't about work. It's about how long you've gone without checking on them.",
    "I stopped being so hard on that kid. When I got something wrong, I caught the old cruel voice and tried the voice you'd use with a child you love. It felt fake at first. Then it felt like coming home.",
    "You're allowed to be soft with yourself. You were never meant to earn your own kindness.",
    "This week: do one small thing purely because it would have delighted you at eight years old — a comic, a swing, an ice cream eaten too fast. No reason, no usefulness. Just joy.",
    "— you, five years from now"
  ]},
  { id: 9, subject: "Permission to rest", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. I'm writing this from bed, unhurried, on a working day — and no part of me feels guilty about it. That, more than anything, is how I know we changed.",
    "You treat rest like a reward you haven't earned yet. You'll relax once the list is done — but the list is never done, so you never quite stop. I lived at that pace for years, mistaking exhaustion for importance.",
    "The life you described — {{dream_answer}} — none of it was worth reaching as a burnt-out person too tired to enjoy it. What I really wanted, underneath the ambition, was to feel rested and awake in my own life. That turned out to be available far sooner than the dream. It only needed permission.",
    "Rest isn't the opposite of a good life. It's the ground a good life grows in.",
    "This week: block twenty minutes for doing genuinely nothing — no phone, no goal, no productivity. Lie down. Look at the ceiling. Let it be useless.",
    "— you, five years from now",
    "P.S. A lot of us at High Conscious Life are learning to slow down together — it's far easier in company. There's a seat for you whenever you'd like one."
  ]},
  { id: 10, subject: "Stop measuring", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. I barely compare myself to anyone anymore, and the freedom of it still feels like taking off a heavy coat I forgot I was wearing.",
    "You lose so many evenings to other people's lives right now — the scroll, the highlight reels, the quiet math of am I behind. It's a rigged game. You're holding your ordinary insides up against everyone else's edited outsides, and you always walk away feeling smaller. It was never a fair fight.",
    "Here's what I know from here: most of the people you envy are just as unsure as you, in nicer lighting. And the life that finally felt good wasn't the impressive one. It was the honest one — yours, at your own pace, measured against no one.",
    "Your path was never behind. It was only ever yours.",
    "This week: for one day, when the urge to compare rises, gently close the app and ask yourself what you actually want right now. Then give yourself a little of that instead.",
    "— you, five years from now"
  ]},
  { id: 11, subject: "How it actually happened", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. People sometimes ask how my life changed, and they always look a little disappointed by the answer. There was no lightning. There was just repetition.",
    "You're waiting for a big moment — the grand decision, the fresh start on Monday, the version of you who finally has it together. I waited for that too. It never came. What came instead were tiny, unglamorous actions, repeated on days I didn't feel like it, until they quietly became who I was.",
    "Five honest minutes of stillness. One kind word to myself. One walk. One early night. None of them impressive alone. All of them together, over years, rebuilt me completely. Consistency is the least exciting and most powerful thing I know.",
    "Don't try to change your life this week. Just don't skip the small thing twice in a row.",
    "This week: choose one two-minute habit — a stretch, a breath, a single page — and do it every day, badly if you must. Just don't break the chain.",
    "— you, five years from now"
  ]},
  { id: 12, subject: "Thank you, from {{future_year}}", body: [
    "Hey {{first_name}},",
    "It's {{future_date}}. This is the last of the first set of letters, and I wanted to end where everything actually turned: gratitude.",
    "Not the forced kind. Not the gratitude-journal-as-another-chore kind. The real kind, that sneaks up on you on an unremarkable evening and tightens your throat for no reason at all. I have so much of that now, and almost none of it is about achievements. It's the light through the window. Someone's laugh. The plain fact of being here, awake, at all.",
    "You have more to be grateful for today than you can currently feel. That's not a failing — it's just that gratitude, like any muscle, has gone a little unused. It comes back quickly once you turn toward it.",
    "Thank you, {{first_name}} — for staying, for reading, for beginning. I exist because you didn't give up on this. I'm the proof it was worth it.",
    "This week: tonight, name three things from today you're genuinely glad happened. The small ones count most.",
    "— you, five years from now",
    "P.S. Wherever this reaches you, know there's a whole community at High Conscious Life walking this same quiet path. You were never doing it alone."
  ]}
];

const TEMPLATE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background-color:#F5F0E8;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;"><tr><td align="center" style="padding:32px 14px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#FCFAF4;border:1px solid #EAE0CE;"><tr><td style="height:4px;line-height:4px;font-size:0;background-color:#4A6741;">&nbsp;</td></tr><tr><td style="padding:38px 34px 30px 34px;"><p style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A6741;">A letter from your future self</p><h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:25px;line-height:1.3;color:#2E2A22;">A message from your future self</h1><div style="width:46px;height:1px;line-height:1px;font-size:0;background-color:#C9A84C;margin:0 0 22px 0;">&nbsp;</div><div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.85;color:#3A342A;">{{BODY}}</div></td></tr></table><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;"><tr><td style="padding:20px 34px 40px 34px;text-align:center;font-family:Georgia,'Times New Roman',serif;color:#8A8474;"><p style="margin:0 0 6px 0;font-size:13px;">High Conscious Life &middot; <a href="https://highconsciouslife.in" style="color:#4A6741;text-decoration:none;">highconsciouslife.in</a></p><p style="margin:0;font-size:11px;line-height:1.6;color:#A8A290;">You're receiving this because you signed up for Letters From Your Future Self.<br><a href="{{unsubscribe_url}}" style="color:#8A8474;text-decoration:underline;">Unsubscribe</a></p></td></tr></table></td></tr></table></body></html>`;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const UNSUBSCRIBE = "mailto:letters@highconsciouslife.in?subject=Unsubscribe%20me";

function istToday() { return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

const today = istToday();
const p = today.split("-").map(Number);
const f = {
  first_name: TEST_NAME,
  dream_answer: TEST_DREAM,
  future_date: MONTHS[p[1] - 1] + " " + p[2] + ", " + (p[0] + 5),
  future_year: String(p[0] + 5)
};
const merge = s => String(s).replace(/{{\s*(\w+)\s*}}/g, (m, k) => (f[k] !== undefined ? f[k] : m));
const L = LETTERS.find(x => x.id === LETTER_ID) || LETTERS[0];
const subject = "[TEST] " + merge(L.subject);
const bodyHtml = (L.body || []).map(function (raw) {
  const line = merge(raw);
  if (line.indexOf("P.S.") === 0) return '<p style="margin:22px 0 0 0;font-size:14px;font-style:italic;color:#7A7568;">' + esc(line) + '</p>';
  if (line.indexOf("—") === 0) return '<p style="margin:24px 0 0 0;font-size:16px;color:#4A6741;">' + esc(line) + '</p>';
  return '<p style="margin:0 0 18px 0;">' + esc(line) + '</p>';
}).join("");
const html = TEMPLATE.replace("{{BODY}}", bodyHtml).split("{{unsubscribe_url}}").join(UNSUBSCRIBE);

return [{ json: { to: TEST_EMAIL, subject: subject, html: html } }];
