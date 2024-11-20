"use client"

import React from "react";
import styles from "./Tweet.module.css";
import UserProfile from "./UserProfile";
import Media from "./Media";
import Interactions from "./Interactions";
import Input from "./Input";
import Comment from "./Comment";

const Tweet = ({ id, user, userHandle, content, media, likesCount, retweetsCount, commentsCount, savesCount, isLiked, isSaved, isRetweeted }) => {
    return (
        <div className={styles.tweet}>
            <div className={styles.InfoTweet}>
                {user && <UserProfile user={user} />}
                <span>5 min · 25 de octubre de 2024</span>
            </div>
            <p>{content}</p>
            {media && <Media media={media} />}
            <div className={styles.InteractionSpace}>
                <Interactions likes={likesCount} comments={commentsCount} retweets={retweetsCount} saves={savesCount} tweetID={id} isLiked={isLiked} isSaved={isSaved} isRetweeted={isRetweeted}/>
            </div>
        </div>
    );
};

export default Tweet;
