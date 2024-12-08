import React, { useEffect, useRef, useState } from 'react';

// Utility function to combine classNames
const cn = (...classes) => classes.filter(Boolean).join(' ');

const Star = ({ isGlowing, delay }) => {
  const animationStyle = {
    transform: `scale(${isGlowing ? 1.5 : 1})`,
    background: isGlowing ? '#fff' : '#666',
    transition: `all 1s ease-in-out ${delay}s`,
    height: '2px',
    width: '2px',
    borderRadius: '9999px',
    position: 'relative',
    zIndex: 20,
  };

  return <div style={animationStyle} />;
};

const Glow = ({ delay }) => {
  const glowStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    height: '6px',
    width: '6px',
    borderRadius: '9999px',
    backgroundColor: '#3b82f6',
    filter: 'blur(1px)',
    boxShadow: '0 0 15px 2px #60a5fa',
    opacity: 1,
    transition: `opacity 1s ease-in-out ${delay}s`,
  };

  return <div style={glowStyle} />;
};

const Illustration = ({ mouseEnter }) => {
  const stars = 36;
  const columns = 6;
  const [glowingStars, setGlowingStars] = useState([]);
  const highlightedStars = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars([...highlightedStars.current]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    height: '12rem',
    padding: '0.25rem',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1px',
  };

  return (
    <div style={containerStyle}>
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = mouseEnter ? starIdx * 0.01 : (starIdx % 10) * 0.1;

        return (
          <div
            key={`matrix-col-${starIdx}`}
            className="relative flex items-center justify-center"
          >
            <Star isGlowing={mouseEnter ? true : isGlowing} delay={delay} />
            {(mouseEnter || isGlowing) && <Glow delay={delay} />}
          </div>
        );
      })}
    </div>
  );
};

const GlowingStarsTitle = ({ className, children }) => (
  <h2 className={cn('font-bold text-2xl text-gray-100', className)}>
    {children}
  </h2>
);

const GlowingStarsDescription = ({ className, children }) => (
  <p className={cn('text-base text-white max-w-[16rem]', className)}>
    {children}
  </p>
);

const GlowingStarsBackgroundCard = ({ className, children }) => {
  const [mouseEnter, setMouseEnter] = useState(false);

  const cardStyle = {
    background: 'linear-gradient(110deg, #333 0.6%, #222)',
    padding: '1rem',
    maxWidth: '28rem',
    maxHeight: '20rem',
    height: '100%',
    width: '100%',
    borderRadius: '0.75rem',
    border: '1px solid #4b5563',
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
    >
      <div className="flex justify-center items-center">
        <Illustration mouseEnter={mouseEnter} />
      </div>
      <div className="px-2 pb-6">{children}</div>
    </div>
  );
};

export {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle
};

export default GlowingStarsBackgroundCard;