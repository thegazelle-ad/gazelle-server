import React from "react"
import FalcorController from "lib/falcor/FalcorController"

// create a curried createElement that injects a
// falcor model instance into each of the falcon controllers
// also passes a flag that lets the FalcorController know
// if its a server element or not
export function injectModelCreateElement(model) {
  return (Component, props) => {
    if (Component.prototype instanceof FalcorController) {
      return <Component model={model} {...props} />
    } else {
      return <Component {...props} />
    }
  }
}

// Turns to true on the client after the first render is entirely
// completed. Should be set only by the toplevel appController
// after it has mounted
let appReady = false

export function isAppReady() {
  return appReady
}

export function setAppReady() {
  console.log("APP SET AS READY")
  appReady = true
}
