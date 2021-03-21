import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from 'react-router';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import ContentAdd from 'material-ui/svg-icons/content/add';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

const styles = {
  paper: {
    height: '100%',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'left',
    display: 'inline-block',
  },
  tabs: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15,
  },
  buttons: {
    marginTop: 24,
    marginBottom: 12,
  },
  staffMenu: {
    display: 'inline-block',
    margin: 0,
  },
};

class AccessController extends FalcorController {
  constructor(props) {
    super(props);
    this.setState({
      listOfNetIDS: ['abc72', 'abd94']
    })
  }

  static getFalcorPathSets() {
    return [];
  }

  render() {
    if (this.state.ready) {
      return (
        <div>
          <h1>Access</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <div style={styles.tabs}>
              <h2> List of NetIDS with access </h2>

            </div>
            <Divider />
          </Paper>
          {this.props.children}
          <RaisedButton
            label="Apply Changes"
            type="submit"
            primary
            style={styles.buttons}
            disabled={false}
          />
          <Link to='/'>
            <FloatingActionButton
              style={{
                position: 'fixed',
                zIndex: 50,
                bottom: '50px',
                right: '100px',
              }}
            >
            <ContentAdd />
            </FloatingActionButton>
          </Link>
          <br />
        </div>
      );
    }

    return (
      <div className="circular-progress">
        <CircularProgress />
        {this.props.children}
      </div>
    );
  }
}

const EnhancedAccessController = withModals(AccessController);
export { EnhancedAccessController as AccessControl };
