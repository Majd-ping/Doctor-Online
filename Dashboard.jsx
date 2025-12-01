import posts from "../data/posts.json";
import PostCard from "../components/PostCard";

function Dashboard() {
  return (
    <div className="container mt-4">
      <h2>Latest Medical Updates</h2>

      <div className="mt-3">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
