import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/grapql/queries";

function HomePage() {
  const [jobs, setJobs] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setError("An error occurred."));
  }, []);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      {!jobs && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {jobs && <JobList jobs={jobs} />}
    </div>
  );
}

export default HomePage;
