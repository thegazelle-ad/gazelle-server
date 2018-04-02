import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from './Alert';
import { Confirm } from './Confirm';

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
      <div>
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
