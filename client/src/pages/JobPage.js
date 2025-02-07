import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useGetJob } from "../hooks";

function JobPage() {
  const { jobId } = useParams();
  const { job, loading, error } = useGetJob(jobId);

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1 className="title is-2">{job.title}</h1>
        <h2 className="subtitle is-4">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">
          <div className="block has-text-grey">
            Posted: {formatDate(job.date, "long")}
          </div>
          <p className="block">{job.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default JobPage;
