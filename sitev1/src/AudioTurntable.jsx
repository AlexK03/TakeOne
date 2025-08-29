import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * AudioTurntable
 * - Starts from the beginning (no random seek)
 * - Adds a scrubber/selector below the disk to jump to any point in the set
 * - Keeps styling aligned with the page via CSS variables
 *
 * Props:
 *  - src: string (audio url)
 *  - diskPng: string (image url)
 *  - size: number (px, diameter of the disk)
 *  - label: string (aria label & button label)
 */
export default function AudioTurntable({ src, diskPng, size = 200, label = "Play" }) {
    const audioRef = useRef(null);
    const rafRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [current, setCurrent] = useState(0);
    const [seeking, setSeeking] = useState(false);

    // Ensure we never start at a random position
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        // Reset states when src changes
        setIsReady(false);
        setIsPlaying(false);
        setCurrent(0);
        setDuration(0);

        // Important: load fresh and start from 0
        el.pause();
        el.src = src || "";
        el.load();
        el.currentTime = 0;

        const onLoaded = () => {
            setIsReady(true);
            setDuration(Number.isFinite(el.duration) ? el.duration : 0);
            // keep paused initially; don't autoplay
            setCurrent(0);
        };

        const onEnd = () => {
            setIsPlaying(false);
            cancelAnimationFrame(rafRef.current);
            setCurrent(0);
            el.currentTime = 0;
        };

        el.addEventListener("loadedmetadata", onLoaded);
        el.addEventListener("ended", onEnd);
        return () => {
            el.removeEventListener("loadedmetadata", onLoaded);
            el.removeEventListener("ended", onEnd);
            cancelAnimationFrame(rafRef.current);
        };
    }, [src]);

    // Drive UI time while playing
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        if (isPlaying) {
            const tick = () => {
                if (!seeking) setCurrent(el.currentTime || 0);
                rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);
            return () => cancelAnimationFrame(rafRef.current);
        } else {
            cancelAnimationFrame(rafRef.current);
        }
    }, [isPlaying, seeking]);

    const toggle = async () => {
        const el = audioRef.current;
        if (!el || !isReady) return;
        if (isPlaying) {
            el.pause();
            setIsPlaying(false);
        } else {
            try {
                await el.play();
                setIsPlaying(true);
            } catch (e) {
                // Autoplay blocked or other error; remain paused
                console.warn("Audio play failed:", e);
            }
        }
    };

    // Scrubber handlers
    const handleScrubStart = () => setSeeking(true);
    const handleScrubChange = (e) => {
        const el = audioRef.current;
        if (!el) return;
        const t = Number(e.target.value);
        setCurrent(t);
    };
    const handleScrubEnd = (e) => {
        const el = audioRef.current;
        if (!el) return;
        const t = Number(e.target.value);
        el.currentTime = t;
        setCurrent(t);
        setSeeking(false);
    };

    const timeToMMSS = (t) => {
        if (!Number.isFinite(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Styles aligned with site tokens
    const S = useMemo(() => ({
        wrap: {
            display: "grid",
            justifyItems: "center",
            gap: "0.75rem",
            color: "var(--ink)",
        },
        diskWrap: {
            position: "relative",
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: "0 12px 40px rgba(0,0,0,.12)",
            background: "var(--bg)",
            border: "1px solid var(--line)",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
        },
        disk: {
            width: size - 14,
            height: size - 14,
            backgroundImage: `url(${diskPng})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            filter: "drop-shadow(0 6px 16px rgba(0,0,0,.18))",
            animation: isPlaying ? "turntable-spin 2.7s linear infinite" : "none",
        },
        playBtn: {
            fontWeight: 700,
            padding: ".6rem 1rem",
            borderRadius: "999px",
            border: "1px solid var(--line)",
            background: "var(--bg)",
            cursor: isReady ? "pointer" : "not-allowed",
            opacity: isReady ? 1 : 0.6,
            userSelect: "none",
        },
        scrubberCard: {
            width: "min(560px, 92vw)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            background: "var(--bg)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: "0.75rem 0.9rem",
            boxShadow: "0 20px 60px rgba(0,0,0,.08)",
        },
        row: {
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: ".6rem",
        },
        time: { fontVariantNumeric: "tabular-nums", fontSize: ".9rem", color: "var(--mute)" },
        range: {
            appearance: "none",
            width: "100%",
            height: "6px",
            borderRadius: "999px",
            background: `linear-gradient(90deg, var(--violet), var(--green))`,
            outline: "none",
        },
    }), [size, diskPng, isPlaying, isReady]);

    return (
        <div className="turntable" style={S.wrap}>
            {/* Hidden audio element */}
            <audio ref={audioRef} preload="metadata" />

            {/* Disk */}
            <div style={S.diskWrap} aria-live="polite">
                <div style={S.disk} />
            </div>

            {/* Play/Pause */}
            <button
                type="button"
                style={S.playBtn}
                onClick={toggle}
                aria-pressed={isPlaying}
                aria-label={label}
            >
                {isPlaying ? "Pause" : label}
            </button>

            {/* Scrubber / Selector */}
            <div className="turntable__scrubber card" style={S.scrubberCard}>
                <div style={S.row}>
                    <span style={S.time}>{timeToMMSS(current)}</span>
                    <input
                        type="range"
                        min={0}
                        max={Math.max(1, Math.floor(duration))}
                        step={1}
                        value={Math.floor(current)}
                        onMouseDown={handleScrubStart}
                        onTouchStart={handleScrubStart}
                        onChange={handleScrubChange}
                        onMouseUp={handleScrubEnd}
                        onTouchEnd={handleScrubEnd}
                        aria-label="Select position in the set"
                        style={S.range}
                    />
                    <span style={S.time}>{timeToMMSS(duration)}</span>
                </div>
            </div>

            {/* Keyframes for spin */}
            <style>{`
        @keyframes turntable-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        /* Improve input range hit area on mobile */
        .turntable__scrubber input[type="range"] { height: 24px; }
        .turntable__scrubber input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: var(--cyan); border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,.2);
          margin-top: -6px;
        }
        .turntable__scrubber input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%; background: var(--cyan); border: 2px solid white;
        }
        .turntable__scrubber input[type="range"]::-webkit-slider-runnable-track {
          height: 6px; border-radius: 999px; background: transparent;
        }
        .turntable__scrubber input[type="range"]:focus { outline: none; }
      `}</style>
        </div>
    );
}
