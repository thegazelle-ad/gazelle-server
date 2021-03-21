import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from 'react-router';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import ListItem from 'material-ui/List/ListItem';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';

import ContentAdd from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

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
    this.safeSetState({
      listOfNetIDs: ['abc72', 'abd94', 'bde32', 'cd232', 'de23', 'di23823', 'ef237'],
      currentlyHoveredElement: -1
    })
  }

  static getFalcorPathSets() {
    return [];
  }

  render() {
    const netIDList = this.state.listOfNetIDs 
    if (this.state.listOfNetIDs) {
      return (
        <div>
          <h1>Access</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <div style={styles.tabs}>
              <h2> List of NetIDS with access </h2>

              <Paper style={styles.paper} zDepth={1} id='cat'>
                <List style={{ overflow: 'auto', maxHeight: '250px' }}>
                  <Subheader>NetIDs</Subheader>
                  {netIDList.map((netid, index)=>
                    (<ListItem 
                      primaryText={netid}
                      style={{
                        height: 56,
                      }}
                      innerDivStyle={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px 0px 0px 16px',
                        height: 56,
                      }}
                      onMouseEnter={() => this.setState({ currentlyHoveredElement: index })}
                      onMouseLeave={() => this.setState({ currentlyHoveredElement: -1 })}
                    >
                      {this.state.currentlyHoveredElement === index ?
                        <div
                          style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'red',
                          height: 56,
                          width: 56,
                        }}
                        >
                          <DeleteIcon color='white' /> 
                        </div>
                        : <div />
                      }
                     </ListItem>)
                  )}
                </List>
              </Paper>

              <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <RaisedButton
                  label="Apply Changes"
                  type="submit"
                  primary
                  style={styles.buttons}
                  disabled={false}
                />
                <Link to='/'>
                  <RaisedButton
                    primary
                    style={styles.buttons}
                  >
                    <ContentAdd color="white" />
                  </RaisedButton>
                </Link>
              </div>
            </div>
            <Divider />
          </Paper>
          {this.props.children}
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
