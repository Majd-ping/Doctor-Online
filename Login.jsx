import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>

      <form>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" />
        </div>

        <button className="btn btn-primary w-100">Login</button>
      </form>

      <p className="mt-3">
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
