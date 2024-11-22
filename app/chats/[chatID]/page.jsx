"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import styles from './ChatPage.module.css';
import { useSocket } from "../../../hooks/useSocket";

const ChatPage = () => {
    const { socket, isConnected } = useSocket();
    const pathname = usePathname();
    const chatID = pathname ? pathname.split("/")[2] : null;

    const { user, isLoading, error } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(chatID);

    useEffect(() => {
        if (chatID && socket && isConnected) {
            console.log(`Attempting to join chat room: ${chatID}`);

            // Unirse a la sala del chat específico
            socket.emit("joinChat", chatID);
            console.log(`Joined room: ${chatID}`);

            // Obtener mensajes existentes desde el backend
            const fetchMessages = async () => {
                try {
                    console.log("Fetching messages...");
                    const response = await fetch(`http://localhost:5001/chats/${chatID}/messages`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch messages. Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setMessages(data.messages);
                    setFetchError('');
                    console.log("Fetched messages successfully");
                } catch (err) {
                    setFetchError(err.message);
                    console.error("Error fetching messages:", err.message);
                } finally {
                    setLoadingMessages(false);
                    console.log("Loading messages state updated");
                }
            };

            fetchMessages();

            // Escuchar nuevos mensajes desde el socket
            const handleNewMessage = (message) => {
                if (message.chatID === chatID) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                    console.log("Mensaje recibido:", message);
                }
            };

            socket.on("sendMessage", handleNewMessage);

            // Limpiar la conexión al desmontar el componente
            return () => {
                socket.emit("leaveChat", chatID);
                socket.off("sendMessage", handleNewMessage);
                console.log(`Left room: ${chatID}`);
            };
        } else {
            console.log("ChatID or socket is not defined, cannot join chat");
        }
    }, [chatID, socket, isConnected]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "" || !user?.sub || !chatID) {
            console.warn("No message content or user/chat information is missing.");
            return;
        }

        const messageData = {
            chatID,
            senderID: user.sub,
            content: newMessage,
            senderNickname: user.nickname,
            senderPicture: user.picture,
            creation: new Date().toISOString(),
        };

        try {
            // Enviar el mensaje al backend para almacenarlo en la base de datos
            console.log("Sending message to backend...");
            const response = await fetch(`http://localhost:5001/chats/${chatID}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: user.sub,
                    content: newMessage,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to send message. Status: ${response.status}`);
            }

            console.log("Message successfully sent to backend");

            // Emitir el mensaje a través del socket para actualizaciones en tiempo real
            if (socket && isConnected) {
                socket.emit("sendMessage", messageData);
                console.log("Mensaje emitido a través del socket");
            } else {
                console.error("Socket no está definido o no está conectado");
            }

            setNewMessage("");
        } catch (err) {
            console.error('Error sending message:', err.message);
        }
    };

    const handleChatClick = (chatID) => {
        setSelectedChat(chatID);
        setMessages([]);
        setLoadingMessages(true);

        // Unirse al nuevo chat
        if (socket && isConnected) {
            socket.emit("joinChat", chatID);
            console.log(`Joined room: ${chatID}`);
        } else {
            console.error("Socket no está conectado");
        }

        // Obtener los mensajes del nuevo chat
        const fetchMessages = async () => {
            try {
                console.log("Fetching messages for new chat...");
                const response = await fetch(`http://localhost:5001/chats/${chatID}/messages`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch messages. Status: ${response.status}`);
                }
                const data = await response.json();
                setMessages(data.messages);
                setFetchError('');
                console.log("Fetched messages successfully for new chat");
            } catch (err) {
                setFetchError(err.message);
                console.error("Error fetching messages:", err.message);
            } finally {
                setLoadingMessages(false);
                console.log("Loading messages state updated for new chat");
            }
        };

        fetchMessages();
    };

    // Manejo del estado de carga y errores
    if (isLoading || loadingMessages) {
        return <Loading />;
    }

    if (error || fetchError) {
        return <ErrorMessage message={error ? error.message : fetchError} />;
    }

    if (!user) {
        return <div>Please log in to view the chat.</div>;
    }

    return (
        <div className={styles.chatPageContainer}>
            {/* Barra lateral con los chats */}
            <div className={styles.sidebar}>
                <h3>Chats</h3>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div
                            key={chat.chatID}
                            className={`${styles.chatItem} ${selectedChat === chat.chatID ? styles.selectedChat : ""}`}
                            onClick={() => handleChatClick(chat.chatID)}
                        >
                            <img src={chat.picture} alt={`${chat.nickname}'s avatar`} className={styles.avatar} />
                            <p>{chat.nickname}</p>
                        </div>
                    ))
                ) : (
                    <p>No chats available.</p>
                )}
            </div>

            {/* Mensajes del chat seleccionado */}
            <div className={styles.chatContent}>
                {selectedChat ? (
                    <>
                        <div className={styles.messagesContainer}>
                            {messages.length > 0 ? (
                                messages.map((message, index) => {
                                    let messageDate = new Date(message.creation);
                                    messageDate.setHours(messageDate.getHours() - 3);

                                    return (
                                        <div key={index} className={message.senderID === user.sub ? styles.myMessage : styles.otherMessage}>
                                            <div className={styles.miniInfo}>
                                                <img src={message.senderPicture} alt={`${message.senderNickname}'s avatar`} className={styles.avatar} />
                                                <div>
                                                    <p className={styles.nickname}>{message.senderNickname}</p>
                                                </div>
                                            </div>
                                                <p className={styles.content}>{message.content}</p>
                                                <p className={styles.timestamp}>{messageDate.toLocaleTimeString("en-US", { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No messages yet.</p>
                            )}
                        </div>

                        <div className={styles.inputContainer}>
                            <input
                                className={styles.input}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write a message..."
                            />
                            <button className={styles.sendButton} onClick={handleSendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className={styles.noChatSelected}>No chat selected</div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
