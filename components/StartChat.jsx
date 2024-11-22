"use client";

import React, { useState } from 'react';
import styles from './StartChat.module.css'; // Archivo de estilos

const StartChat = ({ userID }) => {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setNickname(event.target.value);
    };

    const handleStartChat = async () => {
        if (nickname.trim() === '') {
            setError('Nickname is required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderID: userID,  // El ID del usuario actual
                    receiverNickname: nickname,  // El nickname del destinatario
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create chat');
            }

            setMessage('Chat created successfully!');
            setError('');
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div className={styles.startChat}>
            <h3>Empiece un nuevo chat</h3>
            <input
                type="text"
                placeholder="Ingrese el usuario"
                value={nickname}
                onChange={handleChange}
                className={styles.input}
            />
            <button onClick={handleStartChat} className={styles.button}>
                Crear chat
            </button>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default StartChat;
