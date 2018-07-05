import React from 'react';

import { has } from 'lib/utilities';

const shallowEquals = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  return keysA.every(key => has.call(objB, key) && objA[key] === objB[key]);
};

// Abstract class with utility functions
export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    if (this.constructor === BaseComponent) {
      throw new TypeError('BaseComponent is abstract');
    }
    this.state = {};
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  // Pure render by default
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEquals(nextProps, this.props) ||
      !shallowEquals(nextState, this.state)
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Set state that only triggers an update if the component is mounted.
   * This is so that if falcor returns after the component has unmounted
   * it won't throw errors.
   * See [the React docs]{@link https://facebook.github.io/react/docs/react-component.html#setstate}
   * for more details about this.setState
   * @param {(Object|Function)} updater
   * @param {Function} cb - We don't support this callback due to working with Falcor
   */
  safeSetState(updater, cb) {
    if (cb) {
      throw new Error(
        'We do not support the callback to setState ' +
          'in this codebase, you can probably use componentDidUpdate instead',
      );
    }
    if (this.mounted) {
      this.setState(updater);
    } else {
      let updaterObject = updater;
      if (typeof updater === 'function') {
        updaterObject = updater(this.state, this.props);
      }
      this.state = Object.assign({}, this.state, updaterObject);
    }
  }
}
