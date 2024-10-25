import React from "react";
import Tweet from "../../components/Tweet"; // Asegúrate de ajustar la ruta según tu estructura de archivos

const TweetPage = () => {
    // Aquí podrías obtener el tweet desde una API o un estado global
    // Para el ejemplo, vamos a usar datos simulados
    const tweetData = {
        id: 1,
        user: {
            name: "Juan Pérez",
            avatar: "https://example.com/avatar.jpg",
        },
        userHandle: "juanperez",
        content: "Este es un tweet de ejemplo. ¡Saludos a todos!",
        media: [
            { url: "https://example.com/image1.jpg" },
            { url: "https://example.com/image2.jpg" },
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

export default TweetPage;
