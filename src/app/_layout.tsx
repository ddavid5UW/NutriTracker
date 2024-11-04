import { Stack } from "expo-router";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://alayotes.us-east-a.ibm.stepzen.net/api/mollified-buffoon/__graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "apikey alayotes::local.net+1000::8af6cc6f7cc13822193d7bf2acb43c210d128fb1116cef7a82b5307155516c49",
  },
});

const RootLayout = () => {
  return (
    <ApolloProvider client={client}>
      <Stack />
    </ApolloProvider>
  );
};

export default RootLayout;
