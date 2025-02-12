import { useMutation, useQuery } from "@apollo/client";
import {
  companyByIdQuery,
  createJobMutation,
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

export function useGetJobs(limit, offset) {
  const { data, error, loading } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
    variables: { limit, offset },
  });

  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, desc) => {
    const {
      data: { job },
    } = await mutate({
      variables: { job: { title, desc } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    return job;
  };

  return { createJob, loading };
}
