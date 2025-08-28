import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import PopupGallery from "./PopupGallery.jsx";
// place near PopupGallery import
import Modal from "react-modal";

/**
 * Standard HTML + CSS + React (no Tailwind)
 * Clean, colorful event site with smooth scroll-reveals.
 * Edit the content objects (event, lineup, etc.) to customize.
 */

// App.jsx
const BASE = import.meta.env.BASE_URL; // used for public assets (e.g., /public/img/*)

const zoonaImages = Object.values(
    import.meta.glob('./assets/zoona-03-05-2025/*.{jpg,png}', { eager: true, as: 'url' })
);
const miroImages = Object.values(
    import.meta.glob('./assets/miro-18-04-2025/*.{jpg,png}', { eager: true, as: 'url' })
);
const roncoloImages = Object.values(
    import.meta.glob('./assets/roncolo-22-03-2025/*.{jpg,png}', { eager: true, as: 'url' })
);

const miro2Images = Object.values(
    import.meta.glob('./assets/miro-15-11-2024/*.{jpg,png}', { eager: true, as: 'url' })
);

const goetheImages = Object.values(
    import.meta.glob('./assets/goetheHaus-15-05-2024/*.{jpg,png}', { eager: true, as: 'url' })
);



import zoonaPoster from './assets/logos/posterZoona.png';
import miroPoster  from './assets/logos/posterMiro.png';
import ronPoster   from './assets/logos/posterRoncolo.png';
import lampelePoster   from './assets/logos/posterLampele.png';
import zoonaPoster2 from './assets/logos/posterZoona2.jpeg';
import goethePoster from './assets/logos/posterGoethe.jpeg';
import astraPoster from './assets/logos/posterAstra.jpg';

import logo from './assets/logos/logo2.png';
import lonedImage from './assets/miro-18-04-2025/img1.jpg';
import davidePiras from './assets/artists/davidePiras.jpg';
import mattiaLorenzi from './assets/artists/mattiaLorenzi.jpg';
import AudioTurntable from "./AudioTurntable.jsx";
import disk from "./assets/audioTrack/disk.png";
import setMp3 from "./assets/audioTrack/takeone_set2.mp3";

// ---------------------------
// Content Model
// ---------------------------
const event = {
    name: "TakeOne — Late Summer Session",
    start: "2025-09-19T19:00:00+02:00",
    end: "2025-09-19T03:00:00+02:00",
    city: "Bolzano, IT",
    venue: "Zoona",
    address: "Via Vincenzo Lancia, 1, 39100 Bolzano BZ",
    heroImage:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80",
    trailerUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.153762303145!2d11.334562576423357!3d46.4846976647741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47829d002823f305%3A0xff0eca8c3ab8535c!2sZoona!5e1!3m2!1sit!2sit!4v1754982232360!5m2!1sit!2sit",
    ticketsUrl: "#tickets"
};

const lineup = [
    {
        name: "Davide Piras",
        tier: "",
        genre: "",
        image:
            davidePiras,
        links: { instagram: "https://www.instagram.com/davidepirasmusic/" },
        bio:"Well-known DJ in the region, delivering high-energy sets that move between house and techno. As producer under the alter ego DJ Chupacapra, he has become a true local legend of the South Tyrolean underground scene"
    },
    {
        name: "Mattia Lorenzi",
        tier: "",
        genre: "",
        image:
           mattiaLorenzi,
        links: { instagram: "https://www.instagram.com/mattialrnz/" },
        bio:"With versatility at the core of his mixing, Mattia Lorenzi connects genres across the spectrum to craft energetic, immersive experiences. His digger’s spirit shines through in sets marked by distinctive and carefully curated selections"
    },
    {
        name: "Loned",
        tier: "",
        genre: "",
        image:
            lonedImage,
        links: { instagram: "https://www.instagram.com/lonednotloned/" },
        bio:"His sets never disappoint those in search of high-impact energy. Characterized by bouncy beats and refined mixing skills, Loned delivers powerful, dynamic experiences that flow seamlessly between techno and electro"
    },
    {
        name: "XTO",
        tier: "",
        genre: "",
        image:
            "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?auto=format&fit=crop&w=900&q=80",
        links: { instagram: "https://instagram.com/" },
        bio:"His sets carry a distinct house spirit, blending deep grooves with breakbeat energy. With acid-tinged rhythms and carefully selected vocals, he crafts warm, high-energy journeys where vintage house nostalgia merges seamlessly with modern rhythms"
    }
];

