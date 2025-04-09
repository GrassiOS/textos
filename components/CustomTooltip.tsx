import React, { useState, useRef, useEffect } from 'react';

interface CustomTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function CustomTooltip({ content, children, position = 'top' }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 10;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 10;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 10;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + 10;
          break;
      }
      
      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 0) left = 0;
      if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width;
      if (top < 0) top = 0;
      if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height;
      
      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  return (
    <div 
      className="inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={triggerRef}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm max-w-xs"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
} 