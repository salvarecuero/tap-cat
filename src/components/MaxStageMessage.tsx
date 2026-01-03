interface MaxStageMessageProps {
  visible: boolean;
}

export function MaxStageMessage({ visible }: MaxStageMessageProps) {
  if (!visible) return null;

  return (
    <div className="flex items-center justify-center px-4 py-2">
      <div className="bg-[#F3E7C6]/80 border-2 border-[var(--accent)] border-opacity-30 rounded-xl px-4 py-2 shadow-sm">
        <p className="text-xs md:text-sm font-medium text-[#5A3A1F] text-center select-none">
          Your cat has reached maximum happiness! Feel free to keep petting.
        </p>
      </div>
    </div>
  );
}
