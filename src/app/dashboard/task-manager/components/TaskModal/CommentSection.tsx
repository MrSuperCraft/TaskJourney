import React, { useState } from 'react';

const CommentSection = ({ onCommentChange }: any) => {
    const [comments, setComments] = useState('');

    const handleChange = (event: any) => {
        setComments(event.target.value);
        onCommentChange(event.target.value);
    };

    return (
        <div className="comment-section-container">
            <textarea
                value={comments}
                onChange={handleChange}
                placeholder="Enter comments"
                className="comments-textarea"
            />
        </div>
    );
};

export default CommentSection;
