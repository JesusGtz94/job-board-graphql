import { useParams } from "react-router";
import { companyByIdQuery } from "../lib/grapql/queries";
import JobList from "../components/JobList";
import { useQuery } from "@apollo/client";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  });

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const { company } = data;

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
