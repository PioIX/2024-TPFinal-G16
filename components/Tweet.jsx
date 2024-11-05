import React from "react";
import styles from "./Tweet.module.css";
import UserProfile from "./UserProfile";
import Media from "./Media";
import Interactions from "./Interactions";

const Tweet = ({ user, userHandle, content, media }) => {
    return (
        <div className={styles.tweet}>
            <UserProfile user={user} userHandle={userHandle} />
            <p>{content}</p>
            {media && <Media media={media} />}
            <div className={styles.InteractionSpace}>
                <Interactions />
            </div>
            <span>5 min · 25 de octubre de 2024</span>
        </div>
    );
};

export default Tweet;
