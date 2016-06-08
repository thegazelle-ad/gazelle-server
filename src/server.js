import express from "express"
import React from "react"
import App from "./components/App"
import { renderToString } from "react-dom/server"
import { match, RouterContext } from 'react-router'
import routes from "./lib/routes"
import FalcorController from "./lib/falcor/FalcorController"
import model from "./lib/falcor/model"
import falcor from "falcor"
import sourcemap from 'source-map-support'

sourcemap.install();


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
const renderApp = (renderProps) => {
  // create a new model for our specific application
  // make it source from the main server model
  const localModel = new falcor.Model({ source: model.asDataSource() })

  // create a curried createElement that injects this specific
  // localModel into each of the controllers in our routes
  const createElement = (Component, props) => {
    return <Component model={localModel} {...props} />
  }

  // TODO: Fetch the data
  // const falcorRoutes = []
  // for (component of renderProps.components) {
  //   if (component instanceof FalcorController) {
  //     falcorRoutes.push(component.falcorFetch())
  //   }
  // }
  //

  return buildHtmlString(
    renderToString(
      <RouterContext
        createElement={createElement}
        {...renderProps}
      />
    )
  )
}

const app = express()

app.use(express.static("static"))

app.get("*", (req, res) => {
  match({ routes, location: req.url },
    (error, redirectLocation, renderProps) => {
      console.log(renderProps)
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.serach)
      } else if (renderProps) {
        //getData(renderProps.components).then(() => {
          res.status(200).send(
            renderApp(renderProps)
          )
        //})
      } else {
        res.status(404).send("Not Found")
      }
  })
})

app.listen(3000, err => {
  if (err) {
    console.log(err)
    return
  }

  console.log("Server started on port 3000");
})

model.get(['pages', 0, "body"]).then(x => console.log(JSON.stringify(x.json)))
