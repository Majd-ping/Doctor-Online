import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h4>{post.title}</h4>
        <p className="text-muted">By {post.author} • {post.date}</p>
        <p>{post.summary}</p>

        <Link to={`/post/${post.id}`} className="btn btn-primary">Read More</Link>
      </div>
    </div>
  );
}

export default PostCard;
