import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';

const DUMMY_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Cyber-Waves',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber1/300/300'
  },
  {
    id: '2',
    title: 'Synth Pulse',
    artist: 'Digital Aurora',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber2/300/300'
  },
  {
    id: '3',
    title: 'Pixel Night',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/cyber3/300/300'
  }
];

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = DUMMY_SONGS[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <div className="flex flex-col h-full p-5 gap-6">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-[#2a2a32] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSong.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            src={currentSong.cover}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="flex items-end gap-1.5 h-16">
              {[0.4, 0.8, 0.6, 0.9, 0.5, 0.7].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={isPlaying ? { height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] } : { height: `${h*100}%` }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  className="w-2 bg-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.6)]"
                />
              ))}
           </div>
        </div>
        <div className="absolute inset-0 bg-radial-at-center from-transparent via-black/20 to-black/60" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-[#00f3ff] leading-none tracking-tight truncate">{currentSong.title}</h3>
        <p className="text-xs text-[#8e9299] font-mono uppercase tracking-widest">{currentSong.artist}</p>
      </div>

      <div className="mt-auto space-y-6">
        <div className="space-y-2">
          <div className="h-1 w-full bg-[#2a2a32] rounded-full">
            <div 
              className="h-full bg-[#00f3ff] shadow-[0_0_5px_rgba(0,243,255,0.8)] transition-all duration-300 rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#8e9299] font-mono">
              <span>0:00</span>
              <span>3:45</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button onClick={handlePrev} className="text-[#8e9299] hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#ff00ea] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,0,234,0.4)]"
          >
            {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
          </button>

          <button onClick={handleNext} className="text-[#8e9299] hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 py-2">
          <Volume2 className="text-[#8e9299] w-3 h-3" />
          <div className="flex-1 h-[2px] bg-[#2a2a32] rounded-full">
              <div className="h-full bg-white/40 w-[80%]" />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    </div>
  );
}
