import { getCompany } from "./db/companies.js";
import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";

export const resolvers = {
  Query: {
    jobs: getJobs,
    job: (_root, { id }) => getJob(id),
    company: (_root, { id }) => getCompany(id),
  },

  Job: {
    date: ({ createdAt }) => createdAt.split("T")[0],
    company: ({ companyId }) => getCompany(companyId),
    desc: ({ description }) => description,
  },

  Company: {
    desc: ({ description }) => description,
    jobs: ({ id }) => getJobsByCompany(id),
  },
};
