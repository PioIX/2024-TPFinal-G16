import React from "react";
import styles from "./Feed.module.css";
import Tweet from "./Tweet";
import Comment from "./Comment";


const Feed = ({ user }) => {
    const now = new Date();
    
    
    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Function to format time
    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        return timeString;
    };
    const tweetData = {
        id: 1,
        user,
        userHandle: user?.nickname || user?.name || "Usuario",
        content: "Este es un tweet de ejemplo. ¡Saludos a todos!",
        media: [
            { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlP43bXvIFTB5XmGqCJq9keyTQAmeZ0XZnTQ&s" },
            { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlP43bXvIFTB5XmGqCJq9keyTQAmeZ0XZnTQ&s" },
        ],
        likesAmount: 23,
        retweetsAmount: 10,
        commentsAmount: 5,
        savesAmount: 3,
        time: formatTime(now), 
        date: formatDate(now),  
        isLiked: false,
        isRetweeted: false,
        
    };
    const [comments, setComment] = useState()

    const handleLike = () => {
        setTweetData((prev) => ({
            ...prev,
            isLiked: !prev.isLiked,
            likesAmount: prev.isLiked ? prev.likesAmount - 1 : prev.likesAmount + 1,
        }));
    };

    const handleRetweet = () => {
        setTweetData((prev) => ({
            ...prev,
            isRetweeted: !prev.isRetweeted,
            retweetsAmount: prev.isRetweeted ? prev.retweetsAmount - 1 : prev.retweetsAmount + 1,
        }));
    };

    const handleSave = () => {
        setTweetData((prev) => ({
            ...prev,
            savesAmount: prev.savesAmount + 1,
        }));
    };
    const addComment = (comment) => {
        setComment((prev) => [...prev, comment]);
        setTweetData((prev) => ({
            ...prev,
            commentsAmount: prev.commentsAmount + 1,
        }));
    };

    return (
        <div className={styles.feed}>
            <Tweet {...tweetData} />
                onLike={handleLike} 
                onRetweet={handleRetweet} 
                onSave={handleSave}
                onAddComment={addComment} 
            <Tweet {...tweetData} />
                onLike={handleLike} 
                onRetweet={handleRetweet} 
                onSave={handleSave}
                onAddComment={addComment} 
            <Tweet {...tweetData} />
                onLike={handleLike} 
                onRetweet={handleRetweet} 
                onSave={handleSave}
                onAddComment={addComment} 
            <Comment comments={comments} user={user} addComment={addComment} />
        </div>
    );
};

export default Feed;
