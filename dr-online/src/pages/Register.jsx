import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!name || !email || !password) {
      setLoading(false);
      setError("Please fill all fields");
      return;
    }
    try {
      const res = await register(name, email, role, password);
      if (res && res.ok) {
        navigate("/login");
      } else {
        setError((res && res.message) || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">📋 Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
            <small className="text-muted d-block mt-1">💡 Use at least 6 characters</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Account Type</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Patient">I'm a Patient</option>
              <option value="Doctor">I'm a Doctor</option>
            </select>
          </div>

          <button className="btn btn-success w-100" type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
        </form>

        <hr className="my-4" />

        <p className="text-center text-muted">
          Already registered? <a href="/login" className="text-success fw-bold">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
