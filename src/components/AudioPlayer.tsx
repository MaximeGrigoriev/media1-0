import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioFile?: File;
  title?: string;
  coverImage?: string;
  showAvatar?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioFile, 
  title = "Audio Track",
  coverImage = "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  showAvatar = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate waveform visualization
  useEffect(() => {
    if (audioFile) {
      // Create URL for audio playback
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const channelData = audioBuffer.getChannelData(0);
          
          // Sample the audio data for visualization
          const samples = 60;
          const blockSize = Math.floor(channelData.length / samples);
          const waveformData = [];
          
          for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
              sum += Math.abs(channelData[i * blockSize + j]);
            }
            waveformData.push(sum / blockSize);
          }
          
          setAudioData(waveformData);
        } catch (error) {
          console.error('Error processing audio:', error);
          // Fallback to random waveform
          setAudioData(Array.from({ length: 60 }, () => Math.random()));
        }
      };
      
      reader.readAsArrayBuffer(audioFile);
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // Default waveform pattern
      setAudioData(Array.from({ length: 60 }, () => Math.random()));
      setAudioUrl('');
    }
  }, [audioFile]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || audioData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / audioData.length;
    const progress = duration > 0 ? currentTime / duration : 0;

    ctx.clearRect(0, 0, width, height);

    audioData.forEach((value, index) => {
      const barHeight = Math.max(2, value * height * 0.8);
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      // Determine if this bar should be colored (played portion)
      const barProgress = index / audioData.length;
      const isPlayed = barProgress <= progress;
      
      ctx.fillStyle = isPlayed ? '#10b981' : '#d1d5db';
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight);
    });
  }, [audioData, currentTime, duration]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleCanPlay = () => {
    // Audio is ready to play
  };

  const handleError = (e: any) => {
    console.error('Audio error:', e);
    setIsPlaying(false);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioRef.current || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const canvasWidth = rect.width;
    const clickProgress = clickX / canvasWidth;
    
    // Ограничиваем значение от 0 до 1
    const clampedProgress = Math.max(0, Math.min(1, clickProgress));
    const newTime = clampedProgress * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          onError={handleError}
          preload="metadata"
        />
      )}
      
      <div className="flex items-center gap-4">
        {/* Avatar - показывается только если showAvatar = true */}
        {showAvatar && (
          <div className="flex-shrink-0">
            <img
              src={coverImage}
              alt="Track cover"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm truncate mb-2">
            {audioFile ? audioFile.name.replace(/\.[^/.]+$/, "") : title}
          </h3>
          
          {/* Waveform */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={30}
              className="w-full h-6 cursor-pointer"
              onClick={handleWaveformClick}
            />
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0 ${
            audioUrl 
              ? 'bg-green-500 hover:bg-green-600 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};