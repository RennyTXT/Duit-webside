'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const AuraCursor = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!isMounted) return null;

  return (
    <>
      {/* Primary Aura */}
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none z-[9998]"
        style={{
          x: x,
          y: y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Secondary Soft Light */}
      <motion.div
        className="fixed top-0 left-0 w-[200px] h-[200px] bg-primary/3 rounded-full blur-[60px] pointer-events-none z-[9998]"
        style={{
          x: x,
          y: y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default AuraCursor;
