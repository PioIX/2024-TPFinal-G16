import styles from "./Interactions.module.css"

const Interactions = ({ likes, retweets, comments, saves }) => (
    <div className={styles.InteractionsContainer}>
        <div className={styles.InteractionContainer}>
            <span className={styles.Span}>{likes}  <img src="./images/heartUnclicked.png" alt="Heart" height="25px" width="25px"/> Likes</span>
        </div>
        <div className={styles.InteractionContainer}>
            <span className={styles.Span}>{retweets} <img src="./images/retweetUnclicked.png" alt="Heart" height="25px" width="25px"/> Retweets</span>
        </div>
        <div className={styles.InteractionContainer}>
            <span className={styles.Span}>{comments} <img src="./images/comment.png" alt="Heart" height="25px" width="25px"/> Comments</span>
        </div>
        <div className={styles.InteractionContainer}>
            <span className={styles.Span}>{saves} <img src="./images/savedUnclicked.png" alt="Heart" height="25px" width="25px"/> Saves</span>
        </div>
    </div>
);

export default Interactions;