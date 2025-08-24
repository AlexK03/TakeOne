import React, { useRef, useState, useEffect } from "react";
import "./styles.css";

/**
 * One long set. Place the file in /public/audio/djset.mp3
 */
const SET_SRC = "/audio/homeTrack.mp3";

// avoid starting in very first/last seconds to skip silence/intros/outros
const START_BUFFER_SEC = 8;   // head
const END_BUFFER_SEC   = 8;   // tail
const MIN_GAP_FROM_LAST = 12; // try not to land within 12s of last start

export default function DiskPlayer({
                                       diskSrc = "/img/spinningLogo.png", // /public/images/disk.png
                                       size = 120,
                                   }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(null);
    const [lastStartAt, setLastStartAt] = useState(null); // track previous random start

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        // set source once
        a.src = SET_SRC;

        const onLoadedMeta = () => setDuration(a.duration || null);
        const onEnded = () => setIsPlaying(false);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        a.addEventListener("loadedmetadata", onLoadedMeta);
        a.addEventListener("ended", onEnded);
        a.addEventListener("play", onPlay);
        a.addEventListener("pause", onPause);

        return () => {
            a.removeEventListener("loadedmetadata", onLoadedMeta);
            a.removeEventListener("ended", onEnded);
            a.removeEventListener("play", onPlay);
            a.removeEventListener("pause", onPause);
        };
    }, []);

    const pickRandomStart = (dur) => {
        const safeDur = Math.max(0, dur - START_BUFFER_SEC - END_BUFFER_SEC);
        if (safeDur <= 0) return 0;

        // try a few times to avoid being too close to lastStartAt
        let start = 0;
        for (let i = 0; i < 5; i++) {
            start = START_BUFFER_SEC + Math.random() * safeDur;
            if (
                lastStartAt == null ||
                Math.abs(start - lastStartAt) >= MIN_GAP_FROM_LAST
            ) break;
        }
        return start;
    };

    const playFromRandomPoint = () => {
        const a = audioRef.current;
        if (!a) return;

        // if duration known, seek immediately; else wait for metadata
        const doPlay = () => {
            const dur = duration ?? a.duration;
            const t = pickRandomStart(dur || 0);
            try {
                a.currentTime = t;
            } catch {
                // some browsers only allow seek after play has begun; fallback to after play
            }
            setLastStartAt(t);

            const p = a.play();
            if (p && typeof p.catch === "function") {
                p.catch(() => {
                    // autoplay won’t be blocked here because we're in a click handler,
                    // but guard just in case.
                });
            }
        };

        if (duration || a.readyState >= 1) {
            doPlay();
        } else {
            const once = () => {
                a.removeEventListener("loadedmetadata", once);
                setDuration(a.duration || null);
                doPlay();
            };
            a.addEventListener("loadedmetadata", once);
            a.load(); // ensure metadata loads
        }
    };

    const toggle = () => {
        const a = audioRef.current;
        if (!a) return;

        if (isPlaying) {
            a.pause();           // stop spinning; next click will randomize again
        } else {
            playFromRandomPoint();
        }
    };

    return (
        <div className="disk-player">
            <button
                type="button"
                className={`disk-btn ${isPlaying ? "disk-btn--spinning" : ""}`}
                style={{ width: size, height: size, backgroundImage: `url(${diskSrc})` }}
                onClick={toggle}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? "Pause set" : "Play set from random point"}
            />
            <audio ref={audioRef} preload="metadata" />
            <div className="disk-caption">
                {isPlaying ? "Playing" : "Tap to play (random point)"}
            </div>
        </div>
    );
}
