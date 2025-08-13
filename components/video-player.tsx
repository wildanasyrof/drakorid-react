"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle, Loader2 } from "lucide-react"
import type { Episode } from "@/lib/api"

interface VideoPlayerProps {
  episode: Episode
  dramaTitle: string
  episodeNumber: number
}

type Quality = "360" | "480" | "720"

export function VideoPlayer({ episode, dramaTitle, episodeNumber }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [quality, setQuality] = useState<Quality>("720")
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [useIframe, setUseIframe] = useState(false)

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isIframeUrl = (url: string) => {
    return (
      url.includes("bunny.php") ||
      url.includes("embed") ||
      url.includes("player") ||
      (!url.includes(".m3u8") && !url.includes(".mp4") && !url.includes(".webm"))
    )
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const videoUrl = episode.url[quality]

    if (!videoUrl) {
      setError(`No video URL available for ${quality}p quality`)
      setIsLoading(false)
      return
    }

    const shouldUseIframe = isIframeUrl(videoUrl)
    setUseIframe(shouldUseIframe)

    if (shouldUseIframe) {
      setIsLoading(false)
      setError(null)
      return
    }

    const isHLSStream = videoUrl.includes(".m3u8")
    setError(null)
    setIsLoading(true)

    const loadVideo = async () => {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }

        if (isHLSStream) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl
          } else {
            try {
              const Hls = (await import("hls.js")).default
              if (Hls.isSupported()) {
                const hls = new Hls({
                  enableWorker: true,
                  lowLatencyMode: true,
                })
                hlsRef.current = hls

                hls.on(Hls.Events.ERROR, (event, data) => {
                  if (data.fatal) {
                    setError(`HLS Error: ${data.details}`)
                    setIsLoading(false)
                  }
                })

                hls.on(Hls.Events.MANIFEST_LOADED, () => {
                  setIsLoading(false)
                })

                hls.loadSource(videoUrl)
                hls.attachMedia(video)
              } else {
                setError("HLS is not supported in this browser")
                setIsLoading(false)
              }
            } catch (error) {
              setError(`Failed to load HLS player: ${error}`)
              setIsLoading(false)
            }
          }
        } else {
          video.src = videoUrl
        }
      } catch (error) {
        setError(`Failed to load video: ${error}`)
        setIsLoading(false)
      }
    }

    loadVideo()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [episode.url, quality])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement
      let errorMessage = "Unknown video error"

      if (target.error) {
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Video playback was aborted"
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error occurred while loading video"
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Video format is not supported or corrupted"
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Video source is not supported"
            break
        }
      }

      setError(errorMessage)
      setIsLoading(false)
      setIsPlaying(false)
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", () => setIsPlaying(false))
    video.addEventListener("error", handleError)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", () => setIsPlaying(false))
      video.removeEventListener("error", handleError)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video || error) return

    try {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        await video.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError(`Playback failed: ${err}`)
      setIsPlaying(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video || error) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video || error) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video || error) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video || error) return

    if (!isFullscreen) {
      video.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleQualityChange = (newQuality: Quality) => {
    const video = videoRef.current

    setQuality(newQuality)
    setError(null)
    setIsLoading(true)

    if (useIframe) {
      setIsLoading(false)
      return
    }

    if (!video) return

    const currentTime = video.currentTime
    const wasPlaying = isPlaying

    video.addEventListener(
      "loadeddata",
      () => {
        video.currentTime = currentTime
        if (wasPlaying) {
          video.play().catch((err) => setError(`Playback failed: ${err}`))
        }
      },
      { once: true },
    )
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const retryVideo = () => {
    setError(null)
    setIsLoading(true)
    const video = videoRef.current
    if (video && !useIframe) {
      video.load()
    }
  }

  const availableQualities = Object.keys(episode.url).filter((key) => episode.url[key as Quality]) as Quality[]

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
    >
      {useIframe ? (
        <iframe
          src={episode.url[quality]}
          className="w-full aspect-video"
          allowFullScreen
          allow="autoplay; encrypted-media"
          title={`${dramaTitle} Episode ${episodeNumber}`}
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onClick={togglePlay}
          playsInline
          crossOrigin="anonymous"
        />
      )}

      {/* Quality Selector - Top Right Corner */}
      <div
        className={`absolute top-4 right-4 transition-opacity duration-300 z-10 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <Select value={quality} onValueChange={handleQualityChange}>
          <SelectTrigger className="w-20 bg-red-600 border-red-600 text-white text-sm hover:bg-red-700 focus:ring-red-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableQualities.map((q) => (
              <SelectItem key={q} value={q}>
                {q}p
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && !error && !useIframe && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center p-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold mb-2">Video Error</h3>
            <p className="text-sm text-gray-300 mb-4">{error}</p>
            <Button
              onClick={retryVideo}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black bg-transparent"
            >
              Retry
            </Button>
          </div>
        </div>
      )}          
    </div>
  )
}
