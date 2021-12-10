/* eslint-disable no-restricted-globals */
import { useState, useEffect } from 'react';
// Hook
export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const [windowSize, setWindowSize] = useState({
    width: iOS ? screen.width : window.innerWidth,
    height: iOS ? screen.height : window.outerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: iOS ? screen.width : window.innerWidth,
        height: iOS ? screen.height : window.outerHeight,
      });
    }

    // Add event listener

    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount

  return {
    windowSize,
    isTablet: windowSize.width <= 850,
    isMobile: windowSize.width <= 560,
    isPad: windowSize.width <= 750
  };
};
