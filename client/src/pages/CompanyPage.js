import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/grapql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    getCompany(companyId)
      .then(setCompany)
      .catch(() => setError(true));
  }, [companyId]);

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  if (!company) {
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
