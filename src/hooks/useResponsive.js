
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design and breakpoint detection
 * @param {Object} breakpoints - Custom breakpoints (optional)
 * @returns {Object} - Various responsive helpers
 */
export const useResponsive = (breakpoints = {}) => {
  const defaultBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    ...breakpoints,
  };

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < defaultBreakpoints.md
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth < defaultBreakpoints.md);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultBreakpoints.md]);

  const isBreakpoint = (breakpoint) => {
    const minWidth = defaultBreakpoints[breakpoint];
    return windowSize.width >= minWidth;
  };

  return {
    windowSize,
    isMobile,
    isTablet: windowSize.width >= defaultBreakpoints.md && windowSize.width < defaultBreakpoints.lg,
    isDesktop: windowSize.width >= defaultBreakpoints.lg,
    isBreakpoint,
  };
};

export default useResponsive;
