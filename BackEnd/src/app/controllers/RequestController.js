const express = require('express');
const router = express.Router();
const Post = require('../modules/post');

// API để cập nhật trạng thái bài viết
router.post('/update-post-status/:id', (req, res) => {
    const postId = req.params.id;
    const { status } = req.body;

    Post.findByIdAndUpdate(postId, { status: status }, { new: true })
        .then(updatedPost => {
            if (!updatedPost) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, message: 'Post updated successfully', post: updatedPost });
        })
        .catch(error => {
            console.error('Error updating post status:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        });
});

module.exports = router;
