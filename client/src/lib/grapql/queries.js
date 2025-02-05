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

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export const createJob = async ({ title, desc }) => {
  const mutation = gql`
    mutation ($job: CreateJobInput!) {
      job: createJob(job: $job) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { job: { title, desc } },
  });
  return data.job.id;
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

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return data.jobs;
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

  const { data } = await apolloClient.query({ query, variables: { id } });
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
