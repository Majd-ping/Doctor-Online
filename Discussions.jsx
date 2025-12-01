import { useState } from "react";

function Discussions() {
  const [topic, setTopic] = useState("");
  const [list, setList] = useState([]);

  const addTopic = (e) => {
    e.preventDefault();
    if (topic.trim() === "") return;

    setList([...list, topic]);
    setTopic("");
  };

  return (
    <div className="container mt-4">
      <h2>Discussions Forum</h2>

      <form onSubmit={addTopic} className="d-flex mt-3">
        <input 
          className="form-control me-2"
          placeholder="Start a discussion topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="btn btn-primary">Post</button>
      </form>

      <ul className="list-group mt-4">
        {list.map((item, index) => (
          <li key={index} className="list-group-item">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Discussions;
