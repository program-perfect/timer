"use client";

import { MovableContainer } from "@/components/MovableContainer"
import { RelayTextureOverlay } from "@/components/RelayTextureOverlay"
import { TimerDisplay } from "@/components/TimerDisplay"
import { formatTimer } from "@/lib/time"
import { useEffect, useMemo, useRef, useState } from "react"

const START_SECONDS = 30;
const PRESET_SECONDS = [30, 60, 3 * 60, 5 * 60, 10 * 60, 15 * 60, 30 * 60];

const STORAGE_KEY = "screen-prop-timer-started-at";
const STORAGE_DURATION_KEY = "screen-prop-timer-duration";
const TIME_BUTTON_DELAY_MS = 3000;

export default function Page() {
  const [durationSeconds, setDurationSeconds] = useState(START_SECONDS);
  const [isTimePanelOpen, setIsTimePanelOpen] = useState(false);
  const [remaining, setRemaining] = useState(START_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeButtonVisible, setIsTimeButtonVisible] = useState(true);

  const showButtonTimeoutRef = useRef<number | null>(null);

  const digits = useMemo(() => formatTimer(remaining).split(""), [remaining]);

  useEffect(() => {
    const savedStart = window.localStorage.getItem(STORAGE_KEY);
    const savedDuration = Number(
      window.localStorage.getItem(STORAGE_DURATION_KEY) || START_SECONDS
    );

    if (!savedStart) {
      setDurationSeconds(savedDuration);
      setRemaining(savedDuration);
      setIsTimeButtonVisible(true);
      return;
    }

    const elapsed = Math.floor((Date.now() - Number(savedStart)) / 1000);
    const nextRemaining = Math.max(0, savedDuration - elapsed);

    setDurationSeconds(savedDuration);
    setRemaining(nextRemaining);
    setIsRunning(nextRemaining > 0);
    setIsTimeButtonVisible(nextRemaining <= 0);

    if (nextRemaining <= 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(STORAGE_DURATION_KEY);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (showButtonTimeoutRef.current !== null) {
        window.clearTimeout(showButtonTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      const savedStart = window.localStorage.getItem(STORAGE_KEY);
      const savedDuration = Number(
        window.localStorage.getItem(STORAGE_DURATION_KEY) || durationSeconds
      );

      if (!savedStart) {
        return;
      }

      const elapsed = Math.floor((Date.now() - Number(savedStart)) / 1000);
      const nextRemaining = Math.max(0, savedDuration - elapsed);

      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        setIsRunning(false);
        setIsTimePanelOpen(false);
        setIsTimeButtonVisible(false);

        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(STORAGE_DURATION_KEY);

        if (showButtonTimeoutRef.current !== null) {
          window.clearTimeout(showButtonTimeoutRef.current);
        }

        showButtonTimeoutRef.current = window.setTimeout(() => {
          setIsTimeButtonVisible(true);
          showButtonTimeoutRef.current = null;
        }, TIME_BUTTON_DELAY_MS);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [isRunning, durationSeconds]);

  function applyDuration(seconds: number) {
    setDurationSeconds(seconds);
    setRemaining(seconds);
    setIsTimePanelOpen(false);
    setIsTimeButtonVisible(true);

    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.setItem(STORAGE_DURATION_KEY, String(seconds));
  }

  function addMinute() {
    const next = Math.min(99 * 60 + 59, durationSeconds + 60);
    applyDuration(next);
  }

  function removeMinute() {
    const next = Math.max(10, durationSeconds - 60);
    applyDuration(next);
  }

  function startTimer() {
    if (showButtonTimeoutRef.current !== null) {
      window.clearTimeout(showButtonTimeoutRef.current);
      showButtonTimeoutRef.current = null;
    }

    setIsTimePanelOpen(false);
    setIsTimeButtonVisible(false);

    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    window.localStorage.setItem(STORAGE_DURATION_KEY, String(durationSeconds));

    setRemaining(durationSeconds);
    setIsRunning(true);
  }

  function stopTimer() {
    if (showButtonTimeoutRef.current !== null) {
      window.clearTimeout(showButtonTimeoutRef.current);
      showButtonTimeoutRef.current = null;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setIsRunning(false);
    setIsTimeButtonVisible(true);
  }

  function resetTimer() {
    if (showButtonTimeoutRef.current !== null) {
      window.clearTimeout(showButtonTimeoutRef.current);
      showButtonTimeoutRef.current = null;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setRemaining(durationSeconds);
    setIsRunning(false);
    setIsTimePanelOpen(false);
    setIsTimeButtonVisible(true);
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_center,rgba(120,0,0,0.24),transparent_48%),linear-gradient(145deg,#111,#030303_72%)] text-zinc-200">
      {!isRunning && isTimeButtonVisible && (
        <div className="absolute right-4 top-4 z-50 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setIsTimePanelOpen((current) => !current)}
            className="rounded-xl border border-red-900/60 bg-black/80 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-red-200 shadow-[0_0_22px_rgba(255,0,0,0.18)] backdrop-blur transition active:translate-y-px"
          >
            Настройка:{" "}{formatTimer(durationSeconds)}
          </button>

          {isTimePanelOpen && (
            <div className="w-64 rounded-2xl border border-zinc-700/70 bg-black/90 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur">
              <div className="mb-3 text-center font-segment text-5xl leading-none tracking-[0.03em] text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.72)]">
                {formatTimer(durationSeconds)}
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={removeMinute}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300 active:translate-y-px"
                >
                  -1 мин
                </button>

                <button
                  type="button"
                  onClick={addMinute}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300 active:translate-y-px"
                >
                  +1 мин
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_SECONDS.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => applyDuration(seconds)}
                    className={[
                      "rounded-lg border px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] active:translate-y-px",
                      seconds === durationSeconds
                        ? "border-red-700 bg-red-950/50 text-red-100"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400"
                    ].join(" ")}
                  >
                    {formatTimer(seconds)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <MovableContainer>
        <section aria-label="Кино-реквизитный экранный таймер">
          <div className="relative rounded-[28px] p-4 shadow-[0_32px_90px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-8">
            <RelayTextureOverlay active={isRunning} />
            <div className="pointer-events-none absolute inset-4 rounded-[20px] border border-white/5" />

            <TimerDisplay digits={digits} active={isRunning} />

            <div className="mt-[25rem] flex items-center justify-between gap-4">
              <div className="m-auto gap-2">
                <button
                  type="button"
                  onClick={startTimer}
                  className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-200 transition active:translate-y-px"
                >
                  Запустить
                </button>

                <button
                  type="button"
                  onClick={stopTimer}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-300 transition active:translate-y-px"
                >
                  Остановить
                </button>

                <button
                  type="button"
                  onClick={resetTimer}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-zinc-300 transition active:translate-y-px"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        </section>
      </MovableContainer>
    </main>
  );
}