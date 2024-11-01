import React, { useState } from "react";
import styles from "./Media.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Media = ({ media }) => {
    const [fullscreenImage, setFullscreenImage] = useState(null);

    const openFullscreen = (url) => {
        setFullscreenImage(url);
    };

    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    const gridClass =
        media.length === 2
            ? styles.mediaTwoImages
            : media.length >= 3
            ? styles.mediaThreeOrFourImages
            : "";

    return (
        <div className={`${styles.media} ${gridClass}`}>
            {media.map((item, index) => (
                <img
                    key={index}
                    src={item.url}
                    alt={`Media item ${index}`}
                    onClick={() => openFullscreen(item.url)}
                />
            ))}
            {fullscreenImage && (
                <div className={styles.fullscreenOverlay} onClick={closeFullscreen}>
                    <div className={styles.fullscreenImageContainer}>
                        <img
                            src={fullscreenImage}
                            alt="Fullscreen media"
                            className={styles.fullscreenImage}
                        />
                        <button className={styles.closeButton} onClick={closeFullscreen}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;