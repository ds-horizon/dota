import { useEffect, useState, useCallback } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Function to determine which heading is active based on scroll position
  // Moved outside useEffect and wrapped in useCallback
  const onScroll = useCallback(() => {
    const headingElements = Array.from(document.querySelectorAll('.content h1, .content h2, .content h3, .content h4'));
    if (headingElements.length === 0) return;

    let currentActiveId = '';
    const offset = 100; // Pixels from the top to consider a heading active

    // Find the last heading whose top edge is above the offset
    for (let i = headingElements.length - 1; i >= 0; i--) {
      const heading = headingElements[i];
      const rect = heading.getBoundingClientRect();
      
      // Check if the top of the heading is above the offset line
      if (rect.top <= offset) {
        currentActiveId = heading.id;
        break; // Found the last heading above the offset
      }
    }
    
    // If no heading is above the offset (e.g., scrolled to the top), activate the first one
    if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id;
    }

    // Only update state if the active ID has actually changed
    setActiveId(prevActiveId => {
      if (prevActiveId !== currentActiveId) {
        return currentActiveId;
      }
      return prevActiveId;
    });

  }, [setActiveId]); // Keep dependency as setActiveId

  useEffect(() => {
    // Function to extract headings from the content
    const extractHeadings = () => {
      const contentElement = document.querySelector('.content');
      if (!contentElement) return [];

      // Select h1, h2, h3, h4 elements
      const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4');
      
      return Array.from(headingElements).map((heading) => {
        // Create an id from the heading text if it doesn't have one
        if (!heading.id) {
          const id = heading.textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')  // Remove special chars
            .replace(/\s+/g, '-');     // Replace spaces with hyphens
          
          heading.id = id; // Set the ID on the heading element
        }
        
        return {
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1)), // Extract the heading level (1-6)
        };
      });
    };

    // Initial extraction
    const extractedHeadings = extractHeadings();
    setHeadings(extractedHeadings);

    // Add scroll event listener using the memoized onScroll function
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Call once on mount
    
    // Set up a mutation observer to watch for content changes
    const contentElement = document.querySelector('.content');
    if (contentElement) {
      const observer = new MutationObserver(() => {
        const updatedHeadings = extractHeadings();
        setHeadings(updatedHeadings);
        onScroll(); // Re-calculate active heading when content changes
      });
      
      observer.observe(contentElement, { 
        childList: true, 
        subtree: true,
        characterData: true 
      });
      
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
      };
    }
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]); // Add onScroll to useEffect dependencies

  // Don't render if no headings are found
  if (!headings.length) {
    return null;
  }

  // Render headings with proper nesting and indentation
  const renderHeadings = () => {
    return headings.map((heading, index) => {
      // Calculate indentation based on heading level
      // h1 has no indent, h2 has 1rem indent, h3 has 2rem, etc.
      const indentLevel = heading.level > 1 ? heading.level - 1 : 0;
      const indentStyle = {
        paddingLeft: `${indentLevel * 0.75}rem`,
        marginBottom: heading.level === 1 ? '0.5rem' : '0.25rem',
        fontSize: heading.level === 1 ? '0.9rem' : '0.875rem',
        position: 'relative'
      };

      const isActive = heading.id === activeId;

      return (
        <li 
          key={index} 
          style={indentStyle} 
          className={isActive ? 'active-section' : ''}
        >
          <a 
            href={`#${heading.id}`}
            className={`toc-link ${heading.level === 1 ? 'toc-link-h1' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
              setActiveId(heading.id);
            }}
          >
            {heading.text}
          </a>
        </li>
      );
    });
  };

  return (
    // Make this a flex column and ensure it can take height (e.g., h-full or min-h-screen if appropriate)
    // The parent 'toc-container' is sticky, so height will be related to viewport.
    <div className="toc flex flex-col h-full"> 
      <div> {/* Wrapper for title and list */} 
        <h4>On This Page</h4>
        <ul className="toc-list">
          {renderHeadings()}
        </ul>
      </div>
      {/* This div will be pushed to the bottom by mt-auto and its items aligned to the right */}
      <div className="toc-support-links mt-auto pt-4 border-t border-border-color flex flex-col items-end space-y-2">
        <a 
          href="https://discord.gg/tUpDV8EaDM" 
          className="text-sm text-primary hover:text-primary-dark font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask a Question
        </a>
        <a 
          href="https://github.com/dream-sports-labs/dota/issues" 
          className="text-sm text-primary hover:text-primary-dark font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Report an Issue
        </a>
      </div>
    </div>
  );
} 