

import React, { useState } from 'react';
import styles from './InputSearch.module.css'; 

export default function InputSearch({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSearch(inputValue); // Llama la función de búsqueda con el valor del input
        }
    };

    return (
        <div>
            <input
                className={styles.Input}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar..."
            />
        </div>
    );
}

