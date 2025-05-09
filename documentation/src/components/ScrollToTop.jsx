import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo(0, 0);
    
    // Also make sure the content container scrolls to top
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.scrollTop = 0;
    }
  }, [pathname]);

  return null; // This component doesn't render anything
} 