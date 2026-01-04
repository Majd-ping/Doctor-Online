import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { authFetch } from "../utils/api";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    authFetch('/posts')
      .then((data) => {
        if (mounted && data && data.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Latest Medical Updates</h2>

      <div className="mt-3">
        {loading && <p>Loading posts...</p>}
        {!loading && posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}

export default Dashboard;
