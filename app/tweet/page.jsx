"use client";

import React from "react";
import Tweet from "../../components/Tweet"; // Asegúrate de ajustar la ruta según tu estructura de archivos
import styles from "./page.module.css";

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Feed from "../../components/Feed";
import TitleButton from "../../components/TitleButton"

const TweetPage = () => {
    const { user, isLoading } = useUser();
    console.log(user);

    return (
        <div className={styles.tweetPage}>
            <div className={styles.header}>
                <div className={styles.tweetTitles}>
                    <TitleButton/><h1>Para ti</h1>
                </div>
                <div className={styles.tweetTitles}>
                    <TitleButton/><h1>Siguiendo</h1> {/* Encabezado agregado al lado */}
                </div>
            </div>
            <Feed user={user} />
        </div>
    );
};

export default withPageAuthRequired(TweetPage, {
    onRedirecting: () => <Loading />,
    onError: (error) => <ErrorMessage>{error.message}</ErrorMessage>,
});
