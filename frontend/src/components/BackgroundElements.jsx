import { motion } from 'framer-motion';

export default function BackgroundElements() {
  return (
    <>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Floating 3D Icon Proxies */}
      <motion.div 
        className="floating-3d top-[15%] left-[23%] w-16 h-16"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full iridescent-sphere opacity-60"></div>
      </motion.div>

      <motion.div 
        className="floating-3d bottom-[10%] left-[30%] w-12 h-12"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="w-full h-full glass-panel rounded-xl rotate-12 opacity-40"></div>
      </motion.div>

      <motion.div 
        className="floating-3d top-[40%] right-[2%] w-20 h-20"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <div className="w-full h-full iridescent-sphere opacity-50 blur-[2px]"></div>
      </motion.div>
    </>
  );
}
