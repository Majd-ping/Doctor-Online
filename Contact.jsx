function Contact() {
  return (
    <div className="container mt-4">
      <h2>Contact Us</h2>

      <form className="mt-3">
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" type="text" placeholder="Your name" />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" placeholder="Your email" />
        </div>

        <div className="mb-3">
          <label>Message</label>
          <textarea className="form-control" rows="4"></textarea>
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
