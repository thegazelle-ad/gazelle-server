import React from "react"
import ReactDOM from "react-dom"
import { Router, browserHistory } from 'react-router'
import falcor from "falcor"
import routes from "lib/routes"
import FalcorController from "lib/falcor/FalcorController"
import { injectModelCreateElement } from "lib/falcor/falcorUtils"

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
