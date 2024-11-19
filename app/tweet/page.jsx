"use client";

import React, { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Feed from "../../components/Feed";
import TitleButton from "../../components/TitleButton";
import styles from "./page.module.css";

const TweetPage = () => {
    const { user, isLoading, error } = useUser();
    const [tweets, setTweets] = useState([]);
    const [loadingTweets, setLoadingTweets] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [newTweetContent, setNewTweetContent] = useState("");

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await fetch('http://localhost:5001/tweets');
                if (!response.ok) {
                    throw new Error('Error fetching tweets');
                }
                const data = await response.json();
                setTweets(data.tweets);
            } catch (err) {
                setFetchError(err.message);
            } finally {
                setLoadingTweets(false);
            }
        };

        fetchTweets();
    }, []);

    const handlePostTweet = async () => {
        console.log(newTweetContent)
        if (newTweetContent.trim() !== "") {
            try {
                const response = await fetch('http://localhost:5001/tweet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sub: user?.sub, // Aquí usamos el sub del usuario autenticado
                        content: newTweetContent,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create tweet');
                }

                const newTweet = {
                    id: tweets.length + 1,
                    user,
                    userHandle: user?.nickname || "Usuario",
                    content: newTweetContent,
                    media: null, // Por ahora sin imágenes
                };
                setTweets([newTweet, ...tweets]);
                setNewTweetContent(""); // Limpiar el campo de input
            } catch (err) {
                console.error(err.message);
            }
        }
    };

    const handleNewTweetChange = (event) => {
        console.log("entre")
        setNewTweetContent(event.target.value)
    }

    // Handling loading state for user authentication
    if (isLoading) {
        return <Loading />; // Loading component
    }

    // Handling error state for user authentication
    if (error) {
        return <ErrorMessage message={error.message} />; // Error component
    }

    // Handling loading state for tweets
    if (loadingTweets) {
        return <div>Loading tweets...</div>;
    }

    // Handling error state for tweets fetching
    if (fetchError) {
        return <div>Error: {fetchError}</div>;
    }

    return (
        <div className={styles.tweetPage}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <TitleButton text="Para ti" onClick={() => {}} />
                    <TitleButton text="Siguiendo" onClick={() => {}} />
                    <hr className={styles.Hr}></hr>
                </div>
            </div>

            <div className={styles.inputContainer}>
                <input className={styles.Input} placeholder="¿Qué está pasando?" onChange={handleNewTweetChange} />
                <button className={styles.postButton} onClick={handlePostTweet}>
                    Postear
                </button>
            </div>

            <Feed tweets={tweets} />
        </div>
    );
};

export default TweetPage;
