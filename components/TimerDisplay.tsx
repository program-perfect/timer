import { SegmentDigit } from "./SegmentDigit";

type TimerDisplayProps = {
  digits: string[];
  active: boolean;
};

export function TimerDisplay({ digits, active }: TimerDisplayProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_0.22fr_1fr_1fr] items-center gap-2 rounded-2xl border border-red-950/50 bg-black/90 p-4 shadow-[inset_0_0_28px_rgba(255,0,0,0.08),0_0_48px_rgba(255,0,0,0.08)] sm:gap-4 sm:p-7">
      <SegmentDigit value={digits[0]} />
      <SegmentDigit value={digits[1]} />

      <div
        className={[
          "flex h-full flex-col items-center justify-center gap-[22%]",
          active ? "animate-pulse" : "opacity-60"
        ].join(" ")}
        aria-hidden="true"
      >
        <span className="size-2 rounded-[2px] bg-red-500 shadow-[0_0_12px_#ff1a1a] sm:size-4" />
        <span className="size-2 rounded-[2px] bg-red-500 shadow-[0_0_12px_#ff1a1a] sm:size-4" />
      </div>

      <SegmentDigit value={digits[2]} />
      <SegmentDigit value={digits[3]} />
    </div>
  );
}