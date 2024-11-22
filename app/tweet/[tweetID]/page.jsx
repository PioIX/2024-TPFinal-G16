"use client"; // Marca el componente como Cliente

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";  // Importa usePathname desde next/navigation
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import Tweet from "../../../components/Tweet";
import Input from "../../../components/Input";
import styles from "./TweetDetail.module.css"; // Usa un archivo de CSS para estilizar
import { useUser } from '@auth0/nextjs-auth0/client';

const TweetDetailPage = () => {
    const pathname = usePathname();  // Obtiene la ruta actual
    const tweetID = pathname ? pathname.split("/")[2] : null; // Asegura que el pathname existe y luego extrae el tweetID

    const [tweet, setTweet] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [newTweetContent, setNewTweetContent] = useState("");

    const { user, isLoading, error } = useUser();

    useEffect(() => {
        if (!tweetID || !user?.sub) return; // Si no hay un tweetID o no está logueado, no hacer nada

        const fetchTweet = async () => {
            try {
                const response = await fetch(`http://localhost:5001/tweet/${tweetID}?userID=${user.sub}`);
                if (!response.ok) {
                    throw new Error('Error fetching tweet');
                }
                const data = await response.json();
                setTweet(data.tweet);
            } catch (err) {
                setFetchError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTweet();
    }, [tweetID, user?.sub]); // Dependencias adicionales para esperar al usuario

    const handlePostComment = async () => {
        console.log(newTweetContent)
        if (newTweetContent.trim() !== "") {
            try {
                const response = await fetch('http://localhost:5001/comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID: user?.sub, // Aquí usamos el sub del usuario autenticado
                        content: newTweetContent,
                        tweetID: tweetID
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create tweet');
                }

                const newTweet = {
                    id: tweets.length + 1,
                    user,
                    userHandle: user?.nickname || "Usuario",
                    content: newTweetContent,
                    media: null, // Por ahora sin imágenes
                };
                setTweets([newTweet, ...tweets]);
                setNewTweetContent(""); // Limpiar el campo de input
            } catch (err) {
                console.error(err.message);
            }
        }

        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:5001/tweets/${tweet.tweetID}/comments?userID=${user.sub}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch comments. Status: ${response.status}`);
                }
                const data = await response.json();
                setComments(data.comments);
            } catch (err) {
                console.error('Error fetching comments:', err);
                setError(`Error fetching comments: ${err.message}`);
            }
        };

        fetchComments()
    };

    if (loading) {
        return <Loading />;
    }

    if (fetchError) {
        return <ErrorMessage message={fetchError} />;
    }

    if (!tweet) {
        return <div>Tweet not found</div>;
    }

    const handleNewTweetChange = (event) => {
        console.log("entre")
        setNewTweetContent(event.target.value)
    }

    return (
        <div className={styles.tweetDetailPage}>
            <Tweet
                    key={tweet.tweetID}
                    user={{
                        picture: tweet.picture,
                        name: tweet.name,
                        sub: tweet.userID
                    }}
                    userHandle={tweet.userID}
                    content={tweet.content}
                    media={tweet.mediaURL}
                    id={tweet.tweetID}
                    likesCount={tweet.likesCount}
                    retweetsCount={tweet.retweetsCount}
                    savesCount={tweet.savesCount}
                    commentsCount={tweet.commentsCount}
                    isLiked={tweet.isLiked}
                    isRetweeted={tweet.isRetweeted}
                    isSaved={tweet.isSaved}
                    tweetDate={tweet.creation}
                    isOwnTweet={tweet.tweetID == user.sub}
                />
            <div className={styles.inputContainer}>
                <input className={styles.Input} placeholder="¿Qué está pasando?" onChange={handleNewTweetChange} />
                <button className={styles.postButton} onClick={handlePostComment}>
                    Postear
                </button>
            </div>
            {/* Agregar la funcionalidad de comentarios */}
            <div>
                <h3>Comentarios:</h3>
                {comments.map((tweet) => (
                    <Link href={`/tweet/${tweet.commentID}`} key={tweet.commentID}>
                    <Tweet
                        key={tweet.commentID}
                        user={{
                            picture: tweet.picture,
                            name: tweet.name,
                            sub: tweet.userID
                        }}
                        userHandle={tweet.userID}
                        content={tweet.content}
                        media={tweet.mediaURL}
                        id={tweet.tweetID}
                        likesCount={tweet.likesCount}
                        retweetsCount={tweet.retweetsCount}
                        savesCount={tweet.savesCount}
                        commentsCount={tweet.commentsCount}
                        isLiked={tweet.isLiked}
                        isRetweeted={tweet.isRetweeted}
                        isSaved={tweet.isSaved}
                        tweetDate={tweet.creation}
                        isOwnTweet={tweet.tweetID == user.sub}
                    />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TweetDetailPage;
