import { useState } from "react";
import JobList from "../components/JobList";
import { useGetJobs } from "../hooks";

const JOBS_PER_PAGE = 20;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const { jobs, loading, error } = useGetJobs(
    JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
      <div>
        <button
          disabled={!currentPage}
          onClick={() => currentPage && setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span> {currentPage + 1} </span>
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}

export default HomePage;
