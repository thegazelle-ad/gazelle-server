import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from './Alert';
import { Confirm } from './Confirm';
import EventListener from 'react-event-listener';
import { updateDisplayAlert } from 'lib/logger';

const MODAL_TYPE_ALERT = 'alert';
const MODAL_TYPE_CONFIRM = 'confirm';

export class ModalProvider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.initializeModal = this.initializeModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.displayAlert = this.displayAlert.bind(this);
    this.displayConfirm = this.displayConfirm.bind(this);
    this.confirm = this.confirm.bind(this);
    this.deny = this.deny.bind(this);

    this.resolvePromise = null;

    this.state = {
      modalOpen: false,
      modalMessage: '',
      modalType: '',
    };
  }

  getChildContext() {
    return {
      displayAlert: this.displayAlert,
      displayConfirm: this.displayConfirm,
    };
  }

  componentWillMount() {
    /** Make the logger use this prettier display function */
    updateDisplayAlert(this.displayAlert);
  }

  initializeModal(message) {
    if (this.state.modalOpen) {
      throw new Error("There is already a modal open, can't open another");
    }
    this.setState({
      modalOpen: true,
      modalMessage: message,
    });
    return new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }

  closeModal(shouldResolve = true) {
    if (!this.resolvePromise) {
      throw new Error(
        "resolvePromise should've been set in the modal initializer, but wasn't",
      );
    }
    this.setState({ modalOpen: false, modalMessage: '', modalType: '' });
    if (shouldResolve) {
      this.resolvePromise();
      this.resolvePromise = null;
    }
  }

  /**
   * Displays an alert modal
   * @param {string} message - the message to display in the alert modal
   * @returns {Promise} resolves when the user closes the alert
   */
  displayAlert(message) {
    this.setState({ modalType: MODAL_TYPE_ALERT });
    return this.initializeModal(message);
  }

  /**
   * Displays a confirm modal. If anyone in the future would like to
   * customize the text on the buttons it would be easy to pass that
   * as arguments here and store it in state
   * @param {string} message - the message to display in the confirm modal
   * @returns {Promise<boolean>} whether the user confirmed the action or not
   */
  displayConfirm(message) {
    this.setState({ modalType: MODAL_TYPE_CONFIRM });
    return this.initializeModal(message);
  }

  confirm() {
    this.closeModal(false);
    this.resolvePromise(true);
    this.resolvePromise = null;
  }

  deny() {
    this.closeModal(false);
    this.resolvePromise(false);
    this.resolvePromise = null;
  }

  catchEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const dialogProps = {
      open: this.state.modalOpen,
      message: this.state.modalMessage,
    };
    let Modal;
    switch (this.state.modalType) {
      case MODAL_TYPE_ALERT:
        dialogProps.onClose = this.closeModal;
        Modal = <Alert {...dialogProps} />;
        break;

      case MODAL_TYPE_CONFIRM:
        dialogProps.onConfirm = this.confirm;
        dialogProps.onDeny = this.deny;
        Modal = <Confirm {...dialogProps} />;
        break;

      default:
        if (this.state.modalOpen) {
          throw new Error(
            'Modal should never be open without a correct modalType set',
          );
        }
    }

    return (
      // We don't want thing's like the escape button bubbling to parent components as all interactions
      // should be paused during our modals being opened, normal event capturing didn't work so had to use
      // this library that Material UI also makes use of. Screen reader kind of buttons still seem to be able
      // to create some weird interactions, but that may be okay, could be worth looking into in the future
      // if you want to perfect it
      <div>
        {this.state.modalOpen && (
          <EventListener
            target="document"
            onKeyUp={this.catchEvent}
            onKeyDown={this.catchEvent}
            onKeyPress={this.catchEvent}
          />
        )}
        {React.Children.only(this.props.children)}
        {Modal}
      </div>
    );
  }
}

ModalProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

ModalProvider.childContextTypes = {
  displayAlert: PropTypes.func.isRequired,
  displayConfirm: PropTypes.func.isRequired,
};
