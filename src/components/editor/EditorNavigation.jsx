import React from 'react';
import BaseComponent from 'lib/BaseComponent';

// material-ui
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

export default class EditorNavigation extends BaseComponent {
  render() {
    const Logged = () => (
      <FlatButton label="Sign Out" />
    );

    const Login = () => (
      <FlatButton label="Log In" />
    );

    return (
      <div>
        <AppBar
          title={this.props.title}
          iconElementRight={this.state.logged ? <Logged /> : <Login />}
        />
      </div>
    );
  }
}

EditorNavigation.propTypes = {
  title: React.PropTypes.string,
}
