import React, { useState } from "react";

const Comment = ({ comments }) => {
    const [newComment, setNewComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment) {
            // Add the new comment via the addComment function passed from Feed
            addComment(newComment);
            setNewComment("");
        }
    };

    return (
        <div>
            <h4>Comentarios:</h4>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Escribe un comentario..." 
                />
                <button type="submit">Comentar</button>
            </form>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                ))}
            </ul>
        </div>
    );
};

export default Comment;
