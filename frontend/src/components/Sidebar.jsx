import { motion } from 'framer-motion';

export default function Sidebar() {
  const navItems = [
    { icon: 'chat', label: 'Messages', active: true },
    { icon: 'contacts', label: 'Contacts', active: false },
    { icon: 'group', label: 'Groups', active: false },
    { icon: 'archive', label: 'Archive', active: false },
    { icon: 'settings', label: 'Settings', active: false },
  ];

  const bottomItems = [
    { icon: 'help', label: 'Help', active: false, color: 'text-slate-600' },
    { icon: 'logout', label: 'Logout', active: false, color: 'text-error hover:bg-error/10' },
  ];

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hidden md:flex flex-col h-full w-72 p-6 space-y-8 bg-white/40 glass-panel rounded-r-[3rem] sticky left-0 shadow-[40px_0_80px_-20px_rgba(25,28,32,0.08)] z-10"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-2xl shadow-primary/40 relative group">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-[2px]"></div>
          <span className="material-symbols-outlined text-white text-2xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary font-headline">Chatty</h1>
          <p className="text-[10px] uppercase tracking-[0.15em] font-label text-slate-500">The Digital Ether</p>
        </div>
      </div>

      <motion.button 
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-full shadow-[0_15px_30px_-5px_rgba(90,69,203,0.4)] flex items-center justify-center gap-2 font-headline text-sm transition-all duration-300"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        New Chat
      </motion.button>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <motion.a 
            href="#" 
            key={item.label}
            whileHover={{ x: item.active ? 0 : 4 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 ${
              item.active 
                ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/20' 
                : 'text-slate-600 hover:text-primary hover:bg-white/40'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: item.active ? "'FILL' 1" : undefined }}>{item.icon}</span>
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
          </motion.a>
        ))}
      </nav>

      <div className="pt-6 space-y-2">
        {bottomItems.map((item) => (
          <motion.a 
            href="#" 
            key={item.label}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 hover:bg-white/40 ${item.color}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.aside>
  );
}
