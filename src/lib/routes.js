import { Router, Route } from 'react-router'
import App from "../components/App"
import Counter from "../components/Counter"
import React from "react"

export default (
  <Router>
    <Route path="/" component={App}>
      <Route path="counter" component={Counter} />
    </Route>
  </Router>
)
