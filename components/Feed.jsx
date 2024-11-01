import React from "react";
import styles from "./Feed.module.css";
import Tweet from "./Tweet";

const Feed = ({ user }) => {
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
        <div className={styles.feed}>
            <Tweet {...tweetData} />
            <Tweet {...tweetData} />
            <Tweet {...tweetData} />
        </div>
    );
};

export default Feed;
