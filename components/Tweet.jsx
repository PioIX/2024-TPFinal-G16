import React from "react";
import styles from "./Tweet.module.css";
import UserProfile from "./UserProfile";
import Media from "./Media";
import Interactions from "./Interactions";

const Tweet = ({
    id,
    user,
    userHandle,
    content,
    contentType,
    media,
    likesAmount,
    retweetsAmount,
    commentsAmount,
    savesAmount,
    time,
    date,
    isLiked,
    isRetweeted,
    replyingToUser,
}) => {
    return (
        <div className={styles.tweet}>
            <UserProfile user={user} userHandle={userHandle} />
            <p>{content}</p>
            {media && <Media media={media} />}
            <Interactions
                likes={likesAmount}
                retweets={retweetsAmount}
                comments={commentsAmount}
                saves={savesAmount}
            />
            <span>{time} · {date}</span>
        </div>
    );
};

export default Tweet;