import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, RaisedButton, FlatButton, SvgIcon } from 'material-ui';

import { getDisplayName } from 'lib/higher-order-helpers';

const MODAL_TYPE_ALERT = 'alert';
const MODAL_TYPE_CONFIRM = 'confirm';

const AlertIcon = props => (
  <SvgIcon style={{ fill: '#ff5d00', width: props.size, height: props.size }}>
    <path d="M11 16h2v2h-2z" />
    <path d="M13.516 10h-3L11 15h2z" />
    <path d="M12.017 5.974L19.537 19H4.497l7.52-13.026m0-2.474c-.545 0-1.09.357-1.5 1.07L2.53 18.403C1.705 19.833 2.38 21 4.03 21H20c1.65 0 2.325-1.17 1.5-2.6L13.517 4.575c-.413-.715-.956-1.072-1.5-1.072z" />
  </SvgIcon>
);

AlertIcon.propTypes = {
  size: PropTypes.string,
};

AlertIcon.defaultProps = {
  size: '24px',
};

export class ModalProvider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.initializeModal = this.initializeModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.displayAlert = this.displayAlert.bind(this);
    this.displayConfirm = this.displayConfirm.bind(this);
    this.confirm = this.confirm.bind(this);
    this.deny = this.deny.bind(this);
    this.createModalRef = this.createModalRef.bind(this);

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

  createModalRef(ref) {
    this.modalRef = ref;
  }

  render() {
    let actionButtons;
    if (this.state.modalType === MODAL_TYPE_ALERT) {
      actionButtons = [<FlatButton label="Ok" onClick={this.closeModal} />];
    } else if (this.state.modalType === MODAL_TYPE_CONFIRM) {
      actionButtons = [
        <RaisedButton label="Yes" primary onClick={this.confirm} />,
        <RaisedButton label="No" primary onClick={this.deny} />,
      ];
    } else if (this.state.modalOpen) {
      throw new Error('Modal should never be open without a modalType set');
    }

    return (
      <div>
        {React.Children.only(this.props.children)}
        <Dialog
          open={this.state.modalOpen}
          modal
          // Reset the style so we can do what we want with it
          contentStyle={{ maxWidth: '500px' }}
        >
          <div
            style={{ width: '500px', margin: 'auto' }}
            ref={this.createModalRef}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AlertIcon size="150px" />
            </div>
            <div style={{ textAlign: 'center' }}>{this.state.modalMessage}</div>
            <FlatButton style={{ margin: 'auto' }} label="Ok" />
          </div>
        </Dialog>
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

export const withModals = Component => {
  const componentWithModal = (props, context) => (
    <Component
      displayAlert={context.displayAlert}
      displayConfirm={context.displayConfirm}
      {...props}
    />
  );

  componentWithModal.displayName = `withModals(${getDisplayName(Component)})`;

  componentWithModal.contextTypes = {
    displayAlert: PropTypes.func.isRequired,
    displayConfirm: PropTypes.func.isRequired,
  };

  return componentWithModal;
};
