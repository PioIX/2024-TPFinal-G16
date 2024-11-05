"use client";

import React from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Feed from "../../components/Feed";
import TitleButton from "../../components/TitleButton";
import styles from "./page.module.css";

const TweetPage = () => {
    const { user, isLoading, error } = useUser();

    function handleParaTiClick() {
        // Logic for "Para ti" button
    }

    function handleSiguiendoClick() {
        // Logic for "Siguiendo" button
    }

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
            <Feed user={user} />
            {/* Removed Comment component as it's handled in Feed */}
        </div>
    );
};

export default TweetPage;
    