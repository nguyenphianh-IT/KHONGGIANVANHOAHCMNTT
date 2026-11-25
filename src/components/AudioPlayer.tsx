import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Radio, 
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';

interface AudioPlayerProps {
  title: string;
  source: string;
  dateOrEra: string;
  duration?: string; // e.g. "04:30"
  audioUrl?: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  source,
  dateOrEra,
  duration = '04:30',
  audioUrl,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(270);
  const [isMuted, setIsMuted] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const finalAudioUrl = audioUrl || '/audio/tuyen-ngon-doc-lap-1945.mp3';

  // Parse duration "MM:SS" to seconds initial state
  useEffect(() => {
    const parts = duration.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setDurationSeconds(parts[0] * 60 + parts[1]);
    }
  }, [duration]);

  // Format seconds to "MM:SS"
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setPlayError(null);
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Audio playback error:", err);
            setPlayError("Trình duyệt cần bạn chạm vào màn hình hoặc bật nút âm lượng để phát.");
            setIsPlaying(false);
          });
      }
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const progressPercent = durationSeconds > 0 
    ? Math.min(100, (currentTime / durationSeconds) * 100)
    : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-heritage-ink-950 via-heritage-red-950 to-heritage-ink-900 border-2 border-heritage-gold-400/80 p-5 sm:p-7 text-white shadow-2xl ${className}`}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-heritage-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <Radio className="absolute -right-4 -bottom-4 w-36 h-36 text-white/[0.03] pointer-events-none" />

      {/* Real HTML5 Audio Element hỗ trợ Byte-Range Streaming HTTP 206 */}
      <audio
        ref={audioRef}
        src={finalAudioUrl}
        preload="metadata"
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            setDurationSeconds(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setPlayError("Không thể tải file âm thanh trực tiếp. Vui lòng thử nút Tải file MP3.");
        }}
      />

      {/* Header bar of the player */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
        <div className="flex items-center space-x-3.5">
          {/* Đĩa than cổ điển & Cần gạt kim đĩa (Classic Vinyl Turntable & Tonearm) */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/50 border border-heritage-gold-400/40 shadow-inner">
            {/* Vinyl Disc */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isPlaying
                  ? { repeat: Infinity, duration: 3.6, ease: 'linear' }
                  : { duration: 0.4, ease: 'easeOut' }
              }
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-stone-950 via-stone-800 to-stone-900 border border-white/20 flex items-center justify-center shadow-md relative"
            >
              {/* Vinyl Grooves */}
              <div className="absolute inset-1.5 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute inset-3 rounded-full border border-white/10 pointer-events-none" />
              {/* Center Heritage Label */}
              <div className="w-4 h-4 rounded-full bg-heritage-red-700 border border-heritage-gold-400 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-heritage-gold-200" />
              </div>
            </motion.div>

            {/* Tonearm (Cần gạt kim đĩa) */}
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{ rotate: isPlaying ? 16 : -14 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              style={{ transformOrigin: 'top center' }}
              className="absolute top-1 right-1.5 w-1 h-6 sm:h-7 pointer-events-none z-10 flex flex-col items-center"
            >
              {/* Pivot */}
              <div className="w-2 h-2 rounded-full bg-heritage-gold-300 border border-stone-900 shadow-xs flex-shrink-0" />
              {/* Arm shaft */}
              <div className="w-0.5 flex-1 bg-gradient-to-b from-heritage-gold-200 to-heritage-gold-400 rounded-full" />
              {/* Cartridge head */}
              <div className="w-1.5 h-1.5 rounded-xs bg-heritage-gold-500 border border-black/50 flex-shrink-0" />
            </motion.div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-heritage-gold-300 font-sans">
                BĂNG GHI ÂM TƯ LIỆU LỊCH SỬ
              </span>
              <span className="flex h-2 w-2 relative">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-emerald-400' : 'bg-heritage-gold-500/60'}`} />
              </span>
            </div>
            <span className="text-[11px] text-heritage-ivory-200/80 block">
              {source} • {dateOrEra}
            </span>
          </div>
        </div>

        {/* Verification Pill */}
        <div className="flex items-center space-x-1 text-[11px] font-semibold text-heritage-gold-200 bg-white/10 px-2.5 py-1 rounded-full border border-heritage-gold-400/30">
          <ShieldCheck className="w-3.5 h-3.5 text-heritage-gold-400" />
          <span>Âm thanh tư liệu gốc</span>
        </div>
      </div>

      {/* Main Track Display */}
      <div className="py-4">
        <h4 className="font-serif font-bold text-base sm:text-lg text-white leading-snug line-clamp-2">
          {title}
        </h4>

        {/* Sound Waveform Visualizer */}
        <div className="mt-3 flex items-center justify-between gap-1 h-8 px-2 py-1 bg-black/40 rounded-xl border border-white/10">
          {Array.from({ length: 32 }).map((_, i) => {
            const isActive = (i / 32) * 100 <= progressPercent;
            const baseHeights = [30, 45, 60, 80, 50, 70, 90, 40, 65, 85, 95, 60, 40, 75, 85, 55, 35, 65, 90, 75, 50, 80, 60, 40, 70, 85, 65, 45, 60, 80, 50, 30];
            const height = baseHeights[i % baseHeights.length];
            return (
              <motion.span
                key={i}
                className={`w-1 rounded-full ${
                  isActive 
                    ? 'bg-heritage-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]' 
                    : 'bg-white/20'
                }`}
                animate={
                  isPlaying
                    ? {
                        height: [
                          `${Math.max(20, height * 0.45)}%`,
                          `${Math.min(100, height)}%`,
                          `${Math.max(25, height * 0.6)}%`,
                        ],
                      }
                    : { height: `${height * 0.4}%` }
                }
                transition={
                  isPlaying
                    ? {
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 0.45 + (i % 5) * 0.12,
                        delay: (i % 7) * 0.05,
                        ease: 'easeInOut',
                      }
                    : { duration: 0.25 }
                }
              />
            );
          })}
        </div>
      </div>

      {/* Seekbar and Timeline */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max={durationSeconds || 100}
          step="0.5"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-heritage-gold-400 focus:outline-none"
        />
        <div className="flex justify-between text-xs font-mono text-heritage-gold-200/90 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span className="text-white/70">Thời lượng: {formatTime(durationSeconds)}</span>
        </div>
      </div>

      {playError && (
        <div className="mt-3 p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{playError}</span>
        </div>
      )}

      {/* Interactive Player Controls */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          {/* Big Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-heritage-gold-400 to-heritage-gold-500 text-heritage-red-950 shadow-lg hover:brightness-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-heritage-gold-300"
            title={isPlaying ? 'Tạm dừng' : 'Phát giọng đọc của Bác'}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát giọng đọc của Bác'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Restart from beginning */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-heritage-ivory-200 hover:text-white transition active:scale-95"
            title="Phát lại từ đầu"
            aria-label="Phát lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <span className="text-xs text-heritage-gold-300 font-medium hidden sm:inline">
            {isPlaying ? '🔊 Đang phát giọng đọc của Chủ tịch Hồ Chí Minh...' : 'Bấm nút tròn vàng để nghe giọng đọc của Bác'}
          </span>
        </div>

        {/* Volume & Audio Source Link */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-heritage-ivory-200 transition"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <a
            href={finalAudioUrl}
            download={`ghi-am-bac-ho-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp3`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-heritage-gold-500/20 hover:bg-heritage-gold-500/30 text-heritage-gold-200 hover:text-white border border-heritage-gold-400/40 text-xs font-semibold transition"
            title="Tải tệp âm thanh MP3 về máy"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải MP3</span>
          </a>
        </div>
      </div>

      {/* Native audio controls fallback */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <details className="text-[11px] text-white/60 cursor-pointer">
          <summary className="hover:text-heritage-gold-300 transition-colors">
            Khung phát chuẩn của thiết bị (Nếu không nghe được)
          </summary>
          <div className="mt-2 pt-2">
            <audio controls className="w-full h-8 rounded" src={finalAudioUrl} />
          </div>
        </details>
      </div>
    </div>
  );
};
