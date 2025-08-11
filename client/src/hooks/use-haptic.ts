import { useCallback } from 'react';

// Haptic feedback types
export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptic() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    // Check if the Vibration API is supported
    if (!navigator.vibrate) {
      console.log('Haptic feedback not supported on this device');
      return;
    }

    // Different vibration patterns for different feedback types
    const patterns: Record<HapticFeedbackType, number | number[]> = {
      light: 10,      // Single short vibration
      medium: 20,     // Single medium vibration
      heavy: 30,      // Single longer vibration
      success: [10, 50, 10],  // Quick double tap
      warning: [20, 30, 20],  // Medium double tap
      error: [30, 20, 30, 20, 30],  // Triple tap for errors
    };

    try {
      navigator.vibrate(patterns[type]);
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
  }, []);

  // Utility function to add haptic to any click handler
  const withHaptic = useCallback(
    (handler: (() => void) | undefined, type: HapticFeedbackType = 'light') => {
      return () => {
        triggerHaptic(type);
        handler?.();
      };
    },
    [triggerHaptic]
  );

  // Check if haptic feedback is available
  const isHapticSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  return {
    triggerHaptic,
    withHaptic,
    isHapticSupported,
  };
}