import React from "react"
import { Router, browserHistory } from 'react-router'
import routes from "./lib/routes"
import ReactDOM from "react-dom"

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById("main"))
