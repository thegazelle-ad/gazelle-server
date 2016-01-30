import { Router, Route } from 'react-router'
import App from "../components/App"
import Counter from "../components/Counter"
import Page from "../components/Page"
import React from "react"

export default (
  <Router>
    <Route path="/" component={App}>
      <Route path="counter" component={Counter} />
      <Route path="page/:id" component={Page} />
    </Route>
  </Router>
)
