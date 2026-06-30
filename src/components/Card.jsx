import { forwardRef } from 'react';

const Card = forwardRef(function Card({ className = '', hover = false, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-2xl bg-white shadow-card ring-1 ring-ink-100 ${hover ? 'transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
