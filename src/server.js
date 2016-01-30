import express from "express"
import App from "./components/App"
import ReactDOMServer from "react-dom/server"
import React from "react"

const app = express()

app.use(express.static("static"))

app.use("*", (req, res) => {
  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <div id="main">`
          + ReactDOMServer.renderToString(<App />) +
        `</div>
        <script src="/build/client.js"></script>
      </body>
    </html>`
  )
})

app.listen(3000, err => {
  if (err) {
    console.log(err)
    return
  }

  console.log("Server started on port 3000");
})
