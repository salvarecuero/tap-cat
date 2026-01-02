interface CounterProps {
  value: number;
  petsPerSecond?: number;
}

export function Counter({ value, petsPerSecond = 0 }: CounterProps) {
  const formatPPS = (pps: number): string => {
    if (pps === 0) return "0";
    if (pps >= 1000) return `${(pps / 1000).toFixed(1)}K`;
    if (pps >= 10) return pps.toFixed(0);
    if (pps >= 0.1) return pps.toFixed(1);
    return pps.toFixed(2);
  };

  return (
    <div className="flex items-center justify-center py-1 px-4">
      <div className="bg-[#F3E7C6] border-[3px] border-[var(--accent)] border-opacity-40 rounded-2xl shadow-md px-6 py-3">
        <p className="font-mono text-4xl md:text-5xl font-bold text-[#5A3A1F] select-none">
          {Math.floor(value).toLocaleString()}
        </p>
        {petsPerSecond > 0 && (
          <p className="font-mono text-xs md:text-sm text-[var(--accent)] opacity-80 text-center mt-0.5 select-none">
            +{formatPPS(petsPerSecond)}/sec
          </p>
        )}
      </div>
    </div>
  );
}
