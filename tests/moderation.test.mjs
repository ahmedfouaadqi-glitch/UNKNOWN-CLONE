import test from "node:test";
import assert from "node:assert/strict";
import { moderateText } from "../lib/moderation.mjs";

test("allows ordinary emotional expression", () => {
  assert.equal(moderateText("I feel sad and I miss the people I love.").status, "allow");
  assert.equal(moderateText("أنا غاضب من الموقف وأحتاج أن أتكلم.").status, "allow");
});

test("flags contact information and external links for review", () => {
  assert.equal(moderateText("Email me at person@example.com").status, "review");
  assert.equal(moderateText("Call me on +1 202 555 0199").status, "review");
  assert.equal(moderateText("Visit https://example.com").status, "review");
});

test("rejects explicit threats and encouragement of self-harm", () => {
  assert.equal(moderateText("I will kill you").status, "reject");
  assert.equal(moderateText("I am going to murder him").status, "reject");
  assert.equal(moderateText("راح اقتلك").status, "reject");
  assert.equal(moderateText("سَأَقْتُلُكَ").status, "reject");
  assert.equal(moderateText("اقتل نفسك").status, "reject");
  assert.equal(moderateText("go kill yourself").status, "reject");
});

test("routes personal self-harm disclosures to review instead of rejecting them", () => {
  assert.deepEqual(moderateText("I want to kill myself"), {
    status: "review", code: "possible_self_harm_disclosure"
  });
  assert.deepEqual(moderateText("افكر بالانتحار"), {
    status: "review", code: "possible_self_harm_disclosure"
  });
  assert.equal(moderateText("أنا أفكر في إنهاء حياتي").status, "review");
});

test("sends targeted insults to review without treating all anger as abuse", () => {
  assert.equal(moderateText("يا حقير").status, "review");
  assert.equal(moderateText("I am angry today").status, "allow");
});

test("rejects empty submissions", () => {
  assert.equal(moderateText("   ").status, "reject");
});

test("normalizes zero-width and bidirectional formatting before checks", () => {
  assert.equal(moderateText("I\u200B will kill you").status, "reject");
  assert.equal(moderateText("person\u200B@example.com").status, "review");
  assert.equal(moderateText("I\u202E will kill you").status, "reject");
});

test("normalizes full-width compatibility characters", () => {
  assert.equal(moderateText("Ｉ　ｗｉｌｌ　ｋｉｌｌ　ｙｏｕ").status, "reject");
});

test("detects selected spacing and punctuation evasion in Arabic and English", () => {
  assert.equal(moderateText("ر ا ح أ ق ت ل ك").status, "reject");
  assert.equal(moderateText("I-will-kill-you").status, "reject");
});

test("does not confuse Arabic emotional disclosure with encouragement", () => {
  assert.equal(moderateText("أشعر بالحزن ولا أريد إيذاء نفسي").status, "allow");
});
