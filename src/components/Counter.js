import React from "react"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  increment() {
    this.setState({
      count: this.state.count + 1
    })
  }
  render() {
    return (
      <div>
        <h1>
          Counter
        </h1>
        <div>
          Counter: {this.state.count}
        </div>
        <button onClick={this.increment.bind(this)}>
          Increment counter
        </button>
      </div>
    )
  }
}
