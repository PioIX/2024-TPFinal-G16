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
                    id={tweet.tweetID}
                    likesCount={tweet.likesCount}
                    retweetsCount={tweet.retweetsCount}
                    savesCount={tweet.savesCount}
                    commentsCount={tweet.commentsCount}
                    isLiked={tweet.isLiked}
                    isRetweeted={tweet.isRetweeted}
                    isSaved={tweet.isSaved}
                />
            ))}
        </div>
    );
};

export default Feed;
