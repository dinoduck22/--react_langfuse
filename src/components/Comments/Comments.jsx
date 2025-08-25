import React, { useState } from 'react';
import styles from './Comments.module.css';

const Comment = ({ comment }) => (
  <div className={styles.comment}>
    <div className={styles.commentHeader}>
      <span className={styles.commentAuthor}>{comment.author}</span>
      <span className={styles.commentTimestamp}>{comment.timestamp}</span>
    </div>
    <div className={styles.commentBody}>
      <p>{comment.content}</p>
    </div>
  </div>
);


const Comments = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <div className={styles.newCommentSection}>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.commentTextarea}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add comment..."
          />
          <div className={styles.formActions}>
            <span className={styles.markdownSupport}>supports markdown</span>
            <button type="submit" className={styles.submitButton} disabled={!newComment.trim()}>
              Comment
            </button>
          </div>
        </form>
      </div>
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;