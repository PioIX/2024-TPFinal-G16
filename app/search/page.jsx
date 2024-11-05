"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import InputSearch from "../../components/InputSearch"; // Asegúrate de que la ruta sea correcta

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    // Función que simula la búsqueda, por ejemplo, consulta la API de Twitter
    const handleSearch = async (searchQuery) => {
        setLoading(true);
        setQuery(searchQuery); // Guarda la consulta actual

        // Aquí iría la lógica real para obtener resultados de búsqueda, por ejemplo, llamando a la API de Twitter.
        setTimeout(() => {
            // Simulando resultados para mostrar en la búsqueda
            const simulatedResults = [
                { id: 1, text: `Resultado de búsqueda para "${searchQuery}"` },
                { id: 2, text: `Otro resultado de búsqueda para "${searchQuery}"` },
                { id: 3, text: `Más resultados de búsqueda relacionados con "${searchQuery}"` }
            ];

            setResults(simulatedResults);
            setLoading(false);
        }, 1000); // Simula un retraso de 1 segundo
    };

    return (
        <div className={styles.SearchPage}>
            <div className={styles.searchContainer}>
                <InputSearch onSearch={handleSearch} />
            </div>

            <div className={styles.resultsContainer}>
                {loading && <p>Cargando resultados...</p>}
                {!loading && results.length === 0 && query && <p>No se encontraron resultados para "{query}".</p>}
                {!loading && results.length > 0 && (
                    <div>
                        {results.map(result => (
                            <div key={result.id} className={styles.resultItem}>
                                <p>{result.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;

