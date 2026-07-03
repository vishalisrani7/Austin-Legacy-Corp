import { motion } from "framer-motion";
import ViewportDecryptedText from "./ViewportDecryptedText";

const ServiceCard = ({ title, HeaderIcon, Icon, from, to, bgImage }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        scale: [1, 1.02, 1],
        rotate: [0, 0.5, -0.5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative flex flex-col h-full w-full overflow-hidden rounded-2xl border-2 border-white bg-[#0a0a0a] shadow-2xl"
    >
      <div className="flex h-12 w-full items-center gap-3 border-b-2 border-white bg-black/80 backdrop-blur-md px-4 z-20">
        {HeaderIcon ? (
          <HeaderIcon className="h-4 w-4 text-zinc-400" />
        ) : (
          <div className="h-3 w-3 rounded-full bg-zinc-500" />
        )}
        <span className="text-sm font-medium tracking-wide text-zinc-300">
          <ViewportDecryptedText text={title} />
        </span>
      </div>

      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br ${from} ${to}`}
      >
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <img 
                src={bgImage} 
           
                className="w-full h-full object-cover grayscale blur-[1px]"
            />
        </div>
        
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 flex items-center justify-center"
        >
          <div className="p-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]">
             <Icon className="h-16 w-16 text-white drop-shadow-md" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
