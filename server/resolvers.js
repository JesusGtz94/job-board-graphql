export const resolvers = {
  Query: {
    job: () => ({
      id: "test-id",
      title: "Title",
      desc: "Description",
    }),
  },
};
