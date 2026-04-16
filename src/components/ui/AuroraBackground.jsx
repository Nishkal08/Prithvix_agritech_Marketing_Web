import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 
        We use framer-motion to continuously animate 
        large, highly blurred circles to create a "breathing aurora" or mesh gradient effect.
      */}

      {/* Primary Gold Blob */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] min-w-[300px] min-h-[300px] rounded-full bg-gold/15 blur-[80px] md:blur-[120px]"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary Forest Blob */}
      <motion.div
        className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] min-w-[250px] min-h-[250px] rounded-full bg-forest/5 blur-[80px] md:blur-[120px]"
        animate={{
          x: [0, -70, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