const team = [
    {
        name: "Lorenzo Giani",
        role: "Founder & Curator",
        image: `${BASE}img/Giani.jpg`,
        bio: "Programming events in Alto Adige. Focus on curation and partnerships."
    },
    {
        name: "Daniele Dapra",
        role: "Production Lead",
        image: `${BASE}img/Dani.jpg`,
        bio: "Logistics, vendors, backstage flow."
    }
];

const residents = [
    {
        name: "TakeOne Crew",
        style: "House / Indie Dance",
        image:
            "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&w=800&q=80",
        links: { mix: "https://soundcloud.com/" }
    }
];

const pastEvents = [
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
        venue: "Mirò Club",
        poster: miroPoster,
        recap: "Gonfio",
        gallery: miroImages
    },
    {
        title: "TAKEONEXRONCOLO",
        date: "2025-03-22",
        city: "Bozen",
        venue: "Castel Roncolo",
        poster: ronPoster,
        recap: "Gonfio",
        gallery: roncoloImages
    },

    {
        title: "TAKEONEXASTRA",
        date: "2025-01-17",
        city: "Brixen",
        venue: "Astra",
        poster: astraPoster,
        recap: "Gonfio",
        gallery: []
    },
    {
        title: "TAKEONEXLAMPELE",
        date: "2024-11-15",
        city: "Bozen",
        venue: "Mirò Club",
        poster: lampelePoster,
        recap: "Gonfio",
        gallery: miro2Images
    },
    {
        title: "TAKEONEXZOONA",
        date: "2024-09-06",
        city: "Bozen",
        venue: "Zoona",
        poster: zoonaPoster2,
        recap: "Gonfio",
        gallery: []
    },
    {
        title: "TAKEONEXGOETHE",
        date: "2024-05-15",
        city: "Bozen",
        venue: "Goethe Haus",
        poster: goethePoster,
        recap: "Gonfio",
        gallery: goetheImages
    }
];

const faq = [
    { q: "What time do doors open?", a: "Doors open at 19:00. Music starts 19:30." },
    { q: "Is there an age restriction?", a: "18+. Please bring a valid photo ID." },
    { q: "Refund policy?", a: "Tickets are non-refundable unless the event is canceled." },
    { q: "Accessibility", a: "Ground-level access with accessible restrooms." }
];

// ---------------------------
// Utilities & Motion
// ---------------------------
const cx = (...xs) => xs.filter(Boolean).join(" ");
const formatDateRange = (startISO, endISO) => {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const fmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" });
    const a = fmt.format(s), b = fmt.format(e);
    return a === b ? a : `${a} – ${b}`;
};

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

// ---------------------------
// Components
// ---------------------------
function StickyNav({ sections }) {
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
        }, { rootMargin: "-40% 0px -55% 0px", threshold: [0, .25, .5, .75, 1] });
        els.forEach(el => obs.current.observe(el));
        return () => obs.current?.disconnect();
    }, [sections]);

    const go = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="nav">
            <div className="container">
                <div className="nav__bar nav__bar--centered">
                    {/* Left: Brand */}
                    <a href="#home" onClick={go("home")} className="nav__brand">
                        <picture>
                            <source srcSet={`${BASE}img/logo1.webm`} type="video/webm" />
                            <img src={`${BASE}img/logo.apng`} alt="TakeOne Logo" style={{ height: "50px", width: "auto" }} />
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
                    <div aria-hidden="true" />
                </div>
            </div>
        </div>
    );

}


function Section({ id, title, children, subdued=false }) {
    return (
        <section id={id} className={cx("section", subdued && "section--subdued")}>
            <div className="container">
                {title && (
                    <motion.h2 className="section__title accent" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }}>
                        {title}
                    </motion.h2>
                )}
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
}

// Simple typewriter that types the last word, deletes it, and loops
function Typewriter({ prefix = "TakeOne is ", words = [], typeMs = 80, deleteMs = 45, holdMs = 1200 }) {
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
            <span className="typewriter__cursor" aria-hidden="true" />
        </div>
    );
}


