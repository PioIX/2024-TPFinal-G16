'use client';
import styles from "./Interactions.module.css"
import { useState, useEffect} from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';



const Interactions = ({ likes, retweets, comments, saves, isLiked, isSaved, isRetweeted, tweetID }) => {
    const [tweetLikes, setLikes] = useState(likes);
    const [imageHeartClicked, setImageHeartClicked] = useState(isLiked);
    const [imageRetweetClicked, setImageRetweetClicked] = useState(isRetweeted);
    const [imageSavedClicked, setImageSavedClicked] = useState(isSaved);
    const { user, isLoading, error } = useUser();

    const handleImageLikeChange = () => {
        setImageHeartClicked(!imageHeartClicked);
        const postLike = async () => {
            try {
                const response = await fetch('http://localhost:5001/like', {  // Aquí se cambia a '/like'
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sub: user?.sub, // Aquí usamos el sub del usuario autenticado
                        tweetID: tweetID,
                    }),
                });
        
                if (!response.ok) {
                    throw new Error('Failed to create tweet');
                }
        
                const data = await response.json();
        
                // Según la respuesta, actualizamos la variable `likes`
                if (data.action === "added") {
                    setLikes(prevLikes => prevLikes + 1);  // Sumar 1 al contador de likes
                } else if (data.action === "removed") {
                    setLikes(prevLikes => prevLikes - 1);  // Restar 1 al contador de likes
                }
        
            } catch (err) {
                console.error(err.message);
            }
        };
        
        postLike();
        
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
                    
                    <img src={imageHeartClicked? "./images/heartClicked.png" : "./images/heartUnclicked.png"} alt="Heart" height="20px" width="20px"/> 
                    {tweetLikes} 
                </div>
                <div className={styles.Span} onClick={handleImageRetweetChange}>
                    <img src={imageRetweetClicked? "./images/retweetClicked.png" : "./images/retweetUnclicked.png"} alt="Heart" height="20px" width="20px"/> 
                    {retweets}
                </div>
                <div className={styles.Span}>
                    <img src="./images/comment.png" alt="Heart" height="20px" width="20px"/>
                    {comments}
                </div>
                <div className={styles.Span} onClick={handleImageSavedChange}> 
                    <img src={imageSavedClicked? "./images/savedClicked.png": "./images/savedUnclicked.png"} alt="Heart" height="20px" width="20px"/> 
                    {saves}
                </div>
        </div>
        );
    };
export default Interactions;