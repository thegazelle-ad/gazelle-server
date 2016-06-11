import React from 'react'
import { Link } from "react-router"
import FalcorController from "../lib/falcor/FalcorController"
import { setAppReady } from "lib/falcor/falcorUtils"
import Navigation from '../components/Navigation';

export default class AppController extends FalcorController {
  static getFalcorPath() {
    return (['appName']);
  }

  componentDidMount() {
    super.componentDidMount();
    setAppReady();
  }

  render() {
    return (
      <div>
        <Navigation appName={this.state.data.appName} />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
