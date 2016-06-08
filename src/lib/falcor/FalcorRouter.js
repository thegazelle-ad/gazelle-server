import BaseRouter from "falcor-router"

export default class FalcorRouter extends BaseRouter.createClass([
  {
    route: "appName",
    get: (pathSet) => {
      return [{
        path: ["appName"],
        value: "Demo App"
      }]
    }
  },
  {
    route: "pages[{integers:pageIds}]['title', 'body']",
    get: (pathSet) => {
      return new Promise((resolve, reject) => {
        const results = []
        pathSet.pageIds.forEach((pageId) => {
          pathSet[2].forEach((field) => {
            results.push({
              path: ["pages", pageId, field],
              value: "Page " + pageId + " " + field
            })
          })
        });

        // Closure so we don't get old results
        ((results) => {
          setTimeout(() => {
            resolve(results)
          }, 2000)
        })(results);
      })
    }
  }
])
// Begin actual class methods below
{
  constructor() {
    super()
    console.log("Router Constructed")
  }
}
