"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  posterImage: string;
  videoUrl: string;
}

export default function VideoBackground({ posterImage, videoUrl }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Delay video loading to prioritize page content
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, video will show poster
      });
    }
  }, [shouldLoadVideo]);

  return (
    <>
      {/* Poster image - shown immediately */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url('${posterImage}')` }}
      />
      
      {/* Video - loaded after delay */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setIsLoaded(true)}
          poster={posterImage}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </>
  );
}
