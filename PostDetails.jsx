import { useParams } from "react-router-dom";
import posts from "../data/posts.json";

function PostDetails() {
  const { id } = useParams();
  const post = posts.find(p => p.id === parseInt(id));

  if (!post) return <h2 className="container mt-4">Post not found</h2>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p className="text-muted">
        By {post.author} • {post.date}
      </p>

      <p>{post.content}</p>
    </div>
  );
}

export default PostDetails;
