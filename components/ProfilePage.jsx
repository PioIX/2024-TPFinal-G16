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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState("tweets"); // Nuevo estado para el tab seleccionado
    const [following, setFollowing] = useState(false);

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
        if (!sub) return;

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/user/${encodeURIComponent(sub)}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
                }
                const data = await response.json();
                setUserProfile(data.user);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(`Error fetching user profile: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [sub]);

    useEffect(() => {
        if (!user || !sub || !userProfile) return;

        const fetchData = async () => {
            try {
                const [tweetsRes, likesRes, retweetsRes] = await Promise.all([
                    fetchWithErrorHandling(`http://localhost:5001/user/${sub}/tweets?userID=${user.sub}`, 'Failed to fetch tweets'),
                    fetchWithErrorHandling(`http://localhost:5001/user/${sub}/likes?userID=${user.sub}`, 'Failed to fetch likes'),
                    fetchWithErrorHandling(`http://localhost:5001/user/${sub}/retweets?userID=${user.sub}`, 'Failed to fetch retweets'),
                ]);

                setTweets(tweetsRes.tweets);
                console.log(tweets)
                setUserLikes(likesRes.tweets);
                setUserRetweets(retweetsRes.tweets);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [user, userProfile, sub]);

    useEffect(() => {
        console.log("Updated tweets:", tweets);
    }, [tweets]);

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
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", alignContent:"center", width: "100%",}}>
                        <div style={{display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", alignContent:"center"}}>
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
                            <div style={{ display: "flex", flexDirection: "row", alignContent:"center", alignItems:"center", textAlign:"center", justifyContent:"space-around", width:"100%"}}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        alignContent: "center",
                                        textAlign: "center",
                                        gap: "5%",
                                    }}
                                >
                                    <p style={{ fontSize: "1.3em", fontWeight: "700" }}>Posts</p>
                                    <p style={{ fontSize: "1.5em" }}>{userProfile.posts || "0"}</p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        alignContent: "center",
                                        textAlign: "center",
                                        gap: "5%",
                                    }}
                                >
                                    <p style={{ fontSize: "1.3em", fontWeight: "700" }}>Followers</p>
                                    <p style={{ fontSize: "1.5em" }}>{userProfile.followers || "0"}</p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        alignContent: "center",
                                        textAlign: "center",
                                        gap: "5%",
                                    }}
                                >
                                    <p style={{ fontSize: "1.3em", fontWeight: "700" }}>Followed</p>
                                    <p style={{ fontSize: "1.5em" }}>{userProfile.followed || "0"}</p>
                                </div>
                            </div>
                            <button
                            className={following ? styles.followButtonClicked : styles.followButton}
                            onClick={handleFollowClick}
                            >
                            {following ? "Unfollow" : "Follow"}
                            </button>

                            {/* Botón de seguir */}

                            {/* Bio del usuario */}
                            <div style={{marginTop:"5%"}}className={styles.bio}>
                                <p>{userProfile.bio || "Este usuario aún no tiene una bio."}</p>
                            </div>
                        </div>
                        {/* Tabs para alternar entre Tweets, Likes y Retweets */}
                        <div className={styles.tabs}>
                            <a
                                className={selectedTab === "tweets" ? styles.activeTab : styles.tabButton}
                                onClick={() => setSelectedTab("tweets")}
                            >
                                Tweets
                            </a>
                            <button
                                className={selectedTab === "likes" ? styles.activeTab : styles.tabButton}
                                onClick={() => setSelectedTab("likes")}
                            >
                                Likes
                            </button>
                            <button
                                className={selectedTab === "retweets" ? styles.activeTab : styles.tabButton}
                                onClick={() => setSelectedTab("retweets")}
                            >
                                Retweets
                            </button>
                        </div>
                    </div>

                    {/* Renderizado condicional según la pestaña seleccionada */}
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", alignContent:"center", marginTop:"5%", width: "100%"}}>
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
                                        />

                                    ))
                                ) : (
                                    <p>Este usuario aún no ha hecho retweets.</p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
