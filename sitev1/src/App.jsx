import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Standard HTML + CSS + React (no Tailwind)
 * Clean, colorful event site with smooth scroll-reveals.
 * Edit the content objects (event, lineup, etc.) to customize.
 */

// App.jsx
const BASE = import.meta.env.BASE_URL; // add once near the top



// ---------------------------
// Content Model
// ---------------------------
const event = {
    name: "TakeOne — Late Summer Session",
    start: "2025-09-14T19:00:00+02:00",
    end: "2025-09-15T03:00:00+02:00",
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
        name: "DJ Aurora",
        tier: "headliner",
        genre: "Melodic Techno",
        image:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
        links: { instagram: "https://instagram.com/" }
    },
    {
        name: "Lucas Venus",
        tier: "support",
        genre: "House",
        image:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
        links: { instagram: "https://instagram.com/" }
    },
    {
        name: "Cartado",
        tier: "support",
        genre: "Tech House",
        image:
            "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?auto=format&fit=crop&w=900&q=80",
        links: { instagram: "https://instagram.com/" }
    }
];

const team = [
    {
        name: "Lorenzo Giani",
        role: "Founder & Curator",
        image:
            `${BASE}img/Giani.jpg`,
        bio: "Programming events in Alto Adige. Focus on curation and partnerships."
    },
    {
        name: "Daniele Dapra",
        role: "Production Lead",
        image:
            `${BASE}img/Dani.jpg`,
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
        title: "TakeOne: Spring Opening",
        date: "2025-04-12",
        city: "Bolzano",
        venue: "Keller Club",
        poster:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
        recap: "A packed night with local talent and a surprise sunrise set.",
        galleryUrl: "#"
    },
    {
        title: "TakeOne: Winter Warmup",
        date: "2024-12-02",
        city: "Brunico",
        venue: "Depot Hall",
        poster:
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        recap: "Cozy lights, big sound, full house.",
        galleryUrl: "#"
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
    const [active, setActive] = useState(sections[0]?.id ?? "event");
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

    const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

    return (
        <div className="nav">
            <div className="container">
                <div className="nav__bar">
                    <a href="#event" onClick={go("event")} className="nav__brand"><img
                        src={`${BASE}img/TakeOne.jpg`}
                        alt="TakeOne Logo"
                        style={{ height: "60px", width: "auto" }}
                    /></a>
                    <nav className="nav__links">
                        {sections.map(s => (
                            <a key={s.id} href={"#"+s.id} onClick={go(s.id)}
                               className={cx("nav__link", active===s.id && "nav__link--active")}>
                                {s.label}
                            </a>
                        ))}
                    </nav>
                    <a className="btn btn--ghost" href={event.ticketsUrl} target="_blank" rel="noreferrer">Get Tickets</a>
                </div>
            </div>
        </div>
    );
}

function Section({ id, title, children, subdued=false }) {
    return (
        <section id={id} className={cx("section", subdued && "section--subdued")}>
            <div className="container">
                <motion.h2 className="section__title accent" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }}>
                    {title}
                </motion.h2>
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
}

function Hero() {
    const date = useMemo(() => formatDateRange(event.start, event.end), []);
    return (
        <header id="event" className="hero">
            <img className="hero__bg" src={event.heroImage} alt="Hero" />
            <div className="hero__halo" />
            <div className="hero__overlay" />
            <div className="container hero__content">
                <motion.h1 className="hero__title accent" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
                    {event.name}
                </motion.h1>
                <motion.p className="hero__meta" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25}}>
                    {date} · {event.city} · {event.venue}
                </motion.p>
                <motion.div className="hero__actions" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.35}}>
                    <a className="btn btn--solid" href={event.ticketsUrl} target="_blank" rel="noreferrer">Get Tickets</a>
                    <a className="btn btn--outline" href="#lineup">See Lineup</a>
                </motion.div>
                <motion.div className="media aspect-video" initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}>
                    <iframe
                        src={event.trailerUrl}
                        title="Event trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </motion.div>
            </div>
        </header>
    );
}

function Card({children}) {
    return <div className="card">{children}</div>;
}

