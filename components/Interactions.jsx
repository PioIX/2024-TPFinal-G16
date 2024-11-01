const Interactions = ({ likes, retweets, comments, saves }) => (
    <div>
        <span>{likes}  <img src="./images/heart.png" alt="Heart" /> Likes</span>
        <span>{retweets} Retweets</span>
        <span>{comments} Comments</span>
        <span>{saves} Saves</span>
    </div>
);

export default Interactions;