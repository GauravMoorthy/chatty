import { motion } from 'framer-motion';

export default function ChatWindow() {
  return (
    <motion.section 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      className="flex-1 flex flex-col gap-6 relative z-10"
    >
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [-15, -10, -15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-12 h-12 floating-3d z-20"
      >
        <div className="w-full h-full bg-tertiary/20 glass-panel rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </div>
      </motion.div>

      <header className="glass-panel bg-white/40 rounded-xl p-6 flex items-center justify-between shadow-2xl relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu0TfVDGNE12iUEFe6ex3hCW0gESt4p9fA4PTqtv-DDvj_7JPJHV-5iKt9sDxJBtdnRuUiZrhKWk5esApT_Xxx251n_eaViwEawDG78tsDLmmyN_AnB4yiefVydjPJQo97iZpj6ULsz2WGw8S94Xb3ri3wQduPbhebMwvi7FyRY6rPtyWIJzsV0NlHcy_aU4zXbvBKJCHgNZ8DGncMnM6bAzUSvdh1SZm2neHCzwR7ALancYUCbBQtN2HuW9SzrOcYgY0rk9Z0mJWI" 
              alt="Alex" 
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 iridescent-sphere"></span>
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-lg text-on-surface tracking-tight">Alex Rivers</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_8px_rgba(98,250,227,1)]"></span>
              <span className="text-[10px] font-label text-on-secondary-container tracking-wider uppercase">Active Now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {['call', 'videocam', 'more_vert'].map((icon) => (
            <motion.button 
              key={icon}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(90,69,203,0.1)", color: "#5a45cb" }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/40 glass-panel flex items-center justify-center text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined">{icon}</span>
            </motion.button>
          ))}
        </div>
      </header>

      <div className="flex-1 glass-panel bg-white/10 rounded-xl p-8 overflow-y-auto hide-scrollbar flex flex-col gap-8 shadow-inner relative">
        <div className="absolute right-12 top-1/3 w-16 h-16 iridescent-sphere opacity-20 blur-[1px]"></div>

        <Message text="Hey! Have you seen the new design system? It feels like we're literally floating in the digital ether now." avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCfo8E3kwKi29lKSpgPeMI-rRdFvPMHe0D3PJJ-DBOgrmQM-McDMp8QrZ2dqsUFrX86eOo7mbYoxnNQbppm-QbLMXlB8DJnWWC2fqMy6AAiZrcvHghmfKS3tIc783V9bilmF2uEEIw6H0AP9zQMLVqt9v8b7spTd5rp7yZ8UIxeCxx6welAOgJ8eGFkLZE3uT42qYaVeFFfXX23-dShbX9lG49IDkyRUi8gbWCe8bIzCn0Oe0pT-MAQbHIfNgP77K0AVB6Nlz5BxQX0" />
        
        <Message isSelf text="Just saw it. The liquid glass effect is incredible. No more 1px borders—everything feels so much more organic and fluid. 🌊" />
        
        <Message text="Exactly! The way the background colors bleed through the containers is such a high-end touch." avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Li6UOHQNO6__rPNbBGZk8Nx-1aKJ6bYITGY04oTv1R0n20ZAfLJBGcSkTt8rOU2z-nrymay6ow-jYxj0lZqGVo0dLZFW8DyZ-wRyNEr-Ff4b885xoseojiE3JP1JVYnAseCvUwKAaPUPztC9U-HxxrK69__8OXaQ051MCDM4_yvFHo6ZzmvovIlfpKD0MHVO1mrZ__zHRJkoQLqzqoVgFqYw3vZA8VWGE1Fi68oY_Ww1AKoA7vUJUfJzghd5s12dYDfGCYXOMXru" />

        <div className="flex items-center gap-3">
          <img className="w-8 h-8 rounded-full shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQLuLZybZmv6ISBiO0R4L-gUnIfEhlm_13OkZ8wlGj_Rq1tCPfhGh1DC8Q2qIqi3QfwuIjB9PWe395nlzD4fGYrjanrC8oNExG_gVj2BVjQqwCYtj9K5f6GNjsaqDdnJPZxo_lnTF4cQusA4fd775eI2RIQKAH8yTa7F1QAWF_7-9ciISNV3Qrwl6p2lCtVXidDH0uSA22MpemKRwy8MDw8HqbFKBPwxmoOlR5wbU0RI4nl12PbvD3_efi4BTymEqwoowSu1D1eBu0" alt="typing" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-2 p-4 bg-white/40 glass-panel rounded-full px-6"
          >
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span 
                key={i}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay }}
                className="w-2 h-2 rounded-full bg-primary"
              ></motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      <footer className="p-4 glass-panel bg-white/50 rounded-2xl shadow-2xl flex items-center gap-4 relative">
        <div className="absolute left-1/2 -top-2 w-4 h-4 iridescent-sphere blur-[1px] opacity-40"></div>
        
        {['sentiment_satisfied', 'attach_file'].map((icon) => (
           <motion.button 
             key={icon}
             whileHover={{ scale: 1.1, color: "#5a45cb" }}
             whileTap={{ scale: 0.95 }}
             className="w-12 h-12 flex items-center justify-center text-slate-400 transition-colors"
           >
             <span className="material-symbols-outlined text-2xl">{icon}</span>
           </motion.button>
        ))}

        <input 
          type="text" 
          placeholder="Type a message into the ether..." 
          className="flex-1 bg-surface-container-low/40 glass-panel border-none focus:ring-4 focus:ring-primary/10 rounded-xl py-4 px-6 text-on-surface placeholder:text-slate-400 font-medium outline-none transition-all"
        />
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(90,69,203,0.5)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="material-symbols-outlined text-2xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </motion.button>
      </footer>
    </motion.section>
  );
}

function Message({ text, avatar, isSelf }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex items-end gap-3 max-w-[70%] group ${isSelf ? 'ml-auto' : ''}`}
    >
      {!isSelf && <img src={avatar} alt="user" className="w-8 h-8 rounded-full shadow-md" />}
      <motion.div 
        whileHover={{ x: isSelf ? -4 : 4 }}
        className={isSelf 
          ? "bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 shadow-[0_15px_40px_-10px_rgba(90,69,203,0.4)] text-white leading-relaxed text-[15px] relative"
          : "bg-white/60 glass-panel rounded-2xl p-5 shadow-lg text-on-surface-variant leading-relaxed text-[15px]"
        }
      >
        {isSelf && <div className="absolute inset-0 bg-white/10 rounded-2xl blur-[1px]"></div>}
        <span className="relative z-10">{text}</span>
      </motion.div>
    </motion.div>
  );
}
