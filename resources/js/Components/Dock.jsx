'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useRef, useState } from 'react';

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-green-900 dark:from-green-800 dark:to-green-900 border border-green-200/20 dark:border-green-700/20 shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 transition-shadow duration-300 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true">
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-green-200/20 dark:border-green-700/20 bg-green-900/70 dark:bg-green-800/70 backdrop-blur-md px-2 py-0.5 text-xs text-white shadow-lg`}
          role="tooltip"
          style={{ x: '-50%' }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  baseItemSize = 50,
  footerRef
}) {
  const mouseX = useMotionValue(Infinity);

  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!footerRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
        setFooterHeight(entry.target.offsetHeight);
      },
      { threshold: 0 }
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, [footerRef]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <motion.div
        onMouseMove={({ pageX }) => {
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
        }}
        className={`${className} fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border border-green-200/20 dark:border-green-700/20 bg-gradient-to-r from-green-50/80 via-neutral-50/80 to-green-100/80 dark:from-green-900/80 dark:via-neutral-900/80 dark:to-green-800/80 backdrop-blur-xl shadow-2xl shadow-green-500/10 pb-2 px-4 pointer-events-auto`}
        style={{ height: panelHeight, bottom: isFooterVisible ? `${footerHeight + 16}px` : '16px' }}
        role="toolbar"
        aria-label="Application dock">
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}>
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}
