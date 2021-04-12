import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { updateFieldValue } from './lib/form-field-updaters';

// material-ui
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import ListItem from 'material-ui/List/ListItem';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';

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
    this.fieldUpdaters = {
      name: updateFieldValue.bind(this, 'newName', undefined),
      newNetID: updateFieldValue.bind(this, 'newNetID', undefined),
    };
    this.safeSetState({
      listOfAdmins: [
        { name: 'John Doe', netid: 'abc72' },
        { name: 'Jun Ooi', netid: 'jmo460' },
        { name: 'Twinings', netid: 'twns37' },
        { name: 'Darjeeling', netid: 'djl01' },
        { name: 'Oolong Tea', netid: 'ool1' },
        { name: 'Jane Doe', netid: 'jd83' },
      ],
      listOfDeletedNetIDs: [],
      listOfCreatedNetIDs: [],

      currentlyHoveredElement: -1,
      showAddNewModal: false,

      newName: "",
      newNetID: "",
      newlyAddedNetID: "",
    });

    this.handleModalClose = this.handleModalClose.bind(this);
  }

  addNewAdmin() {
    const newAdmin = { name: this.state.newName, netid: this.state.newNetID };
    this.setState({ listOfAdmins: [ ...this.state.listOfAdmins, newAdmin ] });

    // to display the latest added admin for 2 secs
    this.setState({ newlyAddedNetID: newAdmin.netid });
    setTimeout(() => this.setState({ newlyAddedNetID: "" }), 2000)
  }

  handleModalClose() {
    this.setState({ showAddNewModal: false, newName: "", newNetID: "" });
  }

  handleChanges() {

  }

  markForDeletion(netid) {
    this.state.listOfDeletedNetIDs.push(netid)
  }

  unmarkForDeletion(netid) {
    const newArrWithoutNetID = this.state.listOfDeletedNetIDs.filter(x => x !== netid)
    this.setState({ listOfDeletedNetIDs: newArrWithoutNetID })
  }

  static getFalcorPathSets() {
    return [];
  }

  render() {
    const bothFormsFilled = this.state.newNetID && this.state.newName;

    const adminList = this.state.listOfAdmins;
    if (adminList) { // might take time to load from DB
      return (
        <div>
          <Dialog
            title="Add new admin"
            open={this.state.showAddNewModal}
            autoScrollBodyContent
            onRequestClose={() => this.handleModalClose()}
            contentStyle={{ width: '40%', margin: 'auto' }}
          >
            <TextField
              value={this.state.newName}
              floatingLabelText="Name"
              onChange={this.fieldUpdaters.name}
            />
            <br />
            <TextField
              value={this.state.newNetID}
              floatingLabelText="NetID"
              onChange={this.fieldUpdaters.newNetID}
            />
            <br />
            <RaisedButton
              label="Add"
              type="submit"
              primary
              disabled={!bothFormsFilled}
              style={styles.buttons}
              onClick={() => this.addNewAdmin()}
            />
            { this.state.newlyAddedNetID && <span>Added {this.state.newlyAddedNetID}</span> }
          </Dialog>
    

          <h1>Access</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <div style={styles.tabs}>
              <h2> List of NetIDS with access </h2>

              <Paper style={styles.paper} zDepth={1} id="cat">
                <List style={{ overflow: 'auto', maxHeight: '250px' }}>
                  <Subheader>NetIDs</Subheader>
                  {adminList.map((admin, index) => {
                    if (this.state.listOfDeletedNetIDs.includes(admin.netid)) {
                      return (
                        <ListItem
                          primaryText={`${admin.name} - ${admin.netid}`}
                          style={{
                            height: 56,
                            backgroundColor: '#f7c3be' // TOFIX: hover colour does not change
                          }}
                          innerDivStyle={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px 0px 0px 16px',
                            height: 56,
                          }}
                          onMouseEnter={() =>
                            this.setState({ currentlyHoveredElement: index })
                          }
                          onMouseLeave={() =>
                            this.setState({ currentlyHoveredElement: -1 })
                          }
                        >
                          {this.state.currentlyHoveredElement === index ? (
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: 'none',
                                justifyContent: 'center',
                                padding: '0px 10px',
                                backgroundColor: 'lightgray',
                                height: 56,
                              }}
                              onClick={() => this.unmarkForDeletion(admin.netid)}
                            >
                              Cancel
                            </button>
                          ) : (
                            <div />
                          )}
                        </ListItem>
                      )
                    } 
                      return (
                      <ListItem
                        primaryText={`${admin.name} - ${admin.netid}`}
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
                        onMouseEnter={() =>
                          this.setState({ currentlyHoveredElement: index })
                        }
                        onMouseLeave={() =>
                          this.setState({ currentlyHoveredElement: -1 })
                        }
                      >
                        {this.state.currentlyHoveredElement === index ? (
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: 'none',
                              justifyContent: 'center',
                              backgroundColor: 'red',
                              height: 56,
                              width: 56,
                            }}
                            onClick={() => this.markForDeletion(admin.netid)}
                          >
                            <DeleteIcon color="white" />
                          </button>
                        ) : (
                          <div />
                        )}
                      </ListItem>)
                    }
                      
                    )}
                </List>
              </Paper>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <RaisedButton
                  label="Apply Changes"
                  type="submit"
                  primary
                  style={styles.buttons}
                  disabled={false}
                  onClick={() => this.handleChanges()}
                />
                <RaisedButton 
                  label="Add New"
                  primary
                  style={styles.buttons}
                  disabled={false}
                  onClick={() => this.setState({ showAddNewModal: true })}
                />
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
export { EnhancedAccessController as AccessController };
