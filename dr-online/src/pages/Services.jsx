import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    authFetch('/services')
      .then((data) => {
        if (mounted && data && data.services) setServices(data.services);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Our Services</h2>

      <div className="mt-3">
        {loading && <p>Loading services...</p>}
        {!loading && services.length === 0 && <p>No services available.</p>}
        {!loading && services.map((service) => (
          <div key={service.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
