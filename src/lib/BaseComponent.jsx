import React from 'react';

const shallowEquals = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  let keysA = Object.keys(objA);
  let keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  return keysA.every((key) => {
    return (objB.hasOwnProperty(key) && objA[key] === objB[key]);
  });
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
    return (!shallowEquals(nextProps, this.props)
      || !shallowEquals(nextState, this.state));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // Set state that only triggers an update if the component is mounted
  // This is so that falcor returns after the component has unmounted
  // don't throw errors
  safeSetState(newState) {
    if (this.mounted) {
      this.setState(newState);
    } else {
      Object.assign(this.state, newState);
    }
  }
}
