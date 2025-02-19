import { useParams } from "react-router";
import JobList from "../components/JobList";
import { useGetCompany } from "../hooks";

function CompanyPage() {
  const { companyId } = useParams();
  const { company, error, loading } = useGetCompany(companyId);

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.desc}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
