import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { authFetch } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

function PostDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Fetch post
    authFetch(`/posts/${id}`)
      .then((data) => {
        if (mounted && data && data.post) setPost(data.post);
      })
      .catch(() => setError("Post not found"))
      .finally(() => mounted && setLoading(false));

    // Fetch comments
    authFetch(`/comments/${id}`)
      .then((data) => {
        if (mounted && data && data.comments) setComments(data.comments);
      })
      .catch(() => {});

    return () => (mounted = false);
  }, [id]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const result = await authFetch(`/comments/${commentId}`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: user?.id }),
      });

      if (result && result.success) {
        // Refresh comments after deletion
        const updatedComments = await authFetch(`/comments/${id}`);
        if (updatedComments && updatedComments.comments) {
          setComments(updatedComments.comments);
        }
      } else {
        setSubmitError(result?.message || "Failed to delete comment");
      }
    } catch (err) {
      setSubmitError("Error deleting comment");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setSubmitError("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await authFetch(`/comments/${id}`, {
        method: "POST",
        body: JSON.stringify({ text: commentText, user_id: user?.id }),
      });

      if (result && result.success) {
        setCommentText("");
        // Refresh comments
        const updatedComments = await authFetch(`/comments/${id}`);
        if (updatedComments && updatedComments.comments) {
          setComments(updatedComments.comments);
        }
      } else {
        setSubmitError(result?.message || "Failed to post comment");
      }
    } catch (err) {
      setSubmitError("Error posting comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
      const result = await authFetch(`/posts/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: user?.id, role: user?.role }),
      });

      if (result && result.success) {
        window.location.href = '/dashboard';
      } else {
        setError(result?.message || "Failed to delete post");
      }
    } catch (err) {
      setError("Error deleting post");
    }
  };

  if (loading) return <div className="container mt-5"><div className="alert alert-info">📖 Loading post...</div></div>;
  if (error || !post) return <div className="container mt-5"><div className="alert alert-warning">{error || "Post not found"}</div></div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-5 mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h1 className="mb-0">{post.title}</h1>
          {user && user.role === 'Doctor' && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDeletePost}
              title="Delete post"
            >
              🗑️ Delete
            </button>
          )}
        </div>
        
        <div className="mb-4 pb-3 border-bottom">
          <small className="text-muted">
            ✍️ By <strong>{post.author}</strong> • 📅 {post.date}
            {post.category && <> • 🏷️ <span className="badge bg-info">{post.category}</span></>}
          </small>
        </div>

        <div className="post-content mb-4">
          <p>{post.content}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card shadow p-4">
        <h4 className="mb-4">💬 Comments ({comments.length})</h4>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-4 pb-4 border-bottom">
            {submitError && <div className="alert alert-danger alert-sm" role="alert">{submitError}</div>}
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-sm" 
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="alert alert-info mb-4" role="alert">
            <small>👤 <a href="/login" className="alert-link">Login</a> to post comments</small>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card mb-3 bg-light">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-1">{comment.name || "Anonymous"}</h6>
                    <small className="text-muted d-block mb-2">{comment.date}</small>
                  </div>
                  {user && user.id === comment.user_id && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Delete comment"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <p className="card-text mb-0">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostDetails;
