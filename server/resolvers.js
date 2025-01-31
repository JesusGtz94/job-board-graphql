import { getCompany } from "./db/companies.js";
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: getJobs,
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No job found with id " + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No company found with id" + id);
      }
      return company;
    },
  },

  Mutation: {
    createJob: (__root, { job: { title, desc } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      return createJob({ title, description: desc, companyId: user.companyId });
    },
    deleteJob: async (__root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = await deleteJob(id, user.companyId);

      if (!job) {
        throw notFoundError("No job found with id " + id);
      }

      return job;
    },
    updateJob: (__root, { job: { id, title, desc } }) => {
      try {
        return updateJob({ id, title, description: desc });
      } catch {
        throw notFoundError("Not found job with id: " + id);
      }
    },
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

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
}
