import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {

  render() {

    // Render all categories in nav bar
    let renderCategories = () => {
      let categories = ["opinion", "features", "news"];
      let data = [];

      categories.forEach(function(category) {
        data.push(
          <li key={category}><Link to={"/category/"+category}>{category}</Link></li>
        )
      });

      return data
    }

    return (
      <div>
        <h1>{this.props.appName}</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          {renderCategories()}
        </ul>
      </div>
    )
  }
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
}
