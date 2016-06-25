import React from "react";
import FalcorController from "../lib/falcor/FalcorController";
import { setAppReady } from "lib/falcor/falcorUtils";
import Navigation from "components/Navigation";
import IssueController from "components/IssueController";

// Importing static articles
import articles from "../../static/sample-issue/posts.js";

export default class AppController extends FalcorController {
  static getFalcorPath() {
    return (['appName']);
  }

  componentDidMount() {
    super.componentDidMount();
    setAppReady();
  }

  //<ArticleList key={articles.id} articles={articles} />

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