function ArtistCard({ a }) {
    return (
        <motion.div className="card group" variants={fadeUp}>
            <div className="ratio ratio--4x3">
                <img src={a.image} alt={a.name} className="zoom" />
            </div>
            <div className="card__body">
                <div className="eyebrow">{a.tier}</div>
                <h3 className="card__title">{a.name}</h3>
                <p className="muted">{a.genre}</p>
                {a.links.instagram && <a className="link mt-2 inline" href={a.links.instagram} target="_blank">Instagram</a>}
            </div>
        </motion.div>
    );
}

function LineupGrid() {
    const headliners = lineup.filter(l => l.tier==="headliner");
    const others = lineup.filter(l => l.tier!=="headliner");
    return (
        <div className="stack-10">
            {headliners.length>0 && (
                <div>
                    <h3 className="h3 mb-4">Headliners</h3>
                    <motion.div className="grid grid--cards" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}>
                        {headliners.map(a => <ArtistCard key={a.name} a={a} />)}
                    </motion.div>
                </div>
            )}
            {others.length>0 && (
                <div>
                    <h3 className="h3 mb-4">Lineup</h3>
                    <motion.div className="grid grid--cards" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}>
                        {others.map(a => <ArtistCard key={a.name} a={a} />)}
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function TeamGrid() {
    return (
        <motion.div className="grid grid--cards" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}>
            {team.map(m => (
                <motion.div key={m.name} className="card" variants={fadeUp}>
                    <div className="ratio ratio--4x3"><img src={m.image} alt={m.name} className="zoom" /></div>
                    <div className="card__body">
                        <h3 className="card__title">{m.name}</h3>
                        <div className="muted">{m.role}</div>
                        <p className="mt-2">{m.bio}</p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

function ResidentsGrid() {
    return (
        <motion.div className="grid grid--cards" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}>
            {residents.map(r => (
                <motion.div key={r.name} className="card" variants={fadeUp}>
                    <div className="ratio ratio--4x3"><img src={r.image} alt={r.name} className="zoom" /></div>
                    <div className="card__body">
                        <h3 className="card__title">{r.name}</h3>
                        <div className="muted">{r.style}</div>
                        {r.links.mix && <a className="link mt-2 inline" href={r.links.mix} target="_blank">Featured mix</a>}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

function PastEvents() {
    return (
        <motion.div className="grid grid--cards" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}>
            {pastEvents.map(p => (
                <motion.div key={p.title} className="card" variants={fadeUp}>
                    <div className="ratio ratio--4x5"><img src={p.poster} alt={p.title} className="zoom" /></div>
                    <div className="card__body">
                        <div className="muted">
                            {new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <h3 className="card__title">{p.title}</h3>
                        <div className="muted">{p.city} · {p.venue}</div>
                        <p className="mt-2">{p.recap}</p>
                        {p.galleryUrl && <a className="link mt-2 inline" href={p.galleryUrl}>View gallery</a>}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

function Disclosure({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="disclosure">
            <button className="disclosure__btn" onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
                <span>{q}</span><span className="disclosure__icon">{open ? "–" : "+"}</span>
            </button>
            {open && <div className="disclosure__panel">{a}</div>}
        </div>
    );
}

function FAQ() {
    return (
        <div className="card card--divide">
            {faq.map((f, i) => (
                <Disclosure
                    key={i}
                    q={f.q}
                    a={f.a}
                    className="faq-question"
                />
            ))}
        </div>
    );
}

function Info() {
    return (
        <div className="grid grid--split">
            <div className="stack-4">
                <div>
                    <h3 className="h3">When & Where</h3>
                    <p>{formatDateRange(event.start, event.end)} · {event.venue}, {event.address}, {event.city}</p>
                </div>
                <div>
                    <h3 className="h3">How to get there</h3>
                    <ul className="list">
                        <li>10 min by bus from Bolzano/Bozen train station.</li>
                        <li>Bus lines 3, 8, 110 stop nearby (Vincenzo Lancia).</li>
                        <li>Free and paid parking available around the venue.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="h3">House rules</h3>
                    <ul className="list">
                        <li>No outside drinks. Professional cameras require approval.</li>
                        <li>18+ event. Bring valid ID.</li>
                        <li>Respect others; no harassment or discrimination tolerated.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="h3">Accessibility</h3>
                    <p>The event takes place outdoors in a disclosed factory area.
                        Ground-floor venue with step-free access. Accessible restroom available.</p>
                </div>
                <div>
                    <h3 className="h3">Partners</h3>
                    <div className="row muted">Your partner logos here</div>
                </div>
            </div>
            <div className="media aspect-video">
                <iframe src={event.mapUrl} loading="lazy" title="Map" referrerPolicy="no-referrer-when-downgrade" />
            </div>
        </div>
    );
}

function Contact() {
    const [status, setStatus] = useState("idle");
    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const form = e.currentTarget;
            const data = Object.fromEntries(new FormData(form).entries());
            await new Promise(r => setTimeout(r, 800)); // simulate
            console.log("Contact form submitted", data);
            setStatus("sent");
            form.reset();
        } catch {
            setStatus("error");
        }
    };
    return (
        <div className="grid grid--split">
            <form onSubmit={onSubmit} className="stack-4">
                <div>
                    <label className="label">Name</label>
                    <input name="name" required className="input" />
                </div>
                <div>
                    <label className="label">Email</label>
                    <input type="email" name="email" required className="input" />
                </div>
                <div>
                    <label className="label">Message</label>
                    <textarea name="message" rows="5" required className="textarea"></textarea>
                </div>
                <button type="submit" className="btn btn--ghost" disabled={status==="sending"}>
                    {status==="sending" ? "Sending…" : "Send"}
                </button>
                {status==="sent" && <p className="ok">Thanks, we will get back to you.</p>}
                {status==="error" && <p className="err">Something went wrong. Try again.</p>}
            </form>
            <div className="muted">
                <p>Press & bookings: <a className="link" href="mailto:take.one@outlook.it">take.one@outlook.it</a></p>
                <p className="mt-2">Follow us: <a href={"https://www.instagram.com/takeonebozen/"}>Instagram</a></p>
                <a href="#" className="btn btn--outline mt-4">Download Press Kit</a>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__bar">
                <div>© {new Date().getFullYear()} TakeOne. All rights reserved.</div>
                <div className="row">
                    <a className="link" href="#">Impressum</a>
                    <a className="link" href="#">Privacy</a>
                    <a className="link" href="#">Cookies</a>
                </div>
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
        { id: "event", label: "Event" },
        { id: "lineup", label: "Lineup" },
        { id: "about", label: "About" },
        { id: "residents", label: "Residents" },
        { id: "past", label: "Past" },
        { id: "info", label: "Info" },
        { id: "faq", label: "FAQ" },
        { id: "contact", label: "Contact" }
    ];

    return (
        <main className="site">
            <StickyNav sections={sections} />
            <Hero />
            <Section id="lineup" title="Lineup" subdued><LineupGrid /></Section>
            <Section id="about" title="About TakeOne">
                <div className="grid grid--aside">
                    <div className="stack-4">
                        <p>
                            <strong>TakeOne</strong> is a creative collective from Alto Adige founded by
                            <strong> Daniele Daprà</strong> and <strong>Lorenzo Giani</strong>, both students of
                            the Free University of Bozen-Bolzano (unibz). Passionate about music, community,
                            and unique cultural experiences, they bring together local and international talent.
                        </p>
                        <p>
                            For this event, TakeOne will bring their signature high-energy DJ sets to
                            <strong> Zoona</strong> in Bolzano — transforming the venue into a vibrant dance floor.
                            Their focus on distinctive curation, warm sound, and immersive production ensures
                            each night is memorable.
                        </p>
                    </div>
                    <div className="card">
                        <img src={`${BASE}img/TakeOne.jpg`} alt="About" />
                    </div>
                </div>
                <div className="mt-8"><TeamGrid /></div>
            </Section>
            <Section id="residents" title="Resident DJs" subdued><ResidentsGrid /></Section>
            <Section id="past" title="Past Events"><PastEvents /></Section>
            <Section id="info" title="Info & Logistics" subdued><Info /></Section>
            <Section id="faq" title="FAQ"><FAQ /></Section>
            <Section id="contact" title="Contact / Press" subdued><Contact /></Section>
            <Footer />
        </main>
    );
}
