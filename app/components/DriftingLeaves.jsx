"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DriftingLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const numLeaves = 30;
    const arr = [];

    for (let i = 0; i < numLeaves; i++) {
      const startX = Math.random() * -30;          // random left start
      const endX = Math.random() * 50;        // random right exit (80–130vw)
      const startY = Math.random() * -50;          // top start
      const endY = 100 + Math.random() * 40;       // bottom exit (100–140vh)

      arr.push({
        id: i,
        startX,
        endX,
        startY,
        endY,
        delay: Math.random() * 4,
        duration: 10 + Math.random() * 10,
        sway: 5 + Math.random() * 15,
        rotateAmount: 20 + Math.random() * 40,
        size: 20 + Math.random() * 20,
      });
    }

    setLeaves(arr);
  }, []);

  if (leaves.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-5">
      {leaves.map((leaf) => (
        <motion.img
          key={leaf.id}
          src="/images/leaf.png"
          className="absolute opacity-90"
          style={{
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
          }}
          initial={{
            x: `${leaf.startX}vw`,
            y: `${leaf.startY}vh`,
            rotate: 0,
          }}
          animate={{
            x: [
              `${leaf.startX}vw`,
              `${leaf.startX + leaf.sway}vw`,
              `${leaf.endX}vw`,
            ],
            y: [
              `${leaf.startY}vh`,
              `${leaf.startY + leaf.sway}vh`,
              `${leaf.endY}vh`,
            ],

            rotate: [
              0,
              leaf.rotateAmount,
              -leaf.rotateAmount,
              0
            ],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
