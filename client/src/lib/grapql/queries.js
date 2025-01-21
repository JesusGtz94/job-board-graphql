import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export const createJob = async ({ title, desc }) => {
  const mutation = gql`
    mutation ($job: CreateJobInput!) {
      job: createJob(job: $job) {
        id
      }
    }
  `;

  const {
    job: { id },
  } = await client.request(mutation, { job: { title, desc } });
  return id;
};

export const getJobs = async () => {
  const query = gql`
    query {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  const { jobs } = await client.request(query);
  return jobs;
};

export const getJob = async (id) => {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        date
        desc
      }
    }
  `;

  const { job } = await client.request(query, { id });
  return job;
};

export const getCompany = async (id) => {
  const query = gql`
    query ($id: ID!) {
      company(id: $id) {
        id
        name
        desc
        jobs {
          id
          title
          date
          desc
        }
      }
    }
  `;

  const { company } = await client.request(query, { id });
  return company;
};
