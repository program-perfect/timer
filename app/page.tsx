"use client";

import { MovableContainer } from "@/components/MovableContainer"
import { TimerDisplay } from "@/components/TimerDisplay"
import { formatTimer } from "@/lib/time"
import { useEffect, useMemo, useState } from "react"

const START_SECONDS = 15 * 60;
const STORAGE_KEY = "screen-prop-timer-started-at";

export default function Page() {
  const [remaining, setRemaining] = useState(START_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  const digits = useMemo(() => formatTimer(remaining).split(""), [remaining]);

  useEffect(() => {
    const savedStart = window.localStorage.getItem(STORAGE_KEY);

    if (!savedStart) {
      return;
    }

    const elapsed = Math.floor((Date.now() - Number(savedStart)) / 1000);
    const nextRemaining = Math.max(0, START_SECONDS - elapsed);

    setRemaining(nextRemaining);
    setIsRunning(nextRemaining > 0);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      const savedStart = window.localStorage.getItem(STORAGE_KEY);

      if (!savedStart) {
        return;
      }

      const elapsed = Math.floor((Date.now() - Number(savedStart)) / 1000);
      const nextRemaining = Math.max(0, START_SECONDS - elapsed);

      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        setIsRunning(false);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  function startTimer() {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setRemaining(START_SECONDS);
    setIsRunning(true);
  }

  function stopTimer() {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsRunning(false);
  }

  function resetTimer() {
    window.localStorage.removeItem(STORAGE_KEY);
    setRemaining(START_SECONDS);
    setIsRunning(false);
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_center,rgba(120,0,0,0.24),transparent_48%),linear-gradient(145deg,#111,#030303_72%)] p-4 text-zinc-200">
      <MovableContainer>
        <section aria-label="Кино-реквизитный экранный таймер">
          <div className="relative rounded-[28px] border border-zinc-700/60 bg-zinc-950/95 p-4 shadow-[0_32px_90px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-8">
            <div className="pointer-events-none absolute inset-4 rounded-[20px] border border-white/5" />

            <div className="mb-4 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.32em] text-zinc-500 sm:text-xs">
              <span>Prop Screen</span>
              <span>{isRunning ? "Armed" : "Standby"}</span>
            </div>

            <TimerDisplay digits={digits} active={isRunning} />

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-zinc-500 sm:text-xs">
                <span
                  className={[
                    "size-2 rounded-full",
                    isRunning ? "bg-red-500 shadow-[0_0_18px_#ff1a1a]" : "bg-zinc-700"
                  ].join(" ")}
                />
                <span>{isRunning ? "Signal active" : "Signal idle"}</span>
              </div>

              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  onClick={startTimer}
                  className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-200 transition active:translate-y-px"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={stopTimer}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-300 transition active:translate-y-px"
                >
                  Stop
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-300 transition active:translate-y-px"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>
      </MovableContainer>
    </main>
  );
}