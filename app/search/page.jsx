"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import InputSearch from "../../components/InputSearch"; // Asegúrate de que la ruta sea correcta
import Tweet from "../../components/Tweet";
import { useRouter } from "next/navigation"; // Para redirigir a perfiles
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const SearchPage = () => {
    const { user, isLoading, error } = useUser();
    const [results, setResults] = useState({ users: [], tweets: [] });
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState("users"); // Estado para la pestaña seleccionada
    const router = useRouter(); // Para redirigir a perfiles de usuario

    // Función que realiza la búsqueda
    const handleSearch = async (searchQuery) => {
        setLoading(true);
        setQuery(searchQuery); // Guarda la consulta actual

        try {
            const response = await fetch(`http://localhost:5001/search?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch search results. Status: ${response.status}`);
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (sub) => {
        router.push(`/profilee/${encodeURIComponent(sub)}`);
    };

    return (
        <div className={styles.SearchPage}>
            <div className={styles.searchContainer}>
                <InputSearch onSearch={handleSearch} />
            </div>

            <div className={styles.tabs}>
                <button
                    className={selectedTab === "users" ? styles.activeTab : styles.tab}
                    onClick={() => setSelectedTab("users")}
                >
                    Usuarios
                </button>
                <button
                    className={selectedTab === "tweets" ? styles.activeTab : styles.tab}
                    onClick={() => setSelectedTab("tweets")}
                >
                    Tweets
                </button>
            </div>

            <div className={styles.resultsContainer}>
                {loading && <p>Cargando resultados...</p>}
                {!loading && results.users.length === 0 && results.tweets.length === 0 && query && (
                    <p>No se encontraron resultados para "{query}".</p>
                )}
                {!loading && (
                    <div>
                        {selectedTab === "users" && results.users.length > 0 && (
                            <>
                                <h3>Usuarios</h3>
                                {results.users.map(user => (
                                    <Link href={`/profilee/${user.sub}`} key={user.sub}>
                                        <div
                                            className={styles.resultItem}
                                            onClick={() => handleUserClick(user.sub)}
                                        >
                                            <img src={user.picture} alt={`${user.given_name}'s avatar`} />
                                            <div>
                                                <p>{user.given_name}</p>
                                                <p>@{user.nickname}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </>
                        )}

                        {selectedTab === "tweets" && results.tweets.length > 0 && (
                            <>
                                <h3>Tweets</h3>
                                {results.tweets.map(tweet => (
                                    <Tweet
                                        key={tweet.tweetID}
                                        id={tweet.tweetID}
                                        user={{
                                            picture: tweet.picture,
                                            name: tweet.name,
                                            sub: tweet.userID
                                        }}
                                        userHandle={tweet.nickname}
                                        content={tweet.content}
                                        media={tweet.mediaURL}
                                        likesCount={tweet.likesCount || 0}
                                        retweetsCount={tweet.retweetsCount || 0}
                                        commentsCount={tweet.commentsCount || 0}
                                        savesCount={tweet.savesCount || 0}
                                        isLiked={tweet.isLiked || false}
                                        isRetweeted={tweet.isRetweeted || false}
                                        isSaved={tweet.isSaved || false}
                                        tweetDate={tweet.creation}
                                        isOwnTweet={tweet.userID == user.sub}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
