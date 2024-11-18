import React from "react";
import styles from "./PostButton.module.css";

const PostButton = ({ onClick }) => {
    return (
        <button className={styles.postButton} onClick={onClick}>
            Postear
        </button>
    );
};

export default PostButton;
