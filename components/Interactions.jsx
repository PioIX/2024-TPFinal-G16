import styles from "./Interactions.module.css"

const Interactions = ({ likes, retweets, comments, saves }) => (
    <div className={styles.InteractionsContainer}>
            <div className={styles.Span}>{likes}  <img src="./images/heartUnclicked.png" alt="Heart" height="20px" width="20px"/> Likes</div>
            <div className={styles.Span}>{retweets} <img src="./images/retweetUnclicked.png" alt="Heart" height="20px" width="20px"/> Retweets</div>
            <div className={styles.Span}>{comments} <img src="./images/comment.png" alt="Heart" height="20px" width="20px"/> Comments</div>
            <div className={styles.Span}>{saves} <img src="./images/savedUnclicked.png" alt="Heart" height="20px" width="20px"/> Saves</div>
    </div>
);

export default Interactions;