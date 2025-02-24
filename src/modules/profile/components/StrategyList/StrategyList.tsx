import { useEffect, useState } from 'react';
import type { Strategy } from '@/types/strategy.types';
import type { CopyRelationship } from '@/types/copy.types';
import { useAuth } from '@/context/AuthContext';
import StrategyListItem from '@/components/strategy/StrategyListItem';
import Chip from '@/components/Chip';
import { useLongPress } from '@/hooks/useLongPress';
import './StrategyList.css';

interface StrategyListProps {
  strategies: Strategy[];
  onCopyStrategy?: (strategyId: string, isCopying: boolean) => Promise<boolean>;
  isOwnProfile?: boolean;
  onSelect: (strategyId: string) => void;
  onStrategyClick: (strategyId: string) => void;
  selectedStrategies: string[];
  showCheckboxes: boolean;
  setShowCheckboxes: (show: boolean) => void;
  activeFilter: 'copying' | 'not-copying';
  setActiveFilter: (filter: 'copying' | 'not-copying') => void;
  setSelectedStrategies: (strategies: string[]) => void;
}

const StrategyList = ({
  strategies,
  onCopyStrategy,
  isOwnProfile = false,
  onSelect,
  onStrategyClick,
  selectedStrategies,
  showCheckboxes,
  setShowCheckboxes,
  activeFilter,
  setActiveFilter,
  setSelectedStrategies,
}: StrategyListProps) => {
  const { user: currentUser } = useAuth();
  const [copyRelations, setCopyRelations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSelectedStrategies([]);
  }, [activeFilter]);

  useEffect(() => {
    const fetchCopyRelations = async () => {
      if (!currentUser) return;

      const response = await fetch(
        `${import.meta.env.VITE_JSON_SERVER_URL}/copyRelationships?copierId=${currentUser.id}`
      );
      if (!response.ok) return;

      const relations: CopyRelationship[] = await response.json();
      const relationMap = relations.reduce((acc: Record<string, boolean>, rel) => {
        acc[rel.strategyId] = rel.status === 'active';
        return acc;
      }, {});
      setCopyRelations(relationMap);
    };

    fetchCopyRelations();
  }, [currentUser]);

  const handleSelectedAction = async () => {
    if (!onCopyStrategy) return;

    try {
      // Handle based on active filter
      const isCopying = isOwnProfile ? true : activeFilter === 'copying';
      const results = await Promise.all(
        selectedStrategies.map(strategyId => onCopyStrategy(strategyId, isCopying))
      );

      // Update copyRelations for successful actions
      const newCopyRelations = { ...copyRelations };
      selectedStrategies.forEach((strategyId, index) => {
        if (results[index]) {
          newCopyRelations[strategyId] = !isCopying; // Toggle the copy status
        }
      });
      setCopyRelations(newCopyRelations);

      // Clear selections after action
      setShowCheckboxes(false);
    } catch (error) {
      console.error('Error handling selected strategies:', error);
    }
  };

  // Only show copy options if user is a copier
  const showCopyOptions = onCopyStrategy && currentUser?.userType === 'copier';
  // Hide all copy functionality for leaders
  const isLeader = currentUser?.userType === 'leader';

  // Split strategies based on copy status
  const copyingStrategies = strategies.filter(strategy => copyRelations[strategy.id]);
  const notCopyingStrategies = strategies.filter(strategy => !copyRelations[strategy.id]);

  // In own profile, only show copying strategies. Otherwise, show based on filter
  const displayStrategies = isOwnProfile
    ? copyingStrategies
    : activeFilter === 'copying'
      ? copyingStrategies
      : notCopyingStrategies;

  const longPressHandlers = useLongPress({
    onClick: () => {}, // Empty function since we handle clicks in StrategyListItem
    onLongPress: event => {
      const element = event.target as HTMLElement;
      const strategyItem = element.closest('.strategy-item');
      if (strategyItem) {
        const strategyId = strategyItem.getAttribute('data-strategy-id');
        if (strategyId && !showCheckboxes) {
          setShowCheckboxes(true);
          onSelect(strategyId);
        }
      }
    },
  });

  // Render for leaders - simple list of all strategies
  if (isLeader) {
    return (
      <div className="strategy-list">
        {strategies.length === 0 ? (
          <div className="strategy-list--empty">No strategies found</div>
        ) : (
          strategies.map(strategy => (
            <div
              key={strategy.id}
              className="strategy-item"
              data-strategy-id={strategy.id}
              {...longPressHandlers}
            >
              <StrategyListItem
                strategy={strategy}
                showCopyButton={false}
                selected={selectedStrategies.includes(strategy.id)}
                onClick={onStrategyClick}
                onSelect={() => onSelect(strategy.id)}
              />
            </div>
          ))
        )}
      </div>
    );
  }
  // Render for copiers - with copy functionality and filters
  return (
    <div className="strategy-list">
      {showCopyOptions && !isOwnProfile && (
        <div className="strategy-list__filters">
          <Chip
            onClick={() => setActiveFilter('not-copying')}
            active={activeFilter === 'not-copying'}
          >
            Start Copying ({notCopyingStrategies.length})
          </Chip>
          <Chip onClick={() => setActiveFilter('copying')} active={activeFilter === 'copying'}>
            Stop Copying ({copyingStrategies.length})
          </Chip>
        </div>
      )}
      {(showCopyOptions || isOwnProfile) && showCheckboxes && selectedStrategies.length > 0 && (
        <div className="strategy-list__header">
          <div className="strategy-list__header-actions">
            <button className="copy-selected-button" onClick={handleSelectedAction}>
              {isOwnProfile || activeFilter === 'copying'
                ? `Stop Copying Selected (${selectedStrategies.length})`
                : `Copy Selected Strategies (${selectedStrategies.length})`}
            </button>
            <button
              className="cancel-selection-button"
              onClick={() => {
                setShowCheckboxes(false);
                setSelectedStrategies([]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {displayStrategies.length === 0 ? (
        <div className="strategy-list--empty">
          {isOwnProfile
            ? "You haven't copied any strategies yet"
            : activeFilter === 'copying'
              ? "You're not copying any strategies yet"
              : 'No strategies available to copy'}
        </div>
      ) : (
        displayStrategies.map(strategy => (
          <div
            key={strategy.id}
            className="strategy-item"
            data-strategy-id={strategy.id}
            {...longPressHandlers}
          >
            <StrategyListItem
              strategy={strategy}
              showCopyButton={!isOwnProfile || copyRelations[strategy.id]}
              isCopying={copyRelations[strategy.id]}
              onCopy={async (strategyId: string, isCopying: boolean) => {
                if (onCopyStrategy) {
                  const success = await onCopyStrategy(strategyId, isCopying);
                  if (success) {
                    setCopyRelations(prev => ({
                      ...prev,
                      [strategyId]: !isCopying,
                    }));
                  }
                  setSelectedStrategies([]);
                }
              }}
              onClick={onStrategyClick}
              onSelect={() => onSelect(strategy.id)}
              selected={selectedStrategies.includes(strategy.id)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default StrategyList;
