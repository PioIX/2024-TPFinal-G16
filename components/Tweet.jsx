"use client"

import React from "react";
import styles from "./Tweet.module.css";
import UserProfile from "./UserProfile";
import Media from "./Media";
import Interactions from "./Interactions";


const Tweet = ({ id, user, content, media, likesCount, retweetsCount, commentsCount, savesCount, isLiked, isSaved, isRetweeted, tweetDate }) => {
    let tweetFinalDate = new Date(tweetDate);

    return (
        <div className={styles.tweet}>
            <div className={styles.InfoTweet}>
                {user && <UserProfile user={user} />}
                <span>{tweetFinalDate.toLocaleTimeString("en-US", { timeZone: 'America/Argentina/Buenos_Aires' })}</span>
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
