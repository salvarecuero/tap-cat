interface CounterProps {
  value: number;
}

export function Counter({ value }: CounterProps) {
  return (
    <div className="flex items-center justify-center py-3 px-6">
      <div className="bg-[#F3E7C6] border-[3px] border-[var(--accent)] border-opacity-40 rounded-2xl shadow-md px-8 py-4">
        <p className="font-mono text-5xl md:text-6xl font-bold text-[#5A3A1F] select-none">
          {Math.floor(value).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
