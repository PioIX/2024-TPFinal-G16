import React from 'react';
import Tweet from './Tweet';

const Feed = ({ tweets }) => {
    return (
        <div>
            {tweets.map((tweet) => (
                <Tweet
                    key={tweet.tweetID}
                    userHandle={tweet.userID}
                    content={tweet.content}
                    media={tweet.mediaURL}
                />
            ))}
        </div>
    );
};

export default Feed;
