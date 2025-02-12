import { getCompany } from "./db/companies.js";
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
  countJobs,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      const jobs = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { jobs, totalCount };
    },
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
    updateJob: async (__root, { job: { id, title, desc } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const job = updateJob({
        id,
        title,
        description: desc,
        companyId: user.companyId,
      });

      if (!job) {
        throw notFoundError("No job found with id " + id);
      }

      return job;
    },
  },

  Job: {
    date: ({ createdAt }) => createdAt.split("T")[0],
    company: ({ companyId }, _args, { companyLoader }) => {
      return companyLoader.load(companyId);
    },
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
