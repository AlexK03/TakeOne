import React, {useEffect, useMemo, useRef, useState} from "react";
import {motion} from "framer-motion";

// main.jsx or App.jsx
import './styles.css';

import PopupGallery from "./PopupGallery.jsx";
// place near PopupGallery import
import Modal from "react-modal";

console.log(
    'DEV BUILD ID:',
    new Date().toISOString(),
    'from file:',
    new URL(import.meta.url).pathname
  );

/**
 * Standard HTML + CSS + React (no Tailwind)
 * Clean, colorful event site with smooth scroll-reveals.
 * Edit the content objects (event, lineup, etc.) to customize.
 */

// App.jsx
const BASE = import.meta.env.BASE_URL; // used for public assets (e.g., /public/img/*)

// Import WebP images using glob
const zoonaImages = Object.values(
    import.meta.glob('./assets/zoona-03-05-2025/*.webp', {eager: true, query: '?url', import: 'default'})
);
const miroImages = Object.values(
    import.meta.glob('./assets/miro-18-04-2025/*.webp', {eager: true, query: '?url', import: 'default'})
);
const roncoloImages = Object.values(
    import.meta.glob('./assets/roncolo-22-03-2025/*.webp', {eager: true, query: '?url', import: 'default'})
);

const miro2Images = Object.values(
    import.meta.glob('./assets/miro-15-11-2024/*.webp', {eager: true, query: '?url', import: 'default'})
);

const goetheImages = Object.values(
    import.meta.glob('./assets/goetheHaus-15-05-2024/*.webp', {eager: true, query: '?url', import: 'default'})
);

const miro3Images = Object.values(
    import.meta.glob('./assets/miro-12-09-2025/*.webp', {eager: true, query: '?url', import: 'default'})
);




import zoonaPoster from './assets/logos/posterZoona.webp';
import miroPoster from './assets/logos/posterMiro.webp';
import ronPoster from './assets/logos/posterRoncolo.webp';
import lampelePoster from './assets/logos/posterLampele.webp';
import zoonaPoster2 from './assets/logos/posterZoona2.webp';
import goethePoster from './assets/logos/posterGoethe.webp';
import astraPoster from './assets/logos/posterAstra.webp';
import miro3Poster from './assets/logos/posterMiro12-09-2025.webp';

import logo from './assets/logos/logo2.webp';
import lonedImage from './assets/miro-18-04-2025/img1.jpg';
import davidePiras from './assets/artists/davidePiras.jpg';
import mattiaLorenzi from './assets/artists/mattiaLorenzi.jpg';
import AudioTurntable from "./AudioTurntable.jsx";
import disk from "./assets/audioTrack/disk.png";
import setMp3 from "./assets/audioTrack/takeone_set.mp3";
import event1Poster from './assets/incomingEvents/posterZoona-19-09-2025.mp4';
import event2Poster from './assets/zoona-03-05-2025/img4.jpg';

// ---------------------------
// Content Model
// ---------------------------
const event = {
    name: "TakeOne — Zoona Unstructured",
    start: "2025-09-19T19:30:00+02:00",
    end: "2025-09-19T01:00:00+02:00",
    city: "Bozen, IT",
    venue: "Zoona",
    address: "Via Vincenzo Lancia, 1, 39100 Bolzano BZ",
    heroImage:
    event1Poster,

};

const lineup = [
    {
        name: "Alan LaRocc",
        tier: "",
        genre: "",
        image:
        davidePiras,
        links: {instagram: "https://www.instagram.com/alan_la_rocc/"},
        bio: "Alan LaRocc is a DJ from South Tyrol and a producer under Rauh Nacht Records label. Renowned for his outstanding energy behind the decks, he knows how to ignite the crowd and, as closing time approaches, never fails to deliver an intense, physical dancefloor experience."
    },
    {
        name: "Young XTO",
        tier: "",
        genre: "",
        image:
        mattiaLorenzi,
        links: {instagram: "https://instagram.com/perestrojka__"},
        bio: "His sets carry a distinct house spirit, blending deep grooves with breakbeat energy. With acid-tinged rhythms and carefully selected vocals, he crafts warm, high-energy journeys where vintage house nostalgia merges seamlessly with modern rhythms"
    },
    {
        name: "Loned",
        tier: "",
        genre: "",
        image:
        lonedImage,
        links: {instagram: "https://www.instagram.com/lonednotloned/"},
        bio: "His sets never disappoint those in search of high-impact energy. Characterized by bouncy beats and refined mixing skills, Loned delivers powerful, dynamic experiences that flow seamlessly between techno and electro"
    }
];

