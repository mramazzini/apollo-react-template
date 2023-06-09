import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Auth from "./components/utils/auth";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
let httpLink;
// Construct our main GraphQL API endpoint
if (process.env.NODE_ENV === "production") {
  httpLink = createHttpLink({
    uri: "input your heroku server here",
    //uri: "/graphql",
  });
} else {
  httpLink = createHttpLink({
    uri: "http://localhost:3001/graphql",
    //uri: "/graphql",
  });
}
// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  defaultOptions: {
    mutate: {
      // Set `omitTypename` to `true` to automatically remove `__typename` from mutation requests
      // This option is available in Apollo Client v3.4.0 or later
      omitTypename: true,
    },
  },
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

// surround a component with the `RequireAuth` component to require authentication to access the component
function RequireAuth({ children }) {
  return Auth.loggedIn() === true ? children : <Navigate to="/login" replace />;
}
function App() {
  const [currentForm, setCurrentForm] = useState("Login");

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <ApolloProvider client={client}>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
