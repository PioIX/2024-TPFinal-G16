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
    function handleParaTiClick(){
        
    }
    function handleSiguiendoClick(){

    }

    return (
        <div className={styles.tweetPage}>
            <div className={styles.header}>
            <div>
                <TitleButton text="Para ti" onClick={handleParaTiClick} />
                <TitleButton text="Siguiendo" onClick={handleSiguiendoClick} />
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
