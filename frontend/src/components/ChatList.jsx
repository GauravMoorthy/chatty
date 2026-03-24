import { motion } from 'framer-motion';

const chats = [
  {
    id: 1,
    name: 'Alex Rivers',
    time: '12:45 PM',
    message: 'Typing...',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRZ6Dvsk3cLMZmlukuUwtI3Lf7S7mpeLrTkgGO6MlgoNObhSPdJmWv9tSQ-4gfjZLjZFFXyXSYgDMPEEkPDvloVhzBxuHh5CaKKw7UXP0mSeFIZSsmJTdNE0cf9sx_Gty7hV0SeVQtFTYoZychtoiEdXqChepzlbx97pCXvHM0jszuWUW-_zs7PkonmaUd4rU2itw6vNknPugIDreP1ZtuEhBc9mylCFgG0DHsfxjIp3Qj9XDu_fRI7pZNeyQzAgQ8EqoIZx80FVR8',
    active: true,
    typing: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    time: '09:12 AM',
    message: 'The presentation looks amazing!',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBABFu-JFaPGqGR69R9_Mp6pu6B3rzeLe_EaXWxzSEqmLZk2QzE1hjA-6eyrVGxlo-JuZpDVeQUA48M8qnkdlXcarLc1agHLxRvgOrZIPU4QAYKWbrGntHKekSARzAWuY-Ww0rqegZ6y3HRwpO9oJ9SFXuP_QzYnp3wup8t3_oTQp4UTf5jhgies5f4SZFGSpfcfxvLIsN1ftDW5qiGekVVSKZ366zD_Ih-lhKgkFeJMENgiaFl80w1j0SeSskzZ3cVhVZVyRBETxqx',
  },
  {
    id: 3,
    name: 'Jordan Smyth',
    time: 'Yesterday',
    message: "Let's grab a coffee soon.",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATA3uGWNGqbjy42TGSP-305Aa9aq8Yo3y-FGneDBFyXieWk_4tn1V8zepY-19DIufaCxrlbpPcy9HufLx10LmICjxM0N2olEyoGIXKhoGMc4Uzzzv-jp_Oa-EU5siDNhorT61is68_l3yFGmZL4OIOJIQoKvZp5RVVGeX_yk8f2hhhMysOQcy3ypMdmYSEOUiGwlGNgic8_sibwbFNYVVAveFSPHjoe--zIH0GMnT7fLGbyez7HwO1rzfTOfnV_SZmoWyTejex1IiF',
    online: true,
  },
  {
    id: 4,
    name: 'Design Team',
    time: 'Tuesday',
    message: 'New assets uploaded to the cloud.',
    initials: 'D',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ChatList() {
  return (
    <motion.section 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="w-96 flex flex-col gap-6 relative z-10"
    >
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 iridescent-sphere z-20 blur-[1px]"></div>
      
      <div className="glass-panel bg-surface-container-low/40 rounded-xl p-6 flex flex-col gap-6 h-full shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">Chats</h2>
          <motion.div 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/40 glass-panel flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-4"
        >
          {chats.map((chat) => (
            <motion.div 
              key={chat.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer ${
                chat.active 
                  ? 'bg-white/60 glass-panel shadow-xl' 
                  : 'hover:bg-white/20 transition-colors'
              }`}
            >
              <div className="relative">
                {chat.avatar ? (
                  <img 
                    src={chat.avatar} 
                    alt={chat.name} 
                    className={`w-14 h-14 rounded-full object-cover border-2 border-white ${chat.active ? 'shadow-md' : 'grayscale-[40%] opacity-80'}`} 
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-tertiary-fixed-dim/40 glass-panel flex items-center justify-center text-tertiary font-bold text-xl shadow-inner">
                    {chat.initials}
                  </div>
                )}
                {(chat.active || chat.online) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary-fixed border-2 border-white rounded-full shadow-lg shadow-secondary-fixed/50"></span>
                )}
                {!chat.active && !chat.online && chat.avatar && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-300 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-headline font-bold text-on-surface truncate">{chat.name}</span>
                  <span className="text-[10px] font-label text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <p className={`text-sm truncate ${chat.typing ? 'text-primary font-medium' : 'text-slate-500'}`}>
                  {chat.message}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
