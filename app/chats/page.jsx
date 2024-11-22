"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import StartChat from '../../components/StartChat'; // Componente para iniciar nuevos chats
import styles from './ChatList.module.css';
import Link from 'next/link';

const ChatsPage = () => {
    const { user, isLoading, error } = useUser(); // Información del usuario
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [fetchError, setFetchError] = useState('');

    // Obtener todos los chats del usuario autenticado
    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.sub) {
                return; // No hacer nada si no hay usuario autenticado
            }

            try {
                const response = await fetch(`http://localhost:5001/user/${user.sub}/chats`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user chats. Status: ${response.status}`);
                }
                const data = await response.json();
                setChats(data.chats);
                setFetchError('');
            } catch (err) {
                setFetchError(err.message);
            } finally {
                setLoadingChats(false);
            }
        };

        fetchChats();
    }, [user?.sub]);

    // Mostrar estado de carga
    if (isLoading || loadingChats) {
        return <Loading />;
    }

    // Mostrar errores
    if (error || fetchError) {
        return <ErrorMessage message={error ? error.message : fetchError} />;
    }

    // Mostrar mensaje si no hay usuario autenticado
    if (!user) {
        return <div>Please log in to view your chats.</div>;
    }

    return (
        <div className={styles.chatsPage}>
            <h2>Your Chats</h2>
            
            {/* Componente para iniciar un nuevo chat */}
            <StartChat userID={user.sub} />

            {/* Lista de chats existentes */}
            <div className={styles.chatsList}>
                {chats.length > 0 ? (
                    chats.map((chat) => {
                        let chatDate = new Date(chat.creation);
                        chatDate.setHours(chatDate.getHours() - 3);
                        
                        return (<Link key={chat.chatID} href={`/chats/${chat.chatID}`}>
                        <div className={styles.chatItem}>
                            <div className={styles.chatInfo}>
                                <img src={chat.picture} alt={`${chat.givenName}'s avatar`} className={styles.avatar} />
                                <div>
                                    <p className={styles.nickname}>{chat.nickname}</p>
                                </div>
                            </div>
                            <p className={styles.timestamp}>{chatDate.toLocaleTimeString("en-US", { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                        </div>
                        </Link>)
})
                ) : (
                    <p>No chats available.</p>
                )}
            </div>
        </div>
    );
};

export default ChatsPage;
