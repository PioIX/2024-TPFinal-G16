import React from "react";
import styles from "./Tweet.module.css";
import UserProfile from "./UserProfile";
import Media from "./Media";
import Interactions from "./Interactions";
import Input from "./Input";

const Tweet = ({ user, userHandle, content, media }) => {
    return (
        <div className={styles.tweet}>
            <div className={styles.InfoTweet}>
                <UserProfile user={user} userHandle={userHandle} />
                <span>5 min · 25 de octubre de 2024</span>
            </div>
            <p>{content}</p>
            {media && <Media media={media} />}
            <div className={styles.InteractionSpace}>
                <Interactions />
            </div>
            <Input></Input>
        </div>
    );
};

export default Tweet;
