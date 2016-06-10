import { Route } from 'react-router'
import React from "react"
import AppController from "components/AppController"
import PageController from "components/PageController"

export default (
  <Route path="/" component={AppController}>
    <Route path="page/:id" component={PageController} />
  </Route>
)
