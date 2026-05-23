const SEGMENTS_BY_DIGIT: Record<string, string[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "e", "d", "c", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"]
};

const SEGMENT_POSITION: Record<string, string> = {
  a: "left-[16%] top-0 h-[10%] w-[68%]",
  g: "left-[16%] top-[45%] h-[10%] w-[68%]",
  d: "left-[16%] bottom-0 h-[10%] w-[68%]",
  b: "right-[4%] top-[5%] h-[43%] w-[11%]",
  c: "right-[4%] bottom-[5%] h-[43%] w-[11%]",
  e: "left-[4%] bottom-[5%] h-[43%] w-[11%]",
  f: "left-[4%] top-[5%] h-[43%] w-[11%]"
};

type SegmentDigitProps = {
  value: string;
};

export function SegmentDigit({ value }: SegmentDigitProps) {
  const activeSegments = SEGMENTS_BY_DIGIT[value] ?? SEGMENTS_BY_DIGIT["0"];

  return (
    <div className="relative aspect-[0.58] w-full min-w-0" aria-label={value}>
      {Object.keys(SEGMENT_POSITION).map((segment) => {
        const active = activeSegments.includes(segment);

        return (
          <span
            key={segment}
            className={[
              "absolute rounded-[2px] transition-colors duration-100",
              SEGMENT_POSITION[segment],
              active
                ? "bg-red-500 shadow-[0_0_8px_#ff1a1a,0_0_24px_rgba(255,0,0,0.38)]"
                : "bg-red-950/30"
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}