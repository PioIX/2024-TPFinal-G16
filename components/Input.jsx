import React, { useState } from 'react';
import styles from './Input.module.css'; // Asegúrate de que la ruta del estilo sea correcta

export default function Input({ text }) {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <input
                className={styles.Input}
                value={inputValue}
                onChange={handleChange}
            />
            <p>{text}</p>
            <p>Valor ingresado: {inputValue}</p>
        </div>
    );
}
