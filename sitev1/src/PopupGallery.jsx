// PopupGallery.jsx
import React, { useEffect, useMemo } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

export default function PopupGallery({ isOpen, onClose, images = [] }) {
    const hasImages = images && images.length > 0;
    const [current, setCurrent] = React.useState(0);

    // reset index when opening or images change
    useEffect(() => {
        if (isOpen) setCurrent(0);
    }, [isOpen, images]);

    const next = () => hasImages && setCurrent(c => (c + 1) % images.length);
    const prev = () => hasImages && setCurrent(c => (c - 1 + images.length) % images.length);

    // keyboard support
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft")  prev();
            if (e.key === "Escape")     onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, next, prev, onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="gallery-modal"
            overlayClassName="gallery-overlay"
            contentLabel="Event gallery"
        >
            {hasImages && (
                <>
                    <button className="gallery-arrow gallery-arrow--prev" onClick={prev} aria-label="Previous">‹</button>
                    <img src={images[current]} alt={`Slide ${current + 1} of ${images.length}`} />
                    <button className="gallery-arrow gallery-arrow--next" onClick={next} aria-label="Next">›</button>
                </>
            )}
            <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </Modal>
    );
}
