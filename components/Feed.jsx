"use client"

import React from 'react';
import Tweet from './Tweet';
import Link from "next/link";

const Feed = ({ tweets }) => {
    return (
        <div>
            {console.log(tweets)}
            {tweets.map((tweet) => (
                // <Link href={`/tweet/${tweet.tweetID}`} key={tweet.tweetID}>
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

                />
                // </Link>
            ))}
        </div>
    );
};

export default Feed;
