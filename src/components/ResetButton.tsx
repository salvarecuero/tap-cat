interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      className="text-sm text-white/70 hover:text-white/90 transition-colors px-3 py-1 rounded"
    >
      Reset
    </button>
  );
}
