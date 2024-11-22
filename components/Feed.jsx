"use client";

import React from 'react';
import Tweet from './Tweet';
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';

const Feed = ({ tweets }) => {
    const { user } = useUser();

    // Verificar si el usuario está definido antes de ejecutar el resto del código
    if (!user) {
        return null; // No renderizar nada si el usuario no está definido
    }

    return (
        <div>
            {tweets.map((tweet) => (
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
                    isOwnTweet={tweet.userID === user.sub} // Verificar si el tweet pertenece al usuario actual
                />
            ))}
        </div>
    );
};

export default Feed;
