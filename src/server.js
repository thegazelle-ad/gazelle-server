import express from "express"
import React from "react"
import { renderToString } from "react-dom/server"
import { match, RouterContext } from 'react-router'
import routes from "./lib/routes"
import FalcorController from "./lib/falcor/FalcorController"
import model from "./lib/falcor/model"
import falcor from "falcor"
import sourcemap from "source-map-support"
import _ from "lodash"

sourcemap.install()


const buildHtmlString = (body) => {
  return (
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <div id="main">`
            + body +
          `</div>
          <script src="/build/client.js"></script>
        </body>
      </html>`
  )
}

// Asynchronously render this application
// Returns a promise
const renderApp = (renderProps) => {
  // create a new model for our specific application
  // make it source from the main server model
  const localModel = new falcor.Model({ source: model.asDataSource() }).batch()

  // create a curried createElement that injects this specific
  // localModel into each of the controllers in our routes
  const createElement = (Component, props) => {
    return <Component isServer={true} model={localModel} {...props} />
  }

  const app = (
    <RouterContext
      createElement={createElement}
      {...renderProps}
    />
  )

  const falcorPaths = _.compact(renderProps.routes.map((route) => {
    const component = route.component
    if (component.prototype instanceof FalcorController) {
      return component.getFalcorPath(renderProps.params)
    }
    return null
  }))
  
  return localModel.preload(...falcorPaths).then((x) => {
    return (
      buildHtmlString(
        renderToString(
          app
        )
      )
    )
  })
}

const server = express()

server.use(express.static("static"))

server.get("*", (req, res) => {
  match({ routes, location: req.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.serach)
      } else if (renderProps) {
        renderApp(renderProps).then((html) => {
          res.status(200).send(html)
        }).catch((err) => {
          console.error("Failed to render: " + req.url)
          console.error(err.stack)
          res.status(500).send(err.stack)
        })
      } else {
        res.status(404).send("Not Found")
      }
  })
})

server.listen(3000, err => {
  if (err) {
    console.error(err)
    return
  }

  console.log("Server started on port 3000");
})
