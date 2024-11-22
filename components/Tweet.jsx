"use client"

import React from "react";
import styles from "./Tweet.module.css";
import UserProfile from "./UserProfile";
import Media from "./Media";
import Interactions from "./Interactions";

const Tweet = ({ id, user, content, media, likesCount, retweetsCount, commentsCount, savesCount, isLiked, isSaved, isRetweeted, tweetDate, isOwnTweet = false }) => {
    let tweetFinalDate = new Date(tweetDate);
    console.log(isOwnTweet)


    const handleDeleteTweet = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tweet?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5001/tweets/${id}?userID=${encodeURIComponent(user.sub)}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete tweet. Status: ${response.status}`);
            }

            alert("Tweet deleted successfully!");
            // Optionally, you can add logic to remove the tweet from the list or refresh the page
            window.location.reload(); // Reload the page to reflect the deletion
        } catch (error) {
            console.error("Error deleting tweet:", error);
            alert("An error occurred while deleting the tweet. Please try again.");
        }
    };

    return (
        <div className={styles.tweet}>
            <div className={styles.InfoTweet}>
                {user && <UserProfile user={user} />}
                <span>{tweetFinalDate.toLocaleTimeString("en-US", { timeZone: 'America/Argentina/Buenos_Aires' })}
                {isOwnTweet && 
                    <button onClick={handleDeleteTweet} className={styles.deleteButton}>
                        BORRAR
                    </button>
                }
                </span>
            </div>
            <p>{content}</p>
            {media && <Media media={media} />}
            <div className={styles.InteractionSpace}>
                <Interactions likes={likesCount} comments={commentsCount} retweets={retweetsCount} saves={savesCount} tweetID={id} isLiked={isLiked} isSaved={isSaved} isRetweeted={isRetweeted} />
            </div>
        </div>
    );
};

export default Tweet;
