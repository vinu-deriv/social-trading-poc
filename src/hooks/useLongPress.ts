import { useCallback, useRef } from 'react';

type Timer = ReturnType<typeof setTimeout>;

interface UseLongPressOptions {
  onClick?: () => void;
  onLongPress: () => void;
  ms?: number;
}

type EventType = React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>;

export const useLongPress = ({ onClick, onLongPress, ms = 300 }: UseLongPressOptions) => {
  const timerRef = useRef<Timer | undefined>(undefined);
  const isLongPress = useRef<boolean>(false);

  const start = useCallback(
    (event: EventType): void => {
      event.preventDefault();
      isLongPress.current = false;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress();
      }, ms);
    },
    [onLongPress, ms]
  );

  const stop = useCallback(
    (event: EventType, shouldTriggerClick: boolean = true): void => {
      event.preventDefault();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (shouldTriggerClick && !isLongPress.current && onClick) {
        onClick();
      }
    },
    [onClick]
  );

  return {
    onMouseDown: (e: React.MouseEvent<HTMLElement>): void => start(e),
    onMouseUp: (e: React.MouseEvent<HTMLElement>): void => stop(e, true),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>): void => stop(e, false),
    onTouchStart: (e: React.TouchEvent<HTMLElement>): void => start(e),
    onTouchEnd: (e: React.TouchEvent<HTMLElement>): void => stop(e, true),
  };
};