const lineup2 = [
    {
        name: "Davide Piras",
        tier: "",
        genre: "",
        image:
        davidePiras,
        links: {instagram: "https://www.instagram.com/davidepirasmusic/"},
        bio: "Well-known DJ in the region, delivering high-energy sets that move between house and techno. As producer under the alter ego DJ Chupacapra, he has become a true local legend of the South Tyrolean underground scene"
    },
    {
        name: "Mattia Lorenzi",
        tier: "",
        genre: "",
        image:
        mattiaLorenzi,
        links: {instagram: "https://www.instagram.com/mattialrnz/"},
        bio: "With versatility at the core of his mixing, Mattia Lorenzi connects genres across the spectrum to craft energetic, immersive experiences. His digger’s spirit shines through in sets marked by distinctive and carefully curated selections"
    },
    {
        name: "Loned",
        tier: "",
        genre: "",
        image:
        lonedImage,
        links: {instagram: "https://www.instagram.com/lonednotloned/"},
        bio: "His sets never disappoint those in search of high-impact energy. Characterized by bouncy beats and refined mixing skills, Loned delivers powerful, dynamic experiences that flow seamlessly between techno and electro"
    },
    {
        name: "Young XTO",
        tier: "",
        genre: "",
        image:
            "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?auto=format&fit=crop&w=900&q=80",
        links: {instagram: "https://instagram.com/perestrojka__"},
        bio: "His sets carry a distinct house spirit, blending deep grooves with breakbeat energy. With acid-tinged rhythms and carefully selected vocals, he crafts warm, high-energy journeys where vintage house nostalgia merges seamlessly with modern rhythms"
    }
];

// Example second lineup (replace with real one if different)
const lineupAutumn = lineup2;

// Multiple incoming events (first reuses your existing event + lineup)
const upcomingEvents = [
    {
        ...event,
        lineup: lineup2,
        images: [event.heroImage]
    },
    // Second event removed - information moved to first event
];

const fmt = new Intl.DateTimeFormat("it-IT", {
    weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
});

function dateLabelFor(ev) {
    const s = new Date(ev.start), e = new Date(ev.end);
    const sameDay = s.toDateString() === e.toDateString();
    if (sameDay) {
        // Format with the day number
        const day = new Intl.DateTimeFormat("it-IT", {
            weekday: "short", 
            day: "2-digit",
            month: "short"
        }).format(s);
        const startTime = new Intl.DateTimeFormat("it-IT", {hour: "2-digit", minute: "2-digit"}).format(s);
        const endTime = new Intl.DateTimeFormat("it-IT", {hour: "2-digit", minute: "2-digit"}).format(e);
        return `${day} ${startTime}–${endTime}`;
    }
    return `${fmt.format(s).replace(",", "")} → ${fmt.format(e).replace(",", "")}`;
}

function timePeriodFor(ev) {
    const s = new Date(ev.start), e = new Date(ev.end);
    const startTime = new Intl.DateTimeFormat("it-IT", {hour: "2-digit", minute: "2-digit"}).format(s);
    const endTime = new Intl.DateTimeFormat("it-IT", {hour: "2-digit", minute: "2-digit"}).format(e);
    return `${startTime} - ${endTime}`;
}


const pastEvents = [
    {
        title: "TAKEONEXR-ROOM",
        date: "2025-09-12",
        city: "Bozen",
        venue: "Miro Club",
        poster: miro3Poster,
        recap: "",
        gallery: miro3Images
    },
    {
        title: "TAKEONEXZOONA",
        date: "2025-05-03",
        city: "Bozen",
        venue: "Zoona",
        poster: zoonaPoster,
        recap: "A packed night with local talent and a surprise sunrise set.",
        gallery: zoonaImages
    },
    {
        title: "TAKEONEXMIROCLUB",
        date: "2025-04-18",
        city: "Bozen",
        venue: "Miro Club",
        poster: miroPoster,
        recap: "",
        gallery: miroImages
    },
    {
        title: "TAKEONEXRONCOLO",
        date: "2025-03-22",
        city: "Bozen",
        venue: "Castel Roncolo",
        poster: ronPoster,
        recap: "",
        gallery: roncoloImages
    },

    {
        title: "TAKEONEXASTRA",
        date: "2025-01-17",
        city: "Brixen",
        venue: "Astra",
        poster: astraPoster,
        recap: "",
        gallery: []
    },
    {
        title: "TAKEONEXLAMPELE",
        date: "2024-11-15",
        city: "Bozen",
        venue: "Miro Club",
        poster: lampelePoster,
        recap: "",
        gallery: miro2Images
    },
    {
        title: "TAKEONEXZOONA",
        date: "2024-09-06",
        city: "Bozen",
        venue: "Zoona",
        poster: zoonaPoster2,
        recap: "",
        gallery: []
    },
    {
        title: "TAKEONEXGOETHE",
        date: "2024-05-15",
        city: "Bozen",
        venue: "Goethe Haus",
        poster: goethePoster,
        recap: "",
        gallery: goetheImages
    }
];

const faq = [
    {q: "What time do doors open?", a: "Doors open at 19:00. Music starts 19:30."},
    {q: "Is there an age restriction?", a: "18+. Please bring a valid photo ID."},
    {q: "Refund policy?", a: "Tickets are non-refundable unless the event is canceled."},
    {q: "Accessibility", a: "Ground-level access with accessible restrooms."}
];

// ---------------------------
// Utilities & Motion
// ---------------------------
const cx = (...xs) => xs.filter(Boolean).join(" ");
const formatDateRange = (startISO, endISO) => {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const fmt = new Intl.DateTimeFormat("en-GB", {day: "2-digit", month: "short"});
    const a = fmt.format(s), b = fmt.format(e);
    return a === b ? a : `${a} – ${b}`;
};

