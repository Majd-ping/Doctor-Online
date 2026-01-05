import { useState, useEffect, useContext } from "react";
import { authFetch } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

function Discussions() {
  const [topic, setTopic] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const fetchDiscussions = () => {
    authFetch('/discussions')
      .then((data) => {
        if (data && data.discussions) setDiscussions(data.discussions);
      })
      .catch((err) => setError("Failed to load discussions"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const addTopic = async (e) => {
    e.preventDefault();
    if (topic.trim() === "") {
      setError("Topic cannot be empty");
      return;
    }

    setPosting(true);
    setError("");
    try {
      await authFetch('/discussions', {
        method: 'POST',
        body: JSON.stringify({ topic: topic.trim(), content: topic.trim() }),
      });
      setTopic("");
      setError("");
      fetchDiscussions();
    } catch (err) {
      setError(err.data?.message || "Error posting discussion");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>💬 Discussions Forum</h2>
      {!user && <div className="alert alert-info">Login to post discussions</div>}

      <form onSubmit={addTopic} className="card p-3 mb-4">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="input-group">
          <input 
            className="form-control"
            placeholder="Start a discussion topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={!user}
          />
          <button className="btn btn-primary" type="submit" disabled={posting || !user}>
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      <div>
        {loading && <p className="text-center text-muted">Loading discussions...</p>}
        {!loading && discussions.length === 0 && <p className="text-center text-muted">No discussions yet. Start one!</p>}
        {!loading && discussions.map((item) => (
          <div key={item.id} className="card mb-2 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{item.topic}</h5>
              <p className="card-text text-muted small">
                <strong>By:</strong> {item.name || "Anonymous"} • <strong>Date:</strong> {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discussions;
