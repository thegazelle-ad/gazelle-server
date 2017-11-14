import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { Link } from 'react-router';

// material-ui
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Description from 'material-ui/svg-icons/action/description';
import Person from 'material-ui/svg-icons/social/person';
import Photo from 'material-ui/svg-icons/image/photo';
import Info from 'material-ui/svg-icons/action/info';
import LibraryBooks from 'material-ui/svg-icons/av/library-books';

const styles = {
  title: {
    fontSize: '20px',
  },
};

export default class EditorNavigation extends BaseComponent {
  render() {
    return (
      <div>
        <Drawer open={this.props.isNavOpen} zDepth={2}>
          <AppBar
            title={<span style={styles.title}>Gazelle Editor Tools</span>}
            showMenuIconButton={false}
          />
          <Link to="/articles"><MenuItem leftIcon={<Description />}>Articles</MenuItem></Link>
          <Link to="/issues"><MenuItem leftIcon={<LibraryBooks />}>Issues</MenuItem></Link>
          <Link to="/authors"><MenuItem leftIcon={<Person />}>Authors</MenuItem></Link>
          <Link to="/images/upload"><MenuItem leftIcon={<Photo />}>Images</MenuItem></Link>
          <Link to="/readme"><MenuItem leftIcon={<Info />}>Readme</MenuItem></Link>
        </Drawer>
      </div>
    );
  }
}

EditorNavigation.propTypes = {
  isNavOpen: React.PropTypes.bool.isRequired,
};
