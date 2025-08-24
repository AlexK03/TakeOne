import React, { useEffect, useRef, useState } from "react";

export default function AudioTurntable({
                                           src,                 // import from assets, e.g. import setMp3 from "./assets/takeone_set.mp3"
                                           diskPng,             // import from assets, e.g. import disk from "./assets/disk.png"
                                           size = 160,
                                           minTailSeconds = 30, // avoid picking a random time too close to the end
                                           label = "Play DJ set",
                                           className = "",
                                       }) {
    const audioRef = useRef(null);
    const diskRef  = useRef(null);

    const [ready, setReady]     = useState(false);
    const [playing, setPlaying] = useState(false);

    // angle (deg) stored between play/pause so the disk doesn't jump back to 0°
    const [angle, setAngle] = useState(0);
    const lastStart = useRef(null); // performance.now() timestamp when spinning started

    // Keep CSS var in sync so base transform = rotate(var(--angle))
    useEffect(() => {
        if (diskRef.current) {
            diskRef.current.style.setProperty("--angle", `${angle}deg`);
        }
    }, [angle]);

    // metadata → know duration for random seek
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        const onMeta = () => setReady(Number.isFinite(a.duration));
        a.addEventListener("loadedmetadata", onMeta, { once: true });
        if (Number.isFinite(a.duration)) setReady(true);
        return () => a.removeEventListener?.("loadedmetadata", onMeta);
    }, []);

    const pickRandomTime = (duration) => {
        const max = Math.max(0, duration - minTailSeconds);
        return Math.random() * max;
    };

    const startPlaying = async () => {
        const a = audioRef.current;
        if (!a) return;

        if (!ready || !Number.isFinite(a.duration)) {
            await new Promise((res) => {
                const once = () => (setReady(true), res());
                a.addEventListener("loadedmetadata", once, { once: true });
                a.load();
            });
        }

        // always jump to a fresh random position in the set
        try {
            a.currentTime = pickRandomTime(a.duration || 0);
        } catch {
            /* if not seekable yet, ignore — next click will work */
        }

        await a.play();
        lastStart.current = performance.now(); // mark when spin starts
        setPlaying(true);
    };

    const freezeAngleNow = () => {
        // compute how much we rotated since lastStart and add to the stored angle
        if (!lastStart.current) return;
        const now = performance.now();
        const elapsedMs = now - lastStart.current;
        const rotationMs = 2600; // one full turn = 2.6s (keep in sync with CSS)
        const turns = elapsedMs / rotationMs;
        const deltaDeg = (turns * 360) % 360;
        setAngle((prev) => (prev + deltaDeg) % 360);
    };

    const pausePlaying = () => {
        const a = audioRef.current;
        if (!a) return;
        a.pause();
        freezeAngleNow();   // lock disk at its current angle
        setPlaying(false);
    };

    const toggle = () => (playing ? pausePlaying() : startPlaying());

    // If the audio naturally ends, freeze the disk where it is.
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        const onEnded = () => {
            freezeAngleNow();
            setPlaying(false);
        };
        a.addEventListener("ended", onEnded);
        return () => a.removeEventListener("ended", onEnded);
    }, []);

    return (
        <div className={`turntable ${className}`} style={{ width: size, userSelect: "none" }}>
            <button
                type="button"
                aria-label={label}
                title={playing ? "Pause" : "Play"}
                className={`turntable__btn ${playing ? "is-playing" : ""}`}
                onClick={toggle}
                style={{ width: size, height: size }}
            >
                <img
                    ref={diskRef}
                    className="turntable__disk"
                    src={diskPng}
                    alt=""
                    width={size}
                    height={size}
                    draggable="false"
                />
            </button>

            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                playsInline
                onError={(e) => console.warn("Audio failed to load:", e.currentTarget.error)}
            />
        </div>
    );
}
