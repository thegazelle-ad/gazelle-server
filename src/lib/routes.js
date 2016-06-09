import { Route } from 'react-router'
import AppController from "AppController"
import PageController from "PageController"
import React from "react"

export default (
  <Route path="/" component={AppController}>
    <Route path="page/:id" component={PageController} />
  </Route>
)
