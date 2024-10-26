"use client"

import React from "react";
import Tweet from "../../components/Tweet"; // Asegúrate de ajustar la ruta según tu estructura de archivos
import styles from "./page.module.css"

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const TweetPage = () => {
    // Aquí podrías obtener el tweet desde una API o un estado global
    // Para el ejemplo, vamos a usar datos simulados
    const { user, isLoading } = useUser();
    console.log(user)
    const tweetData = {
        id: 1,
        user: {
            name: user.name,
            avatar: user.picture,
        },
        userHandle: "juanperez",
        content: "Este es un tweet de ejemplo. ¡Saludos a todos!",
        media: [
            { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlP43bXvIFTB5XmGqCJq9keyTQAmeZ0XZnTQ&s" },
            { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlP43bXvIFTB5XmGqCJq9keyTQAmeZ0XZnTQ&s" },
        ],
        likesAmount: 23,
        retweetsAmount: 10,
        commentsAmount: 5,
        savesAmount: 3,
        time: "5 min",
        date: "25 de octubre de 2024",
        isLiked: false,
        isRetweeted: false,
    };

    return (
        <div className={styles.tweetPage}>
            <h1>Tweet Detalle</h1>
            <Tweet {...tweetData} />
        </div>
    );
};

export default withPageAuthRequired(TweetPage, {
    onRedirecting: () => <Loading />,
    onError: (error) => <ErrorMessage>{error.message}</ErrorMessage>,
  });
