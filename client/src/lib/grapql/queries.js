import {
  ApolloClient,
  gql,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken)
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    date
    desc
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
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

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const createJobMutation = gql`
  mutation ($job: CreateJobInput!) {
    job: createJob(job: $job) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const createJob = async ({ title, desc }) => {
  const { data } = await apolloClient.mutate({
    mutation: createJobMutation,
    variables: { job: { title, desc } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return data.job.id;
};

export const getJobs = async () => {
  const { data } = await apolloClient.query({
    query: jobsQuery,
    fetchPolicy: "network-only",
  });
  return data.jobs;
};

export const getJob = async (id) => {
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });
  return data.job;
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

  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
};
