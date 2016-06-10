import React from "react"
import { Router, browserHistory } from 'react-router'
import routes from "routes"
import ReactDOM from "react-dom"
import FalcorController from "FalcorController"
import { injectModelCreateElement } from "falcorUtils"
import falcor from "falcor"

let clientModel = new falcor.Model()

// _initialCache is a global exposed by the first server side render
clientModel.setCache(_initialCache)

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
    createElement={injectModelCreateElement(clientModel)}
    />,
  document.getElementById("main"))