const fadeUp = {
    hidden: {opacity: 0, y: 18},
    show: {opacity: 1, y: 0, transition: {duration: 0.6, ease: "easeOut"}}
};
const stagger = {show: {transition: {staggerChildren: 0.08, delayChildren: 0.1}}};

// ---------------------------
// Components
// ---------------------------
function StickyNav({sections}) {
    const [active, setActive] = useState(sections[0]?.id ?? "home");
    const obs = useRef(null);

    useEffect(() => {
        const els = sections.map(s => document.getElementById(s.id)).filter(Boolean);
        obs.current?.disconnect();
        obs.current = new IntersectionObserver((entries) => {
            const v = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (v) setActive(v.target.id);
        }, {rootMargin: "-40% 0px -55% 0px", threshold: [0, .25, .5, .75, 1]});
        els.forEach(el => obs.current.observe(el));
        return () => obs.current?.disconnect();
    }, [sections]);

    const go = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
    };

    return (
        <div className="nav">
            <div className="container">
                <div className="nav__bar nav__bar--centered">
                    {/* Left: Brand */}
                    <a href="#home" onClick={go("home")} className="nav__brand">
                        <picture>
                            <source srcSet={`${BASE}img/logo1.webm`} type="video/webm"/>
                            <img src={`${BASE}img/logo.apng`} alt="TakeOne Logo"
                                 style={{height: "60px", width: "auto"}}/>
                        </picture>
                    </a>


                    {/* Center: Links */}
                    <nav className="nav__links">
                        {sections.map(s => (
                            <a
                                key={s.id}
                                href={"#" + s.id}
                                onClick={go(s.id)}
                                className={cx("nav__link", active === s.id && "nav__link--active")}
                            >
                                {s.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right: empty spacer to keep the center truly centered */}
                    <div aria-hidden="true"/>
                </div>
            </div>
        </div>
    );

}


function Section({id, title, children, subdued = false}) {
    return (
        <section id={id} className={cx("section", subdued && "section--subdued")}>
            <div className="container">
                {title && (
                    <motion.h2 className="section__title accent" variants={fadeUp} initial="hidden" whileInView="show"
                               viewport={{once: true}}>
                        {title}
                    </motion.h2>
                )}
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{once: true}}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
}

// Simple typewriter that types the last word, deletes it, and loops
function Typewriter({prefix = "TAKEONE IS ", words = [], typeMs = 80, deleteMs = 45, holdMs = 1200}) {
    const [i, setI] = React.useState(0);          // which word
    const [len, setLen] = React.useState(0);      // letters revealed
    const [phase, setPhase] = React.useState("typing"); // typing | holding | deleting

    const word = words[i % words.length];

    React.useEffect(() => {
        let t;
        if (phase === "typing") {
            if (len < word.length) {
                t = setTimeout(() => setLen(len + 1), typeMs);
            } else {
                setPhase("holding");
                t = setTimeout(() => setPhase("deleting"), holdMs);
            }
        } else if (phase === "deleting") {
            if (len > 0) {
                t = setTimeout(() => setLen(len - 1), deleteMs);
            } else {
                setI((i + 1) % words.length);
                setPhase("typing");
            }
        } else if (phase === "holding") {
            t = setTimeout(() => setPhase("deleting"), holdMs);
        }
        return () => clearTimeout(t);
    }, [phase, len, i, word, typeMs, deleteMs, holdMs, words.length]);

    return (
        <div className="typewriter" aria-live="polite" aria-atomic="true">
            <span className="typewriter__static">{prefix}</span>
            <span className="typewriter__word">{word.slice(0, len)}</span>
            <span className="typewriter__cursor" aria-hidden="true"/>
        </div>
    );
}


function HomeSection() {
    const BASE = import.meta.env.BASE_URL;
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const latestEvent = upcomingEvents[0]; // always take first upcoming event
    const dateStr = latestEvent ? dateLabelFor(latestEvent) : "";

    const items = [
        {id: "event", label: "Next Event", img: logo},
        {id: "about", label: "About", img: logo},
        {id: "past", label: "Archive", img: logo}
    ];

    const goTo = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
    };

    const openLatestEvent = () => {
        // Scroll to the incoming events section
        document.getElementById("event")?.scrollIntoView({behavior: "smooth"});
        // After a short delay, trigger the first event to open
        setTimeout(() => {
            const firstEventButton = document.querySelector('.incoming-item');
            if (firstEventButton) {
                firstEventButton.click();
            }
        }, 1000);
    };

    const toggleAudio = () => {
        const el = audioRef.current;
        if (!el) return;

        if (el.paused) {
            const duration = el.duration;
            if (!isNaN(duration) && duration > 0) {
                const start = duration * (0.15 + Math.random() * 0.7);
                el.currentTime = start;
            }
            el.play();
            setIsPlaying(true);
        } else {
            el.pause();
            setIsPlaying(false);
        }
    };

    return (
        <header
            id="home"
            className="hero"
            style={{
                textAlign: "center",
                position: "relative"
            }}
        >
            {/* Static background image instead of video
            <img
                src={`${BASE}/video/bg1.jpeg`}
                alt=""
                className="hero__bg"
                style={{ objectFit: "cover" }}
            />*/}

            <div className="hero__halo"/>
            <div className="hero__overlay"/>

            {/* NEW: Latest incoming event band - Full width */}
            {latestEvent && (
                <div className="latest-event-band" onClick={openLatestEvent} style={{cursor: 'pointer'}}>
                    <div className="latest-event-scroll">
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                        <span className="latest-event-title">{latestEvent.name}</span>
                        <span className="latest-event-meta">
                            {latestEvent.start ? new Date(latestEvent.start).toLocaleDateString("it-IT", {
                                weekday: "short", 
                                day: "2-digit",
                                month: "short"
                            }) : ""}
                        </span>
                        <span className="latest-event-time">{timePeriodFor(latestEvent)}</span>
                        <span className="latest-event-separator">•</span>
                    </div>
                </div>
            )}

            <div className="container hero__content">

                {/* Quote with deleting keyboard effect */}
                <div className="typewriter-line">
                    <span className="accent tw-brand">TAKEONE</span>
                    <Typewriter
                        prefix=" IS "
                        words={["A CONCEPT", "A TRIBUTE", "PEOPLE"]}
                        typeMs={80}
                        deleteMs={45}
                        holdMs={1100}
                    />
                </div>

                {/* Vertical logo stack */}
                <div className="home-logos">
                    {items.map((it) => (
                        <a
                            key={it.id}
                            href={`#${it.id}`}
                            onClick={goTo(it.id)}
                            className="logo-tile"
                            aria-label={it.label}
                        >
                            <img src={it.img} alt="" className="logo-tile__img"/>
                            <span className="logo-tile__label">{it.label}</span>
                        </a>
                    ))}

                </div>


                {/* Audio control */}
                <div className="hero__actions" style={{justifyContent: "center"}}>
                    <AudioTurntable
                        src={setMp3}
                        diskPng={disk}
                        size={220}
                        label="Play DJ set"
                    />
                    {/*
                    <audio
                        ref={audioRef}
                        preload="auto"
                        src={`${BASE}audio/takeone_set.mp3`}
                    />
                    <button
                        type="button"
                        className="btn btn--solid"
                        onClick={toggleAudio}
                    >
                        {isPlaying ? "Pause" : "Play"} Audio
                    </button>
                    */}
                </div>
            </div>
        </header>
    );
}


function PastEvents() {
    const [selected, setSelected] = useState(null);       // full event object
    const [activeIndex, setActiveIndex] = useState(null); // index in pastEvents

    const [galleryImages, setGalleryImages] = useState([]);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const [isPosterOpen, setIsPosterOpen] = useState(false);
    const [posterSrc, setPosterSrc] = useState(null);
    const openPoster = (src) => { setPosterSrc(src); setIsPosterOpen(true); };

    const sectionRef = useRef(null);
    const drawerRef  = useRef(null);
    const [drawerH, setDrawerH] = useState(0);            // measured drawer height

    const safeIndex = useMemo(() => {
        if (activeIndex == null || !Array.isArray(pastEvents) || !pastEvents.length) return null;
        return Math.min(Math.max(activeIndex, 0), pastEvents.length - 1);
    }, [activeIndex]);

    const activeEvent = safeIndex != null ? pastEvents[safeIndex] : null;
    const images = Array.isArray(activeEvent?.gallery) ? activeEvent.gallery : [];

    const fmtDate = (d) =>
        new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const openDetails = (ev, idx) => {
        setSelected(ev);
        setActiveIndex(idx);
        setGalleryImages(ev.gallery || []);
    };

    const closeLine = () => { setSelected(null); setActiveIndex(null); };
    
    // Prevent body scroll when drawer is open on mobile
    useEffect(() => {
        if (activeEvent && window.innerWidth <= 768) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
        
        return () => {
            document.body.classList.remove('drawer-open');
        };
    }, [activeEvent]);
    const prevEvent = () => {
        if (safeIndex == null || !pastEvents?.length) return;
        const idx = (safeIndex - 1 + pastEvents.length) % pastEvents.length;
        setActiveIndex(idx); setSelected(pastEvents[idx]);
    };
    const nextEvent = () => {
        if (safeIndex == null || !pastEvents?.length) return;
        const idx = (safeIndex + 1) % pastEvents.length;
        setActiveIndex(idx); setSelected(pastEvents[idx]);
    };

    // mini-gallery
    const [mainIndex, setMainIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    useEffect(() => setMainIndex(0), [activeEvent]);
    
    const prevImg = () => {
        if (images.length && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setMainIndex(i => (i - 1 + images.length) % images.length);
                setIsTransitioning(false);
            }, 150);
        }
    };
    
    const nextImg = () => {
        if (images.length && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setMainIndex(i => (i + 1) % images.length);
                setIsTransitioning(false);
            }, 150);
        }
    };

    // keyboard
    useEffect(() => {
        if (!activeEvent) return;
        const onKey = (e) => {
            if (e.key === "ArrowLeft") prevImg();
            if (e.key === "ArrowRight") nextImg();
            if (e.key === "Escape") closeLine();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeEvent, images.length]);

    // Measure drawer and reserve space in the section while open (like Incoming Events)
    useEffect(() => {
        const node = drawerRef.current;
        if (!node || !activeEvent) {
            setDrawerH(0);
            return;
        }
        const ro = new ResizeObserver(() => setDrawerH(node.offsetHeight || 0));
        ro.observe(node);
        setDrawerH(node.offsetHeight || 0);
        return () => ro.disconnect();
    }, [activeEvent]);

    return (
        <section
            ref={sectionRef}
            className={`past-events-section ${activeEvent ? "has-drawer-open" : ""}`}
            style={{ "--past-drawer-h": `${drawerH}px` }}
        >
            {/* Archive list (unchanged) */}
            <motion.div
                className="event-text-block past-events-block"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.div className="event-text-row" variants={fadeUp}>
                    <span className="event-text-flow">
                        {pastEvents.map((p, i) => {
                            const dateStr = fmtDate(p.date);
                            const isActive = i === safeIndex && selected;
                            return (
                                <span
                                    key={`${p.title}-${p.date}`}
                                    className={`event-row-link ${isActive ? "is-active" : ""}`}
                                    onClick={() => openDetails(p, i)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            openDetails(p, i);
                                        }
                                    }}
                                    aria-expanded={!!isActive}
                                    aria-controls="past-events-drawer"
                                >
                                    {dateStr} {p.city} {p.venue} · {p.title.toUpperCase()}
                                </span>
                            );
                        })}
                    </span>
                </motion.div>
            </motion.div>

            {/* Bottom drawer anchored to the section (not viewport) */}
            <div
                ref={drawerRef}
                id="past-events-drawer"
                className={`past-events-drawer ${activeEvent ? "open" : ""}`}
                aria-hidden={!activeEvent}
                aria-live="polite"
            >
                {activeEvent && (
                    <div className="drawer-inner" role="dialog" aria-label={`${activeEvent.title} details`}>
                        <div className="drawer-head">
                            <h3 className="drawer-title">{activeEvent.title}</h3>
                            <div className="drawer-controls" role="group" aria-label="Past event navigation">
                                <button className="icon-btn" onClick={prevEvent} type="button">‹ prev</button>
                                <button className="icon-btn" onClick={nextEvent} type="button">next ›</button>
                                <button className="icon-btn close" onClick={closeLine} type="button" title="Close">×</button>
                            </div>
                        </div>

                        {/* Main content area */}
                        <div className="drawer-body">
                            {/* LEFT — INFO */}
                            <div className="drawer-col">
                                <div className="event-facts">
                                    <div className="facts-row">
                                        <span className="facts-label">When</span>
                                        <span className="facts-val">{fmtDate(activeEvent.date)}</span>
                                    </div>
                                    <div className="facts-row">
                                        <span className="facts-label">Where</span>
                                        <span className="facts-val">
                      {activeEvent.city}{activeEvent.venue ? ` · ${activeEvent.venue}` : ""}
                    </span>
                                    </div>

                                    {activeEvent?.lineup?.length ? (
                                        <div className="lineup-block">
                                            <div className="lineup-label">LINEUP</div>
                                            <ul className="lineup-list">
                                                {activeEvent.lineup.map((dj, i) => (
                                                    <li key={i} className="drawer-dj lineup-name">{dj}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>

                                {activeEvent?.recap && <p className="drawer-desc">{activeEvent.recap}</p>}
                            </div>
                        </div>

                        {/* POSTER + GALLERY ROW (below information) */}
                        <div className="drawer-media-row">
                            {/* POSTER - Centered */}
                            <div className="drawer-poster">
                                {activeEvent.poster && (
                                    <button
                                        type="button"
                                        className="line-poster-btn"
                                        onClick={() => openPoster(activeEvent.poster)}
                                        aria-label="Open poster"
                                        title="Open poster"
                                    >
                                        <img src={activeEvent.poster} alt={activeEvent.title} />
                                    </button>
                                )}
                            </div>

                            {/* MINI GALLERY - Below poster */}
                            <div className="drawer-gallery">
                                {images.length ? (
                                    <div className="mini-gallery">
                                        <button className="mini-nav prev" onClick={prevImg} aria-label="Previous image" type="button">‹</button>
                                        <div className="mini-frame">
                                            <div className="gallery-preview-container">
                                                {/* Previous image preview */}
                                                <div className="gallery-preview gallery-preview-prev">
                                                    <img
                                                        src={images[(mainIndex - 1 + images.length) % images.length]}
                                                        alt="Previous"
                                                        loading="lazy"
                                                        className="gallery-preview-image"
                                                    />
                                                </div>
                                                
                                                {/* Current image */}
                                                <div className="gallery-main">
                                                    <img
                                                        src={images[mainIndex]}
                                                        alt={`Photo ${mainIndex + 1} of ${images.length}`}
                                                        loading="lazy"
                                                        className="gallery-main-image"
                                                        style={{ 
                                                            opacity: isTransitioning ? 0.5 : 1,
                                                            transition: 'opacity 0.3s ease-in-out'
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* Next image preview */}
                                                <div className="gallery-preview gallery-preview-next">
                                                    <img
                                                        src={images[(mainIndex + 1) % images.length]}
                                                        alt="Next"
                                                        loading="lazy"
                                                        className="gallery-preview-image"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button className="mini-nav next" onClick={nextImg} aria-label="Next image" type="button">›</button>
                                        
                                        {/* Dot indicators */}
                                        <div className="gallery-dots">
                                            {images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`gallery-dot ${index === mainIndex ? 'active' : ''}`}
                                                    onClick={() => setMainIndex(index)}
                                                    aria-label={`Go to image ${index + 1}`}
                                                    type="button"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mini-empty">No photos for this event.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Poster modal */}
            <Modal
                isOpen={isPosterOpen}
                onRequestClose={() => setIsPosterOpen(false)}
                className="poster-modal"
                overlayClassName="gallery-overlay"
                contentLabel="Event poster"
            >
                {posterSrc && <img className="poster-modal__img" src={posterSrc} alt="Event poster" />}
                <button className="close-btn" onClick={() => setIsPosterOpen(false)} aria-label="Close" title="Close">×</button>
            </Modal>

            {/* Full gallery modal */}
            <PopupGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
                startIndex={mainIndex}
            />
        </section>
    );
}






function Contact() {
    const [status, setStatus] = useState("idle");

    // Update these if needed
    const EMAIL_TO = "take.one@outlook.it";
    const INSTA_URL = "https://www.instagram.com/takeone.collective/";
    // WhatsApp in international format, no +, no spaces. Example: 393331234567
    const WHATSAPP_NUMBER = "https://chat.whatsapp.com/EWLF6rVxFi06d57XVu6B9s?fbclid=PAZXh0bgNhZW0CMTEAAadNkLzlh9muiCvk-XaaweiOC2lk566POsMmTrFFbd5c7q5vvpGWcaAVXCGgYw_aem_5RWcNYQMO_Cz6G_Hngmvxg";

    const onSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");

        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const {name, email, message} = data;

        // Mailto fallback: opens the visitor's email client with prefilled message
        const subject = encodeURIComponent(`Website contact from ${name || "Guest"}`);
        const body = encodeURIComponent(
            `${message}`
        );
        const mailto = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;

        try {
            window.location.href = mailto;
            setStatus("sent");
            form.reset();
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="grid grid--split">
            {/* Left: Form */}
            <form onSubmit={onSubmit} className="card" noValidate>
                <div className="card__body stack-4">
                    <div>
                        <label className="label" htmlFor="c-name">Name</label>
                        <input id="c-name" name="name" className="input" required/>
                    </div>
                    <div>
                        <label className="label" htmlFor="c-email">Email</label>
                        <input id="c-email" type="email" name="email" className="input" required/>
                    </div>
                    <div>
                        <label className="label" htmlFor="c-msg">Message</label>
                        <textarea id="c-msg" name="message" rows="5" className="textarea" required/>
                    </div>

                    <button
                        type="submit"
                        className="btn btn--ghost"
                        disabled={status === "sending"}
                        aria-busy={status === "sending"}
                    >
                        {status === "sending" ? "Opening email app…" : "Send"}
                    </button>

                    {status === "sent" && (
                        <p className="ok">Thanks! Your email app should have opened. If not, write us at {EMAIL_TO}.</p>
                    )}
                    {status === "error" && (
                        <p className="err">Couldn’t open your email app. Please email us at {EMAIL_TO}.</p>
                    )}
                </div>
            </form>


            {/* Right: Socials */}
            <div>
                <div className="card" style={{overflow: "hidden"}}>
                    <div className="card__body">
                        <h3 className="h3">Reach us directly</h3>

                        <div className="contact-socials">
                            <a
                                className="contact-social"
                                href={INSTA_URL}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Open Instagram profile @takeone.collective"
                            >
                                <svg className="contact-social__icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6ZM18 5.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"/>
                                </svg>
                                <span>@takeone.collective</span>
                            </a>

                            <a
                                className="contact-social"
                                href={WHATSAPP_NUMBER}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Start a WhatsApp chat"
                            >
                                <svg className="contact-social__icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M20.5 3.5A11 11 0 0 0 3.2 18.3L2 22l3.8-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 18a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-2.9.9.9-2.8-.2-.3A9.5 9.5 0 1 1 12 21.5Zm5-7.3c-.3-.2-1.7-.9-2-.9-.2 0-.4-.1-.6.2-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.5c-.8-.8-1.3-1.7-1.5-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.6-1.5-.8-2s-.4-.5-.6-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.1-1.3 0-.1-.2-.2-.4-.3Z"/>
                                </svg>
                                <span>WhatsApp</span>
                            </a>
                        </div>

                        <div className="mt-4 muted">
                            <p>Press & bookings: <a className="link" href={`mailto:${EMAIL_TO}`}>{EMAIL_TO}</a></p>
                            {/* Press Kit button removed as requested */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__bar">
                <div>© {new Date().getFullYear()} TakeOne. All rights reserved.</div>
                {/*<div className="row">
                    <a className="link" href="#">Impressum</a>
                    <a className="link" href="#">Privacy</a>
                    <a className="link" href="#">Cookies</a>
                </div>*/}
            </div>
        </footer>
    );
}

export default function App() {
    useEffect(() => {
        document.documentElement.style.scrollBehavior = "smooth";
        return () => {
            document.documentElement.style.scrollBehavior = "auto";
        };
    }, []);

    const sections = [
        {id: "home", label: "Home"},
        {id: "event", label: "Next Event"},
        {id: "about", label: "About"},
        {id: "past", label: "Archive"},
        {id: "contact", label: "Contact"}
    ];

    // NEW: use index so Prev/Next is trivial
    const [activeIndex, setActiveIndex] = useState(null);
    const activeDJ = (Number.isInteger(activeIndex) && lineup[activeIndex]) ? lineup[activeIndex] : null;

    const dockRef = useRef(null);
    useEffect(() => {
        if (activeDJ && dockRef.current) {
            dockRef.current.scrollIntoView({behavior: "smooth", block: "nearest"});
        }
    }, [activeDJ]);

    // Optional keyboard support (Esc to close, ←/→ to navigate)
    useEffect(() => {
        const onKey = (e) => {
            if (activeDJ == null) return;
            if (e.key === "Escape") setActiveIndex(null);
            if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % lineup.length);
            if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + lineup.length) % lineup.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeDJ]);

    const dateLabel = useMemo(() => formatDateRange(event.start, event.end).toUpperCase(), []);

    const igHref = (val) => {
        if (!val) return null;
        const handle = val.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "");
        return `https://instagram.com/${handle}`;
    };
    const igLabel = (val) => {
        if (!val) return null;
        const handle = val.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "");
        return `@${handle}`;
    };

    return (
        <main className="site">

            <div
                className="bg-fixed"
                aria-hidden="true"
                style={{backgroundImage: `url(${BASE}video/bg6.png)`}}
            />

            <StickyNav sections={sections}/>

            {/* 1 — Home */}
            <HomeSection/>

            {/* 2 — Incoming Events (list + bottom drawer) */}
            <Section id="event" title="Incoming Events" subdued>
                {(() => {
                    const [openIdx, setOpenIdx] = React.useState(null);      // which event is opened in the drawer
                    const [activeDJ, setActiveDJ] = React.useState(null);    // selected DJ object
                    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
                    const [galleryImages, setGalleryImages] = React.useState([]);

                    const sectionRef = React.useRef(null);
                    const drawerRef = React.useRef(null);
                    const [drawerH, setDrawerH] = React.useState(0);

                    const current = openIdx != null ? upcomingEvents[openIdx] : null;
                    const currentLineup = current?.lineup?.length ? current.lineup : lineup;

                    const prevEvent = () =>
                        setOpenIdx(i => (i == null ? 0 : (i - 1 + upcomingEvents.length) % upcomingEvents.length));
                    const nextEvent = () =>
                        setOpenIdx(i => (i == null ? 0 : (i + 1) % upcomingEvents.length));

                    // Reset selected DJ when switching/closing
                    React.useEffect(() => {
                        setActiveDJ(null);
                    }, [openIdx]);
                    
                    // Prevent body scroll when drawer is open on mobile
                    React.useEffect(() => {
                        if (openIdx != null && window.innerWidth <= 768) {
                            document.body.classList.add('drawer-open');
                        } else {
                            document.body.classList.remove('drawer-open');
                        }
                        
                        return () => {
                            document.body.classList.remove('drawer-open');
                        };
                    }, [openIdx]);

                    // Measure drawer height and reserve space in the section while open
                    React.useEffect(() => {
                        const node = drawerRef.current;
                        if (!node || openIdx == null) {
                            setDrawerH(0);
                            return;
                        }
                        const ro = new ResizeObserver(() => setDrawerH(node.offsetHeight || 0));
                        ro.observe(node);
                        // initial measure
                        setDrawerH(node.offsetHeight || 0);
                        return () => ro.disconnect();
                    }, [openIdx]);

                    const openGallery = (imgs) => {
                        const arr = (imgs && imgs.length) ? imgs.slice() : (current?.images || []);
                        if ((!arr || !arr.length) && current?.heroImage) arr.push(current.heroImage);
                        setGalleryImages(arr || []);
                        setIsGalleryOpen(true);
                    };

                    return (
                        <div
                            className={`incoming-events ${openIdx != null ? "has-drawer-open" : ""}`}
                            ref={sectionRef}
                            style={{"--drawer-h": `${drawerH}px`}}
                        >
                            {/* List of incoming events */}
                            <ul className="incoming-list" role="list">
                                {upcomingEvents.map((ev, i) => (
                                    <li key={`${ev.name}-${ev.start}`} className="incoming-list__item">
                                        <button
                                            type="button"
                                            className={`incoming-item ${openIdx === i ? "is-active" : ""}`}
                                            onClick={() => setOpenIdx(i)}
                                            aria-expanded={openIdx === i}
                                            aria-controls={`drawer-${i}`}
                                        >
                                            <span className="incoming-item__name">{ev.name}</span>
                                            <span className="incoming-item__meta">
                  {dateLabelFor(ev)} • {ev.city} · {ev.venue}
                </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Bottom drawer anchored to the section (not viewport) */}
                            <div
                                ref={drawerRef}
                                id={`drawer-${openIdx ?? "none"}`}
                                className={`incoming-drawer ${current ? "open" : ""}`}
                                aria-live="polite"
                            >
                                {current ? (
                                    <div className="drawer-inner">
                                        <div className="drawer-head">
                                            <h3 className="drawer-title">{current.name}</h3>
                                            <div className="drawer-controls" role="group" aria-label="Event navigation">
                                                <button className="icon-btn close" onClick={() => setOpenIdx(null)}
                                                        type="button" title="Close">×
                                                </button>
                                            </div>
                                        </div>

                                        <div className="drawer-body">
                                            {/* Left: event facts + lineup */}
                                            <div className="drawer-col">
                                                <div className="event-facts">
                                                    <div className="facts-row">
                                                        <span className="facts-label">When</span>
                                                        <span className="facts-val">{dateLabelFor(current)}</span>
                                                    </div>
                                                    <div className="facts-row">
                                                        <span className="facts-label">Where</span>
                                                        <span
                                                            className="facts-val">{current.city} · {current.venue}</span>
                                                    </div>
                                                    {current.address && (
                                                        <div className="facts-row">
                                                            <span className="facts-label">Address</span>
                                                            <span className="facts-val">{current.address}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`dj-dock ${activeDJ ? "open" : ""}`}>
                                                    <div className="lineup-block">
                                                        <div className="lineup-label">LINEUP</div>
                                                        <div className="lineup-list">
                                                            {currentLineup.map((a, idx) => (
                                                                <button
                                                                    key={`${a.name}-${idx}`}
                                                                    className={`lineup-name ${activeDJ?.name === a.name ? "is-active" : ""}`}
                                                                    type="button"
                                                                    onClick={() => setActiveDJ(a)}
                                                                    title={`Read about ${a.name}`}
                                                                >
                                                                    {a.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Selected DJ info */}
                                                    {activeDJ ? (
                                                        <>
                                                            <div className="dj-row">
                                                                <h4 className="dj-name">{activeDJ.name}</h4>
                                                                {activeDJ.links?.instagram && (
                                                                    <a className="dj-ig"
                                                                       href={activeDJ.links.instagram}
                                                                       target="_blank" rel="noreferrer">
                                                                        @ Instagram
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {(activeDJ.bio || activeDJ.description) && (
                                                                <p className="dj-desc">{activeDJ.bio || activeDJ.description}</p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="dj-placeholder">Select an artist to see
                                                            info.</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: media (hero + mini gallery) */}
                                            <div className="drawer-col media">
                                                <div className="media-hero">
                                                    {current.heroImage && <img src={current.heroImage} alt=""/>}
                                                    <div className="media-actions">
                                                        {current.mapUrl && (
                                                            <a className="icon-btn" href={current.mapUrl}
                                                               target="_blank" rel="noreferrer">Map</a>
                                                        )}
                                                        {current.trailerUrl && (
                                                            <a className="icon-btn" href={current.trailerUrl}
                                                               target="_blank" rel="noreferrer">Trailer</a>
                                                        )}
                                                    </div>
                                                </div>

                                                {current.images?.length > 1 && (
                                                    <div className="media-thumbs">
                                                        {current.images.slice(0, 6).map((src, i) => (
                                                            <button key={`thumb-${i}`} className="thumb"
                                                                    onClick={() => openGallery(current.images)}
                                                                    type="button" title="Open gallery">
                                                                <img src={src} alt="" loading="lazy"/>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                                }
                            </div>

                            {/* Simple built-in lightbox (replace with your PopupGallery if you prefer) */}
                            <PopupGallery
                                images={galleryImages}
                                isOpen={isGalleryOpen}
                                onClose={() => setIsGalleryOpen(false)}
                            />
                        </div>
                    );
                })()}
            </Section>


            {/* 3 — About */}
            <Section id="about" title="About TakeOne">
                <div className="about__logo-wrap">
                    <img src={`${BASE}img/TakeOne.jpg`} alt="TakeOne logo"/>
                </div>
                <div className="about__text">
                    <p><strong>TakeOne</strong>, a symbiosis. MUSIC | ART | PERFORMANCE</p>
                    <p>
                        A space of possibilities unfolds. Here to stay.
                        Through the many facets of electronic music, lose yourself between dance, installation, and
                        being.
                        Imagine the future—and everything is good.
                        TakeOne—what are we waiting for
                    </p>
                </div>
            </Section>

            {/* 4 — Archive */}
            <Section id="past" title="Archive
            ">
                <PastEvents/>
            </Section>

            {/* 5 — Contact */}
            <Section id="contact" title="Contact / Press" subdued>
                <Contact/>
            </Section>

            <Footer/>
        </main>
    );
}