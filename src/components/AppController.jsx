import React from "react";
import FalcorController from "../lib/falcor/FalcorController";
import { setAppReady } from "lib/falcor/falcorUtils";

// Components
import Navigation from "components/Navigation";
import Footer from "components/Footer";

// Importing static articles
import articles from "../../static/sample-issue/posts.js";

// Application CSS; applicationStyles alias,
// CSS, SCSS, and Style loaders in webpack.config.js
require('applicationStyles');

export default class AppController extends FalcorController {
  static getFalcorPathSets() {
  }

  componentDidMount() {
    super.componentDidMount();
    setAppReady();
  }

  render() {
    return (
      <div className="app-container">
        <div className="app-container__header">
          <Navigation appName={"The Gazelle"} />
        </div>
        <div className="app-container__body">
          {this.props.children}
        </div>
        <div className="app-container__footer">
          <Footer />
        </div>
      </div>
    );
  }
}
