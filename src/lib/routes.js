import { Route } from 'react-router'
import App from "../components/App"
import Counter from "../components/Counter"
import PageController from "../components/PageController"
import React from "react"

export default (
  <Route path="/" component={App}>
    <Route path="counter" component={Counter} />
    <Route path="page/:id" component={PageController} />
  </Route>
)
