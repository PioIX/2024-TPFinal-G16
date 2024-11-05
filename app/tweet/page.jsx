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
        // Lógica para el botón "Para ti"
    }

    function handleSiguiendoClick() {
        // Lógica para el botón "Siguiendo"
    }

    // Manejo de carga
    if (isLoading) {
        return <Loading />; // Componente de carga
    }

    // Manejo de errores
    if (error) {
        return <ErrorMessage message={error.message} />; // Componente para mostrar errores
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
        </div>
    );
};

export default TweetPage;
