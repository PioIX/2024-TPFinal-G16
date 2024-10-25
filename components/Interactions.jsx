const Interactions = ({ likes, retweets, comments, saves }) => (
    <div>
        <span>{likes} Likes</span>
        <span>{retweets} Retweets</span>
        <span>{comments} Comments</span>
        <span>{saves} Saves</span>
    </div>
);

export default Interactions;