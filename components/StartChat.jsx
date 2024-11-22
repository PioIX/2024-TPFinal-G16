"use client";

import React, { useState } from 'react';
import styles from './StartChat.module.css'; // Archivo de estilos
import { useRouter } from 'next/navigation';

const StartChat = ({ userID }) => {
    const router = useRouter(); // Hook para redirigir al usuario
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

            // Redirigir al nuevo chat usando el ID del chat recién creado
            if (data.chat && data.chat.chatID) {
                router.push(`/chats/${data.chat.chatID}`);
            }
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div className={styles.startChat}>
            <h3>Inicia un Chat</h3>
            <input
                type="text"
                placeholder="Ingresa el nombre del usuario..."
                value={nickname}
                onChange={handleChange}
                className={styles.input}
            />
            <button onClick={handleStartChat} className={styles.button}>
                Iniciar chat
            </button>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default StartChat;
