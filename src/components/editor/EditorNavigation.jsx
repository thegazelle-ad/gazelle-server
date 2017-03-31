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
import LibraryBooks from 'material-ui/svg-icons/av/library-books';

export default class EditorNavigation extends BaseComponent {
  render() {
    const styles = {
      title: {
        fontSize: '20px',
      },
    };
    return (
      <div>
        <Drawer open={this.props.isNavOpen}>
          <AppBar
            title={<span style={styles.title}>Gazelle Editor Tools</span>}
            showMenuIconButton={false}
          />
          <Link to="/articles"><MenuItem leftIcon={<Description />}>Articles</MenuItem></Link>
          <Link to="/issues"><MenuItem leftIcon={<LibraryBooks />}>Issues</MenuItem></Link>
          <Link to="/authors"><MenuItem leftIcon={<Person />}>Authors</MenuItem></Link>
          <Link to="/images"><MenuItem leftIcon={<Photo />}>Images</MenuItem></Link>
        </Drawer>
      </div>
    );
  }
}

EditorNavigation.propTypes = {
  isNavOpen: React.PropTypes.bool.isRequired,
}
