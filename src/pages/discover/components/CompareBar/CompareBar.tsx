import AIButton from '@/components/AIButton/AIButton';

interface CompareBarProps {
  selectedStrategies: string[];
  isComparing: boolean;
  onCompare: () => void;
}

export function CompareBar({ selectedStrategies, isComparing, onCompare }: CompareBarProps) {
  if (selectedStrategies.length === 0) return null;

  return (
    <div className="strategies-compare-bar">
      <AIButton
        onClick={onCompare}
        disabled={selectedStrategies.length < 2}
        isLoading={isComparing}
        loadingText="Comparing..."
      >
        Compare ({selectedStrategies.length}/4)
      </AIButton>
    </div>
  );
}
