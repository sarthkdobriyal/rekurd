import { useState, useEffect, useMemo, useRef } from "react";

const useAudio = (url: string, onEnd?: () => void, onPause?: () => void) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!audioRef.current) {
      const audioElement = new Audio(url);
      console.log("newAudioEllement")
      audioElement.loop = false;
      audioElement.preload = "auto";
      audioRef.current = audioElement;

      const handleEnded = () => {
        setIsPlaying(false);
        if (onEnd) onEnd();
      };

      audioElement.addEventListener("ended", handleEnded);

      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [url, onEnd]);

  const playFrom = (time: number) => {
    if (audio) {
      audio.currentTime = time;
      audio.play();
      setIsPlaying(true);
    }
  };

  const playPauseSong = (pausedAt: number) => {
    if (audio) {
      console.log(isPlaying ,"isPlaying")
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.currentTime = pausedAt;
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const playStopSong = () => {
    if (audio) {
      console.log(isPlaying, "isPlaying")
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const play = () => {
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seek = () => {
    return audio ? audio.currentTime : 0;
  };

  const stop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const muteUnmute = () => {
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return {
    isPlaying,
    play,
    pause,
    stop,
    playPauseSong,
    playStopSong,
    playFrom,
    duration: audio ? audio.duration : 0,
    muteUnmute,
    currentTime,
    isMuted,
    seek,
    setCurrentTime,
  };
};

export default useAudio;