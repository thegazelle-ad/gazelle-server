import React from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'lib/higher-order-helpers';

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
