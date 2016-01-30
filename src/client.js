import React from "react"
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import routes from "./lib/routes"
import ReactDOM from "react-dom"

ReactDOM.render(
  <Router history={createBrowserHistory()} routes={routes} />,
  document.getElementById("main"))
