"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { useUser } from '@auth0/nextjs-auth0/client';

const ProfilePage = ({ sub }) => {
    const { user } = useUser()
    const [userProfile, setUserProfile] = useState(null);
    const [tweets, setTweets] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [userRetweets, setUserRetweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [following, setFollowing] = useState(false);

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

        const fetchUserTweets = async () => {
            try {
                const response = await fetch(`http://localhost:5001/user/${sub}/tweets`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user tweets. Status: ${response.status}`);
                }
                const data = await response.json();
                setTweets(data.tweets);
            } catch (err) {
                console.error('Error fetching user tweets:', err);
                setError(`Error fetching user tweets: ${err.message}`);
            }
        };

        const fetchUserLikes = async () => {
            try {
                const response = await fetch(`http://localhost:5001/user/${encodeURIComponent(sub)}/likes`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user likes. Status: ${response.status}`);
                }
                const data = await response.json();
                setUserLikes(data.likes);
            } catch (err) {
                console.error('Error fetching user likes:', err);
                setError(`Error fetching user likes: ${err.message}`);
            }
        };

        const fetchUserRetweets = async () => {
            try {
                const response = await fetch(`http://localhost:5001/user/${encodeURIComponent(sub)}/retweets`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user retweets. Status: ${response.status}`);
                }
                const data = await response.json();
                setUserRetweets(data.retweets);
            } catch (err) {
                console.error('Error fetching user retweets:', err);
                setError(`Error fetching user retweets: ${err.message}`);
            }
        };

        fetchUserProfile();
        fetchUserTweets();
        fetchUserLikes();
        fetchUserRetweets();
    }, [sub]);

    const handleFollowClick = async () => {
        const boody = {
            followeeID: userProfile?.sub, 
            followerID: user.sub
        }
        
        console.log(boody)

        try {
            const method = 'POST';
            const response = await fetch(`http://localhost:5001/follow`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ followeeID: userProfile?.sub, followerID: user.sub}), // Ajusta esto según cómo obtengas el sub del usuario actual
            });

            if (!response.ok) {
                throw new Error('Failed to update follow status');
            }

            setFollowing(!following);
        } catch (err) {
            console.error('Error updating follow status:', err);
            setError('Failed to update follow status');
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
                    <button className={styles.followButton} onClick={handleFollowClick}>
                        {following ? 'Unfollow' : 'Follow'}
                    </button>
                    <div className={styles.bio}>
                        <p>{userProfile.bio || "Este usuario aún no tiene una bio."}</p>
                    </div>

                    {/* Tweets */}
                    <div className={styles.tweets}>
                        <h3>Tweets</h3>
                        {tweets.length > 0 ? (
                            tweets.map((tweet) => (
                                <div key={tweet.tweetID} className={styles.tweet}>
                                    <p>{tweet.content}</p>
                                    <span>{new Date(tweet.created_at).toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <p>Este usuario aún no ha publicado tweets.</p>
                        )}
                    </div>

                    {/* Liked Tweets */}
                    <div className={styles.likes}>
                        <h3>Liked Tweets</h3>
                        {userLikes.length > 0 ? (
                            userLikes.map((tweet) => (
                                <div key={tweet.tweetID} className={styles.tweet}>
                                    <p>{tweet.content}</p>
                                    <span>{new Date(tweet.created_at).toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <p>Este usuario aún no ha dado likes a tweets.</p>
                        )}
                    </div>

                    {/* Retweets */}
                    <div className={styles.retweets}>
                        <h3>Retweets</h3>
                        {userRetweets.length > 0 ? (
                            userRetweets.map((tweet) => (
                                <div key={tweet.tweetID} className={styles.tweet}>
                                    <p>{tweet.content}</p>
                                    <span>{new Date(tweet.created_at).toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <p>Este usuario aún no ha hecho retweets.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;