import React, { useState } from 'react';
import styles from './Input.module.css';

export default function Input({ placeholder }) {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className={styles.contenedor} style={{background: 'aqua'}}>
            <input
                className={styles.Input}
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder} // Utiliza el placeholder
            />
            <button className={styles.postButton}>
            Postear
            </button>
        </div>
    );
}
    