function HomeSection() {
    const BASE = import.meta.env.BASE_URL;
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const items = [
        { id: "event", label: "Next Event", img: logo },
        { id: "about", label: "About", img: logo },
        { id: "past",  label: "Archive", img: logo }
    ];

    const goTo = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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

            <div className="hero__halo" />
            <div className="hero__overlay" />

            <div className="container hero__content">

                {/* Quote with deleting keyboard effect */}
                <div className="typewriter-line">
                    <span className="accent tw-brand">TakeOne</span>
                    <Typewriter
                        prefix=" is "
                        words={["a concept", "a Tribute", "People"]}
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
                            <img src={it.img} alt="" className="logo-tile__img" />
                            <span className="logo-tile__label">{it.label}</span>
                        </a>
                    ))}

                </div>



                {/* Audio control */}
                <div className="hero__actions" style={{ justifyContent: "center" }}>
                    <AudioTurntable
                        src={setMp3}
                        diskPng={disk}
                        size={160}
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

    // Poster modal (uniform size)
    const [isPosterOpen, setIsPosterOpen] = useState(false);
    const [posterSrc, setPosterSrc] = useState(null);
    const openPoster = (src) => { setPosterSrc(src); setIsPosterOpen(true); };

    const sectionRef = useRef(null);

    const safeIndex = useMemo(() => {
        if (activeIndex == null || !Array.isArray(pastEvents) || !pastEvents.length) return null;
        return Math.min(Math.max(activeIndex, 0), pastEvents.length - 1);
    }, [activeIndex]);

    const activeEvent = safeIndex != null ? pastEvents[safeIndex] : null;

    const openDetails = (ev, idx) => {
        setSelected(ev);
        setActiveIndex(idx);
    };

    const openGallery = (images) => {
        setGalleryImages(images || []);
        setIsGalleryOpen(true);
    };

    const closeLine = () => {
        setSelected(null);
        setActiveIndex(null);
    };

    const prevEvent = () => {
        if (safeIndex == null || !pastEvents?.length) return;
        const idx = (safeIndex - 1 + pastEvents.length) % pastEvents.length;
        setActiveIndex(idx);
        setSelected(pastEvents[idx]);
    };

    const nextEvent = () => {
        if (safeIndex == null || !pastEvents?.length) return;
        const idx = (safeIndex + 1) % pastEvents.length;
        setActiveIndex(idx);
        setSelected(pastEvents[idx]);
    };

    const fmtDate = (d) =>
        new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <section ref={sectionRef} className="past-events-section">
            {/* Archive list */}
            <motion.div
                className="event-text-block past-events-block"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {pastEvents.map((p, i) => {
                    const dateStr = fmtDate(p.date);
                    const isActive = i === safeIndex && selected;
                    return (
                        <motion.div key={`${p.title}-${p.date}`} className="event-text-row" variants={fadeUp}>
                            <button
                                type="button"
                                className={`event-row-link ${isActive ? "is-active" : ""}`}
                                onClick={() => openDetails(p, i)}
                                aria-label={`Open details for ${p.title} on ${dateStr} at ${p.venue}, ${p.city}`}
                                aria-expanded={!!isActive}
                                aria-controls="past-events-line"
                            >
                                <span className="event-part event-part--date">{dateStr}</span>
                                <span className="event-part event-part--place">{p.city} {p.venue} ·</span>
                                <span className="event-part event-part--title">{p.title.toUpperCase()}</span>
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Bottom “line” inside section (like DJs) */}
            <div
                id="past-events-line"
                className={["past-events-line", activeEvent ? "open" : ""].join(" ")}
                aria-hidden={!activeEvent}
            >
                {activeEvent && (
                    <div className="line-inner" role="dialog" aria-label={`${activeEvent.title} details`}>
                        {/* Left: poster (click to open fixed-size modal) */}
                        <div className="line-left">
                            <button
                                type="button"
                                className="line-poster-btn"
                                onClick={() => openPoster(activeEvent.poster)}
                                aria-label="Open poster"
                                title="Open poster"
                            >
                                <div className="line-poster">
                                    <img src={activeEvent.poster} alt={activeEvent.title} />
                                </div>
                            </button>
                        </div>

                        {/* Middle: info (title, place, date) */}
                        <div className="line-meta">
                            <div className="line-title truncate">{activeEvent.title}</div>
                            <div className="line-sub">
                                <span>{activeEvent.city}</span>
                                {activeEvent.venue ? <><span className="dot">•</span><span>{activeEvent.venue}</span></> : null}
                                <span className="dot">•</span>
                                <span>{fmtDate(activeEvent.date)}</span>
                            </div>
                        </div>

                        {/* Right: actions */}
                        <div className="line-right">
                            {activeEvent.gallery?.length > 0 && (
                                <button
                                    type="button"
                                    className="line-btn"
                                    onClick={() => openGallery(activeEvent.gallery)}
                                >
                                    View gallery
                                </button>
                            )}

                            <div className="line-nav">
                                <button
                                    type="button"
                                    className="line-iconbtn"
                                    onClick={prevEvent}
                                    aria-label="Previous event"
                                    disabled={pastEvents.length <= 1}
                                    title="Previous"
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    className="line-iconbtn"
                                    onClick={nextEvent}
                                    aria-label="Next event"
                                    disabled={pastEvents.length <= 1}
                                    title="Next"
                                >
                                    ›
                                </button>
                            </div>

                            <button
                                type="button"
                                className="line-close"
                                aria-label="Close"
                                onClick={closeLine}
                                title="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Poster modal (fixed-size window) */}
            <Modal
                isOpen={isPosterOpen}
                onRequestClose={() => setIsPosterOpen(false)}
                className="poster-modal"
                overlayClassName="gallery-overlay"
                contentLabel="Event poster"
            >
                {posterSrc && <img className="poster-modal__img" src={posterSrc} alt="Event poster" />}
                <button
                    className="close-btn"
                    onClick={() => setIsPosterOpen(false)}
                    aria-label="Close"
                    title="Close"
                >
                    ×
                </button>
            </Modal>

            {/* Gallery modal */}
            <PopupGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
            />
        </section>
    );
}



function Contact() {
    const [status, setStatus] = useState("idle");

    // Update these if needed
    const EMAIL_TO = "take.one@outlook.it";
    const INSTA_URL = "https://www.instagram.com/takeonebozen/";
    // WhatsApp in international format, no +, no spaces. Example: 393331234567
    const WHATSAPP_NUMBER = "https://chat.whatsapp.com/EWLF6rVxFi06d57XVu6B9s?fbclid=PAZXh0bgNhZW0CMTEAAadNkLzlh9muiCvk-XaaweiOC2lk566POsMmTrFFbd5c7q5vvpGWcaAVXCGgYw_aem_5RWcNYQMO_Cz6G_Hngmvxg";

    const onSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");

        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const { name, email, message } = data;

        // Mailto fallback: opens the visitor’s email client with prefilled message
        const subject = encodeURIComponent(`Website contact from ${name || "Guest"}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
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
                        <input id="c-name" name="name" className="input" required />
                    </div>
                    <div>
                        <label className="label" htmlFor="c-email">Email</label>
                        <input id="c-email" type="email" name="email" className="input" required />
                    </div>
                    <div>
                        <label className="label" htmlFor="c-msg">Message</label>
                        <textarea id="c-msg" name="message" rows="5" className="textarea" required />
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
                <div className="card" style={{ overflow: "hidden" }}>
                    <div className="card__body">
                        <h3 className="h3">Reach us directly</h3>

                        <div className="contact-socials">
                            <a
                                className="contact-social"
                                href={INSTA_URL}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Open Instagram profile @takeonebozen"
                            >
                                <svg className="contact-social__icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6ZM18 5.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"/>
                                </svg>
                                <span>@takeonebozen</span>
                            </a>

                            <a
                                className="contact-social"
                                href={WHATSAPP_NUMBER}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Start a WhatsApp chat"
                            >
                                <svg className="contact-social__icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.5 3.5A11 11 0 0 0 3.2 18.3L2 22l3.8-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 18a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-2.9.9.9-2.8-.2-.3A9.5 9.5 0 1 1 12 21.5Zm5-7.3c-.3-.2-1.7-.9-2-.9-.2 0-.4-.1-.6.2-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.5c-.8-.8-1.3-1.7-1.5-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.6-1.5-.8-2s-.4-.5-.6-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.1-1.3 0-.1-.2-.2-.4-.3Z"/>
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
        return () => { document.documentElement.style.scrollBehavior = "auto"; };
    }, []);

    const sections = [
        { id: "home",   label: "Home" },
        { id: "event",  label: "Next Event" },
        { id: "about",  label: "About" },
        { id: "past",   label: "Archive" },
        { id: "contact",label: "Contact" }
    ];

    // NEW: use index so Prev/Next is trivial
    const [activeIndex, setActiveIndex] = useState(null);
    const activeDJ = (Number.isInteger(activeIndex) && lineup[activeIndex]) ? lineup[activeIndex] : null;

    const dockRef = useRef(null);
    useEffect(() => {
        if (activeDJ && dockRef.current) {
            dockRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
                style={{ backgroundImage: `url(${BASE}video/bg6.png)` }}
            />

            <StickyNav sections={sections} />

            {/* 1 — Home */}
            <HomeSection />

            {/* 2 — Next Event */}
            <Section id="event" title="Next Event" subdued>
                <div className="event-text-block">
                    <div className="event-text-row">
                        <span className="event-series">TAKEONE</span>
                        <span className="event-date">{dateLabel}</span>
                    </div>

                    <div className="event-text-row">
                        <span className="event-venue">{event.city} · {event.venue}</span>
                    </div>

                    <div className="event-text-row">
                        <span className="event-lineup-label">LINEUP:</span>
                        {lineup.map((a, i) => (
                            <button
                                key={a.name}
                                className={`event-name ${activeDJ?.name === a.name ? "is-active" : ""}`}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                            >
                                {a.name.toUpperCase()}{i < lineup.length - 1 ? "," : ""}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info dock with Prev / Next / Close */}
                <div ref={dockRef} className={`dj-info-dock ${activeDJ ? "open" : ""}`} aria-live="polite">
                    {activeDJ ? (
                        <div className="dj-info-inner">
                            <div className="dj-info-row">
                                <h3 className="dj-info-name">{activeDJ.name}</h3>

                                {activeDJ.links?.instagram && (
                                    <a
                                        className="dj-info-ig"
                                        href={igHref(activeDJ.links.instagram)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {igLabel(activeDJ.links.instagram)}
                                    </a>
                                )}

                                {/* Controls */}
                                <div className="dock-controls" role="group" aria-label="Lineup navigation">
                                    <button
                                        className="icon-btn"
                                        onClick={() => setActiveIndex(i => (i - 1 + lineup.length) % lineup.length)}
                                        aria-label="Previous artist"
                                        type="button"
                                    >
                                        ‹ Prev
                                    </button>
                                    <button
                                        className="icon-btn"
                                        onClick={() => setActiveIndex(i => (i + 1) % lineup.length)}
                                        aria-label="Next artist"
                                        type="button"
                                    >
                                        Next ›
                                    </button>
                                    <button
                                        className="icon-btn close"
                                        onClick={() => setActiveIndex(null)}
                                        aria-label="Close"
                                        type="button"
                                        title="Close"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {(activeDJ.bio || activeDJ.description) && (
                                <p className="dj-info-desc">
                                    {activeDJ.bio || activeDJ.description}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="dj-info-placeholder">Select an artist to see info.</div>
                    )}
                </div>
            </Section>

            {/* 3 — About */}
            <Section id="about" title="About TakeOne">
                <div className="about__logo-wrap">
                    <img src={`${BASE}img/TakeOne.jpg`} alt="TakeOne logo" />
                </div>
                <div className="about__text">
                    <p><strong>TakeOne</strong>, a symbiosis. MUSIC | ART | PERFORMANCE</p>
                    <p>
                        A space of possibilities unfolds. Here to stay.
                        Through the many facets of electronic music, lose yourself between dance, installation, and being.
                        Imagine the future—and everything is good.
                        TakeOne—what are we waiting for
                    </p>
                </div>
            </Section>

            {/* 4 — Archive */}
            <Section id="past" title="Archive">
                <PastEvents />
            </Section>

            {/* 5 — Contact */}
            <Section id="contact" title="Contact / Press" subdued>
                <Contact />
            </Section>

            <Footer />
        </main>
    );
}
