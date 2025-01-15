import { getCompany } from "./db/companies.js";
import { getJobs, getJob } from "./db/jobs.js";

export const resolvers = {
  Query: {
    jobs: getJobs,
    job: (_root, { id }) => getJob(id),
  },

  Job: {
    date: ({ createdAt }) => createdAt.split("T")[0],
    company: ({ companyId }) => getCompany(companyId),
    desc: ({ description }) => description,
  },

  Company: {
    desc: ({ description }) => description,
  },
};
