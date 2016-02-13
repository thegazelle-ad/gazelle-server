import React from "react"

// Abstract class for fetching falcor objects
export default class FalcorController extends React.Component {
  fetchData() {
    console.log("Falcor controller fetch")
  }
  constructor(props) {
    super(props)
    if (this.constructor == FalcorController) {
      throw new TypeError("FalcorController is abstract")
    }
    this.fetchData()
  }
}
