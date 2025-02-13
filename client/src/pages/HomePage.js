import { useState } from "react";
import JobList from "../components/JobList";
import { useGetJobs } from "../hooks";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 20;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useGetJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs.jobs} />
    </div>
  );
}

export default HomePage;
