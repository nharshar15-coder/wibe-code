import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#08080a] text-white">
      {/* Header */}
      <header className="h-[60px] px-6 flex items-center justify-between border-b border-[#1f1f27] bg-[#121216]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#39ff14] flex items-center justify-center font-mono font-bold text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.5)]">
            S
          </div>
          <div className="font-black tracking-[2px] text-lg uppercase">
            SynthSnake <span className="text-[#39ff14]">v1.0</span>
          </div>
        </div>
        <div className="font-mono text-xs text-[#8e9299] hidden sm:block">
          [ FPS: 60 | CPU: 12% | LATENCY: 24ms ]
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 grid grid-cols-[300px_1fr_280px] gap-5 p-5 overflow-hidden">
        {/* Sidebar Left: Player */}
        <aside className="panel flex flex-col h-full overflow-hidden">
          <MusicPlayer />
        </aside>

        {/* Center: Game */}
        <section className="panel flex flex-col items-center justify-center bg-black relative">
          <div className="w-full flex justify-center py-4 bg-[#121216]/50 border-b border-[#1f1f27]">
             <span className="text-[10px] text-[#8e9299] uppercase tracking-widest font-mono">Neural Interface Online</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <SnakeGame />
          </div>
        </section>

        {/* Sidebar Right: Stats/Playlist */}
        <aside className="panel flex flex-col p-4 gap-6">
          <div className="space-y-4">
             <div className="text-[10px] uppercase tracking-wider text-[#8e9299] font-bold">Session Activity</div>
             <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded bg-white/5 border-l-2 border-[#00f3ff]">
                   <div className="text-xs">Neon Horizon</div>
                   <div className="font-mono text-[10px] text-[#8e9299]">03:42</div>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer opacity-50">
                   <div className="text-xs">Electric Dreams</div>
                   <div className="font-mono text-[10px] text-[#8e9299]">02:15</div>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer opacity-50">
                   <div className="text-xs">Digital Pulse</div>
                   <div className="font-mono text-[10px] text-[#8e9299]">04:01</div>
                </div>
             </div>
          </div>

          <div className="pt-6 border-t border-[#1f1f27] space-y-4">
            <div className="text-[10px] uppercase tracking-wider text-[#8e9299] font-bold">Global Leaders</div>
            <div className="space-y-3">
               {[
                 { name: 'CYBER_PUNK', score: '12,400' },
                 { name: 'NEO_TOKYO', score: '10,150' },
                 { name: 'GLITCH_KID', score: '09,800' }
               ].map((user, i) => (
                 <div key={i} className="flex justify-between font-mono text-xs">
                    <span className="text-[#8e9299]">{`0${i+1}. ${user.name}`}</span>
                    <span className="text-[#39ff14]">{user.score}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-auto space-y-2 font-mono text-[9px] text-[#8e9299]/50 uppercase tracking-widest">
            <div>Auth: Verified</div>
            <div>Secure Connection Mode</div>
            <div>© 2026 SynthCore Industries</div>
          </div>
        </aside>
      </main>
    </div>
  );
}
