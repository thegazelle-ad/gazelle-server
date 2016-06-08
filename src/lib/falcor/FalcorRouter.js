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
  }
])
// Begin actual class methods below
{
  constructor() {
    super()
    console.log("Router Constructed")
  }
}
