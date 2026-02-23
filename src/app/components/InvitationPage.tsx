import React, { useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { PartyPopper, Sparkles, Music, Calendar, Clock, Star, Zap, Gift, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Event date: February 25, 2026 at 10:00 PM
const EVENT_DATE = new Date('2026-02-25T22:00:00');

type AppState = 'email-input' | 'waiting' | 'approved' | 'restricted';

export function InvitationPage() {
  const [appState, setAppState] = useState<AppState>('email-input');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [eventStarted, setEventStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pollIntervalRef = useRef<number | null>(null);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const eventTime = EVENT_DATE.getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setEventStarted(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Poll for approval status
  useEffect(() => {
    if (appState === 'waiting' && email) {
      const pollApproval = async () => {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-6776d9ad/approval-status`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify({ email })
            }
          );

          const data = await response.json();
          if (data.approved) {
            setAppState('approved');
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
            // Auto-play music when approved
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
                setMusicPlaying(true);
              }
            }, 500);
          }
        } catch (error) {
          console.error('Error polling approval status:', error);
        }
      };

      pollApproval();
      pollIntervalRef.current = window.setInterval(pollApproval, 3000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [appState, email]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6776d9ad/check-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!data.authorized) {
        setAppState('restricted');
      } else if (data.approved) {
        setAppState('approved');
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
            setMusicPlaying(true);
          }
        }, 500);
      } else {
        setAppState('waiting');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setAppState('restricted');
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Play prevented:', e));
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Animated Background - Colorful Confetti */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(30)].map((_, i) => {
            const colors = ['bg-pink-500', 'bg-purple-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-green-400'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${color} rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.4, 1, 0.4],
                  rotate: [0, 360],
                  y: [0, -50, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {appState === 'email-input' && (
            <motion.div
              key="email-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center px-4"
            >
              <div className="max-w-md w-full">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <PartyPopper className="w-20 h-20 text-pink-400 mx-auto drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]" />
                  </motion.div>
                  <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-3 drop-shadow-2xl">
                    FRESHERS PARTY
                  </h1>
                  <p className="text-2xl font-bold text-yellow-300 mb-2">2026</p>
                  <p className="text-pink-300 text-lg font-semibold">🎊 The Ultimate Welcome Bash 🎊</p>
                </motion.div>

                <motion.form
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onSubmit={handleEmailSubmit}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border-2 border-pink-400/40 shadow-[0_0_40px_rgba(236,72,153,0.3)]"
                >
                  <label className="block text-cyan-300 mb-3 font-bold text-lg">Enter Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@college.edu"
                    className="w-full px-4 py-4 bg-black/30 border-2 border-purple-400/50 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all text-lg"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-black text-lg rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] transition-all duration-300"
                  >
                    🚀 JOIN THE PARTY 🚀
                  </motion.button>
                </motion.form>

                <div className="mt-6 text-center">
                  <a 
                    href="/admin" 
                    className="text-purple-400/40 text-sm hover:text-purple-300/60 transition-colors"
                  >
                    Admin Access
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {appState === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center px-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity }
                  }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.9)]" />
                </motion.div>
                
                <motion.h2
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-4 drop-shadow-2xl"
                >
                  ⏳ Getting Your VIP Pass Ready...
                </motion.h2>
                
                <p className="text-purple-300 text-xl font-semibold mb-2">
                  Waiting for approval from the party crew!
                </p>
                <p className="text-cyan-400/80 text-lg">
                  Hang tight, you'll be dancing soon! 💃🕺
                </p>

                <div className="mt-8 flex justify-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {appState === 'approved' && (
            <motion.div
              key="approved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen"
            >
              {/* Countdown Section */}
              <div className="py-10 px-4 border-b-2 border-pink-500/40 bg-gradient-to-b from-purple-900/50 to-transparent">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Rocket className="w-10 h-10 text-yellow-400 animate-bounce" />
                    <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                      {eventStarted ? '🎉 PARTY TIME! LET\'S GO! 🎉' : '⏰ COUNTDOWN TO MADNESS'}
                    </h2>
                    <Star className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>

                  {!eventStarted ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                      {[
                        { label: 'Days', value: countdown.days, color: 'from-pink-500 to-purple-500' },
                        { label: 'Hours', value: countdown.hours, color: 'from-purple-500 to-cyan-500' },
                        { label: 'Minutes', value: countdown.minutes, color: 'from-cyan-500 to-green-500' },
                        { label: 'Seconds', value: countdown.seconds, color: 'from-green-500 to-yellow-500' },
                      ].map((item) => (
                        <motion.div
                          key={item.label}
                          className={`bg-gradient-to-br ${item.color} p-6 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.5)] border-2 border-white/20`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                            {String(item.value).padStart(2, '0')}
                          </div>
                          <div className="text-white/90 text-sm md:text-base font-bold mt-2 uppercase">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                        🔥 THE PARTY HAS STARTED! 🔥
                      </p>
                    </motion.div>
                  )}

                  <div className="text-center mt-8 text-cyan-300/90">
                    <p className="text-xl font-bold">📅 February 25, 2026 • 🕥 10:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="py-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  >
                    <PartyPopper className="w-32 h-32 text-pink-400 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(236,72,153,1)]" />
                  </motion.div>

                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 drop-shadow-2xl"
                  >
                    WELCOME FRESHER!
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl md:text-4xl text-yellow-300 mb-4 font-bold"
                  >
                    🎊 You're In! Let's Make Some Memories! 🎊
                  </motion.p>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border-2 border-pink-400/40 shadow-[0_0_50px_rgba(236,72,153,0.4)] mb-8"
                  >
                    <div className="flex justify-center gap-4 mb-6">
                      <Star className="w-10 h-10 text-yellow-400" />
                      <Sparkles className="w-10 h-10 text-cyan-400" />
                      <Gift className="w-10 h-10 text-pink-400" />
                    </div>
                    <p className="text-2xl text-white/95 leading-relaxed font-semibold mb-4">
                      Get ready for the most EPIC night of your college life! 
                    </p>
                    <p className="text-xl text-purple-200/90 leading-relaxed">
                      Music, dancing, new friends, crazy fun, and unforgettable moments await you! 
                      This is where your college journey truly begins! 🚀✨
                    </p>
                  </motion.div>

                  {/* Music Control */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    onClick={toggleMusic}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-black text-xl rounded-full shadow-[0_0_40px_rgba(236,72,153,0.8)] hover:shadow-[0_0_60px_rgba(236,72,153,1)] transition-all duration-300 flex items-center gap-4 mx-auto"
                  >
                    <Music className="w-8 h-8" />
                    {musicPlaying ? '🔇 PAUSE THE BEATS' : '🎵 PUMP UP THE MUSIC'}
                  </motion.button>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-14 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 backdrop-blur-sm p-8 rounded-3xl border-2 border-yellow-400/50"
                  >
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 mb-4">
                      🎓 CONGRATULATIONS! 🎓
                    </p>
                    <p className="text-2xl text-cyan-300 font-bold">
                      You're officially part of the COOLEST batch! 
                    </p>
                    <p className="text-xl text-purple-300 mt-2">
                      Let's make this year LEGENDARY! 🔥🎉
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Photo Gallery Section */}
              <div className="py-16 px-4 bg-gradient-to-b from-transparent via-purple-900/30 to-pink-900/30">
                <div className="max-w-6xl mx-auto">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-center mb-10"
                  >
                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-4">
                      📸 LIVE PHOTO GALLERY
                    </h2>
                    <p className="text-cyan-300 text-xl font-bold">
                      Watch the magic unfold in real-time! ✨
                    </p>
                    <p className="text-purple-300 text-lg mt-2">
                      Our photographer is capturing every crazy moment!
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.4)]"
                  >
                    <div className="bg-black/40 rounded-2xl overflow-hidden border-2 border-pink-400/30">
                      <iframe
                        src="https://drive.google.com/embeddedfolderview?id=16F0vXhupp_Fa_d9xVFv6vGeGFcMdMmbH#grid"
                        className="w-full h-[700px] border-0"
                        title="Freshers Party Photo Gallery"
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-yellow-300 font-bold text-lg">
                        🌟 Photos appear automatically as they're uploaded!
                      </p>
                      <p className="text-cyan-300/80 text-sm mt-2">
                        Tag yourself and share the memories! 📱
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="py-10 text-center border-t-2 border-pink-500/40 bg-gradient-to-b from-purple-900/50 to-black/50">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-2">
                    FRESHERS 2026 🎉
                  </p>
                  <p className="text-purple-300/80 text-sm">
                    © 2026 • An Unforgettable College Experience Awaits!
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <Star className="w-5 h-5 text-pink-400" />
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {appState === 'restricted' && (
            <motion.div
              key="restricted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center px-4"
            >
              <div className="max-w-md w-full text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-red-500/20 border-4 border-red-400/50 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-7xl">😢</span>
                  </div>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-black text-red-400 mb-6 drop-shadow-[0_0_30px_rgba(248,113,113,0.6)]">
                  Oops! Not on the List
                </h2>

                <div className="bg-red-500/10 backdrop-blur-md p-8 rounded-3xl border-2 border-red-400/40 mb-6">
                  <p className="text-red-300 text-xl font-semibold mb-4">
                    Your email isn't registered for this epic party! 😔
                  </p>
                  <p className="text-red-400/80 text-lg">
                    Contact the organizing team to get yourself added to the guest list!
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    setAppState('email-input');
                    setEmail('');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(248,113,113,0.6)] hover:shadow-[0_0_50px_rgba(248,113,113,0.8)] transition-all duration-300"
                >
                  🔄 Try Another Email
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
