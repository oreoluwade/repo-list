import { gql } from "@apollo/client";

export const REPOSITORY_QUERY = gql`
  query REPOSITORY_QUERY(
    $searchQuery: String!
    $totalNumberOfItemsToFetch: Int!
  ) {
    search(
      query: $searchQuery
      type: REPOSITORY
      first: $totalNumberOfItemsToFetch
    ) {
      repositoryCount
      pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
      nodes {
        ... on Repository {
          id
          name
          forkCount
          stargazerCount
        }
      }
    }
  }
`;
