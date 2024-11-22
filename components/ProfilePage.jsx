"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { useUser } from '@auth0/nextjs-auth0/client';
import Tweet from './Tweet';

const ProfilePage = ({ sub }) => {
    const { user } = useUser();
    const [userProfile, setUserProfile] = useState(null);
    const [tweets, setTweets] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [userRetweets, setUserRetweets] = useState([]);
    const [userSaves, setUserSaves] = useState([]); // Estado para los saves
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState("tweets"); // Nuevo estado para el tab seleccionado
    const [following, setFollowing] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [followees, setFollowees] = useState(0);
    const [posts, setPosts] = useState(0);

    const fetchWithErrorHandling = async (url, errorMessage) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${errorMessage}. Status: ${response.status}`);
            }
            return await response.json();
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    };

    useEffect(() => {
        if (!sub || !user) return;

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/user/${encodeURIComponent(sub)}?userID=${user.sub}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
                }
                const data = await response.json();
                setUserProfile(data.user);
                console.log(data.user);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(`Error fetching user profile: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, sub]);

    useEffect(() => {
        if (!user || !sub || !userProfile) return;

        console.log(sub)
        console.log(user.sub)

        const fetchData = async () => {
            try {
                const [tweetsRes, likesRes, retweetsRes, savesRes] = await Promise.all([
                    fetchWithErrorHandling(`http://localhost:5001/user/${sub}/tweets?userID=${user.sub}`, 'Failed to fetch tweets'),
                    fetchWithErrorHandling(`http://localhost:5001/user/${sub}/likes?userID=${user.sub}`, 'Failed to fetch likes'),
                    fetchWithErrorHandling(`http://localhost:5001/user/${sub}/retweets?userID=${user.sub}`, 'Failed to fetch retweets'),
                    sub === user.sub ? fetchWithErrorHandling(`http://localhost:5001/user/${sub}/saves?userID=${user.sub}`, 'Failed to fetch saves') : Promise.resolve({ tweets: [] })
                ]);

                setTweets(tweetsRes.tweets);
                setUserLikes(likesRes.tweets);
                setUserRetweets(retweetsRes.tweets);
                if (sub === user.sub) setUserSaves(savesRes.tweets);
                console.log(userSaves)
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [user, userProfile, sub]);

    useEffect(() => {
        if (!user || !sub || !userProfile) return;

        setFollowees(userProfile.followeesCount);
        setFollowers(userProfile.followersCount);
        setPosts(userProfile.tweetsCount);
        setFollowing(userProfile.isFollowing);
    }, [userProfile]);

    const handleFollowClick = async () => {
        try {
            const response = await fetch(`http://localhost:5001/follow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    followeeID: userProfile?.sub,
                    followerID: user.sub,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update follow status");
            }

            setFollowing(!following);
            following ? setFollowers((prevFollowers) => prevFollowers - 1) : setFollowers((prevFollowers) => prevFollowers + 1);
        } catch (err) {
            console.error("Error updating follow status:", err);
            setError("Failed to update follow status");
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.profilePage}>
            {userProfile && (
                <>
                    {/* Header con información del usuario */}
                    <div className={styles.header}>
                        <img
                            src={userProfile.picture}
                            alt={`${userProfile.name}'s avatar`}
                            className={styles.avatar}
                        />
                        <div className={styles.userInfo}>
                            <h2>{userProfile.name}</h2>
                            <p>@{userProfile.nickname}</p>
                        </div>
                    </div>

                    {/* Estadísticas del usuario */}
                    <div style={{ display: "flex", flexDirection: "row", gap: "20%" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5%" }}>
                            <p style={{ fontSize: "1.3em", fontWeight: "700" }}>Posts</p>
                            <p style={{ fontSize: "1.5em" }}>{posts || "0"}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5%" }}>
                            <p style={{ fontSize: "1.3em", fontWeight: "700" }}>Followers</p>
                            <p style={{ fontSize: "1.5em" }}>{followers || "0"}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5%" }}>
                            <p style={{ fontSize: "1.3em", fontWeight: "700" }}>Followed</p>
                            <p style={{ fontSize: "1.5em" }}>{followees || "0"}</p>
                        </div>

                        {/* Botón de seguir (solo si el perfil no es del usuario actual) */}
                    {sub !== user.sub && (
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5%" }}>
                        <button
                            className={following ? styles.followButtonClicked : styles.followButton}
                            onClick={handleFollowClick}
                            style={{ fontSize: "1.1em" }}
                        >
                            {following ? "Unfollow" : "Follow"}
                        </button>
                        </div>
                    )}
                    </div>

                    

                    {/* Tabs para alternar entre Tweets, Likes, Retweets y Saves (si es el perfil del usuario actual) */}
                    <div className={styles.tabs}>
                        <button
                            className={selectedTab === "tweets" ? styles.activeTab : styles.tab}
                            onClick={() => setSelectedTab("tweets")}
                        >
                            Tweets
                        </button>
                        <button
                            className={selectedTab === "likes" ? styles.activeTab : styles.tab}
                            onClick={() => setSelectedTab("likes")}
                        >
                            Likes
                        </button>
                        <button
                            className={selectedTab === "retweets" ? styles.activeTab : styles.tab}
                            onClick={() => setSelectedTab("retweets")}
                        >
                            Retweets
                        </button>
                        {sub === user.sub && (
                            <button
                                className={selectedTab === "saves" ? styles.activeTab : styles.tab}
                                onClick={() => setSelectedTab("saves")}
                            >
                                Saves
                            </button>
                        )}
                    </div>

                    {/* Renderizado condicional según la pestaña seleccionada */}
                    {selectedTab === "tweets" && (
                        <div className={styles.tweets}>
                            <h3>Tweets</h3>
                            {tweets.length > 0 ? (
                                tweets.map((tweet) => (
                                    <Tweet
                                        key={tweet.tweetID}
                                        user={{
                                            picture: tweet.picture,
                                            name: tweet.name,
                                            sub: tweet.userID,
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
                                    />
                                ))
                            ) : (
                                <p>Este usuario aún no ha publicado tweets.</p>
                            )}
                        </div>
                    )}

                    {selectedTab === "likes" && (
                        <div className={styles.likes}>
                            <h3>Liked Tweets</h3>
                            {userLikes.length > 0 ? (
                                userLikes.map((tweet) => (
                                    <Tweet
                                        key={tweet.tweetID}
                                        user={{
                                            picture: tweet.picture,
                                            name: tweet.name,
                                            sub: tweet.userID,
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
                                    />
                                ))
                            ) : (
                                <p>Este usuario aún no ha dado likes a tweets.</p>
                            )}
                        </div>
                    )}

                    {selectedTab === "retweets" && (
                        <div className={styles.retweets}>
                            <h3>Retweets</h3>
                            {userRetweets.length > 0 ? (
                                userRetweets.map((tweet) => (
                                    <Tweet
                                        key={tweet.tweetID}
                                        user={{
                                            picture: tweet.picture,
                                            name: tweet.name,
                                            sub: tweet.userID,
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
                                    />
                                ))
                            ) : (
                                <p>Este usuario aún no ha hecho retweets.</p>
                            )}
                        </div>
                    )}

                    {selectedTab === "saves" && sub === user.sub && (
                        <div className={styles.saves}>
                            <h3>Saved Tweets</h3>
                            {userSaves.length > 0 ? (
                                userSaves.map((tweet) => (
                                    <Tweet
                                        key={tweet.tweetID}
                                        user={{
                                            picture: tweet.picture,
                                            name: tweet.name,
                                            sub: tweet.userID,
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
                                    />
                                ))
                            ) : (
                                <p>No has guardado ningún tweet.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;
