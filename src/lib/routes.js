import { Route } from 'react-router'
import AppController from "../components/AppController"
import PageController from "../components/PageController"
import React from "react"

export default (
  <Route path="/" component={AppController}>
    <Route path="page/:id" component={PageController} />
  </Route>
)
