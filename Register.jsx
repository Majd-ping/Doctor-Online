function Register() {
  return (
    <div className="container mt-4" style={{ maxWidth: "450px" }}>
      <h2>Create Account</h2>

      <form>
        <div className="mb-3">
          <label>Full Name</label>
          <input className="form-control" type="text" />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" />
        </div>

        <div className="mb-3">
          <label>User Type</label>
          <select className="form-control">
            <option>Patient</option>
            <option>Doctor</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" />
        </div>

        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;
