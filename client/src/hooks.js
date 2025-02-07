import { useQuery } from "@apollo/client";
import {
  companyByIdQuery,
  jobByIdQuery,
  jobsQuery,
} from "./lib/grapql/queries";

export function useGetCompany(id) {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}

export function useGetJob(id) {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { id },
  });

  return { job: data?.job, loading, error: Boolean(error) };
}

export function useGetJobs() {
  const { data, error, loading } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
  });

  return { jobs: data?.jobs, loading, error: Boolean(error) };
}
