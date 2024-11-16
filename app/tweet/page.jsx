"use client";

import React from "react";
import { useState } from "react"
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Feed from "../../components/Feed";
import TitleButton from "../../components/TitleButton";
import styles from "./page.module.css";
import Input from "../../components/Input";
import PostButton from "../../components/PostButton";

const TweetPage = () => {
    const { user, isLoading, error } = useUser();
    const [tweets, setTweets] = useState([]);
    const [newTweetContent, setNewTweetContent] = useState("");

    const handlePostTweet = () => {
        if (newTweetContent.trim() !== "") {
            const newTweet = {
                id: tweets.length + 1,
                user,
                userHandle: user?.nickname || "Usuario",
                content: newTweetContent,
                media: null, // Por ahora sin imágenes
            };
            setTweets([newTweet, ...tweets]);
            setNewTweetContent(""); // Limpiar el campo de input
        }
    };
    function handleParaTiClick() {
        // Logic for "Para ti" button
    }

    function handleSiguiendoClick() {
        // Logic for "Siguiendo" button
    }
    const handleInputChange = (value) => {
        setNewTweetContent(value);
    };

    // Handling loading state
    if (isLoading) {
        return <Loading />; // Loading component
    }

    // Handling error state
    if (error) {
        return <ErrorMessage message={error.message} />; // Error component
    }

    return (

        <div className={styles.tweetPage}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <TitleButton text="Para ti" onClick={handleParaTiClick} />
                    <TitleButton text="Siguiendo" onClick={handleSiguiendoClick} />
                    <hr className={styles.Hr}></hr>
                </div>
            </div>
            
            <div className={styles.inputContainer}>
                <Input 
                placeholder ="¿Qué está pasando?"
                value = {newTweetContent} 
                onChange= {handleInputChange}/>
                <PostButton onClick={handlePostTweet} />
            </div>
            
            <Feed user={user} />
            
        </div>
    );
};

export default TweetPage;
    