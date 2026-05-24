type RelayTextureOverlayProps = {
  active: boolean;
};

export function RelayTextureOverlay({ active }: RelayTextureOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
    >
      <div className="absolute inset-0 opacity-45 mix-blend-screen [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_10%),radial-gradient(circle_at_78%_76%,rgba(255,0,0,0.12),transparent_18%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_48%,transparent_54%)]" />

      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

      <div className="absolute left-6 top-6 h-7 w-7 rounded-full border border-zinc-500/30 bg-black/25 shadow-[inset_0_1px_4px_rgba(255,255,255,0.18)]" />
      <div className="absolute right-6 top-6 h-7 w-7 rounded-full border border-zinc-500/30 bg-black/25 shadow-[inset_0_1px_4px_rgba(255,255,255,0.18)]" />
      <div className="absolute bottom-6 left-6 h-7 w-7 rounded-full border border-zinc-500/30 bg-black/25 shadow-[inset_0_1px_4px_rgba(255,255,255,0.18)]" />
      <div className="absolute bottom-6 right-6 h-7 w-7 rounded-full border border-zinc-500/30 bg-black/25 shadow-[inset_0_1px_4px_rgba(255,255,255,0.18)]" />

      <div className="absolute left-1/2 top-4 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-400/25 to-transparent" />
      <div className="absolute bottom-4 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-red-700/18 to-transparent" />
      <div
        className={[
          "absolute right-10 top-10 h-2 w-2 rounded-full",
          active
            ? "bg-red-700 shadow-[0_0_16px_#ff1a1a]"
            : "bg-zinc-700/80 shadow-none"
        ].join(" ")}
      />
    </div>
  );
}