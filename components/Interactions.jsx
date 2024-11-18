'use client';
import styles from "./Interactions.module.css"
import { useState, useEffect} from 'react';



const Interactions = ({ likes, retweets, comments, saves }) => {
    const [imageHeartClicked, setImageHeartClicked] = useState(false);
    const [imageRetweetClicked, setImageRetweetClicked] = useState(false);
    const [imageSavedClicked, setImageSavedClicked] = useState(false);

    const handleImageLikeChange = () => {
        setImageHeartClicked(!imageHeartClicked);
    };
    const handleImageRetweetChange = () => {
        setImageRetweetClicked(!imageRetweetClicked);
    };
    const handleImageSavedChange = () => {
        setImageSavedClicked(!imageSavedClicked);
    };

    return (
        <div className={styles.InteractionsContainer}>
                <div className={styles.Span} onClick={handleImageLikeChange}>
                    {likes} 
                    <img src={imageHeartClicked? "./images/heartClicked.png" : "./images/heartUnclicked.png"} alt="Heart" height="20px" width="20px"/> 
                    Likes
                </div>
                <div className={styles.Span} onClick={handleImageRetweetChange}>
                    {retweets} 
                    <img src={imageRetweetClicked? "./images/retweetClicked.png" : "./images/retweetUnclicked.png"} alt="Heart" height="20px" width="20px"/> 
                    Retweets
                </div>
                <div className={styles.Span}>
                    {comments} 
                    <img src="./images/comment.png" alt="Heart" height="20px" width="20px"/>
                    Comments
                </div>
                <div className={styles.Span} onClick={handleImageSavedChange}>
                    {saves} 
                    <img src={imageSavedClicked? "./images/savedClicked.png": "./images/savedUnclicked.png"} alt="Heart" height="20px" width="20px"/> 
                    Saves
                </div>
        </div>
        );
    };
export default Interactions;