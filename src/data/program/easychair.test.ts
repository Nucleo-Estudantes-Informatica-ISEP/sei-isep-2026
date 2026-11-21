import assert from "node:assert/strict";
import { test } from "node:test";
import { parseEasyChairProgram } from "./easychair.ts";

const session = (interval: string, title: string) =>
  `<div class="session"><a name="s"><div class="heading"><span class="interval">${interval}</span> <span class="title">${title}</span></div></a></div>`;

const lunch = `<div class="session"><div class="lunchbreak"><span class="interval">12:15-14:00</span><span class="title">Pausa para almoço</span></div></div>`;

test("strips the 'Session N:' prefix from titled sessions", () => {
  const { morning } = parseEasyChairProgram(
    session("09:15-09:30", "Session 1: Sessão de abertura") +
      lunch +
      session("14:00-15:00", "Session 4A"),
  );
  assert.equal(morning[0].title, "Sessão de abertura");
});

test("keeps the raw label for parallel-track sessions with no title", () => {
  const { afternoon } = parseEasyChairProgram(
    session("09:15-09:30", "Session 1: Abertura") +
      lunch +
      session("14:00-15:00", "Session 4A") +
      session("14:00-15:00", "Session 4B"),
  );
  assert.deepEqual(
    afternoon.map((i) => i.title),
    ["Session 4A", "Session 4B"],
  );
});

test("keeps the track label separately, only when the session has a title", () => {
  const { morning, afternoon } = parseEasyChairProgram(
    session("09:15-09:30", "Session 1: Abertura") +
      lunch +
      session("14:00-15:00", "Session 4A: Arquiteturas Web") +
      session("14:00-15:00", "Session 4B"),
  );
  assert.equal(morning[0].label, undefined);
  assert.equal(afternoon[0].title, "Arquiteturas Web");
  assert.equal(afternoon[0].label, "4A");
  assert.equal(afternoon[1].title, "Session 4B");
  assert.equal(afternoon[1].label, undefined);
});
