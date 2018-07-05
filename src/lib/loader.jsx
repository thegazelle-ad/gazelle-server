import { has, isClient } from 'lib/utilities';
import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import classnames from 'classnames';

// loading requests end up here for 100ms. If the time elapses, they make it
// into the real loading queue. If is cleared before 100ms (maybe because data
// is cached locally), it does not fire the loading callbacks at all.
const loadingCache = {};
// Called when loading is changed
const loadingChangeCallbacks = [];
// Called when it's time to transition something out
const transitionOutCallbacks = [];

// Time for both transition out and transition in
const TRANSITION_OUT_TIME = 200;
const TRANSITION_IN_TIME = 200;

// Let the global state know that this named unit is starting or stopping
// loading.  Name can be any string. You can call setLoading(true) many times
// idempotently, but setLoading(false) will globally clear all loading for the
// named element.
export function setLoading(name, isLoadingBool) {
  if (!isClient()) {
    return;
  }

  if (!name || typeof name !== 'string') {
    throw new Error('setLoading must be called with a string name');
  }

  if (isLoadingBool) {
    const loadingWasEmpty = Object.keys(loadingCache).length === 0;
    // Take it off the queue and put it onto real loading
    loadingCache[name] = true;
    // Check if we need to fire the callback
    if (loadingWasEmpty) {
      loadingChangeCallbacks.forEach(cb => {
        cb(true);
      });
    }
  } else {
    const loadingWasEmpty = Object.keys(loadingCache).length === 0;
    if (has.call(loadingCache, name)) {
      delete loadingCache[name];
    }
    const loadingIsEmpty = Object.keys(loadingCache).length === 0;

    if (!loadingWasEmpty && loadingIsEmpty) {
      loadingChangeCallbacks.forEach(cb => {
        cb(false);
      });
    }
  }
}

// FalcorController components under a TransitionManager will get a
// componentWillLeave call with a callback which actually dissapears the component.
// This will handle calling that leaveCallback at the appropriate time (which
// is when the data is done).
export function signalLeaving(leaveCallback) {
  transitionOutCallbacks.forEach(cb => {
    cb(leaveCallback);
  });
}

// Pass a function in which will be called when the loading state has changed.
// Callback is loadingChangeCallback(isLoading). There is currently no
// unregister function, so this will pin your function to memory.
export function registerLoaderCallback(newLoadingChangeCallback) {
  if (!isClient()) {
    return;
  }
  if (
    !newLoadingChangeCallback ||
    typeof newLoadingChangeCallback !== 'function'
  ) {
    throw new Error('argument of registerLoaderCallback must be a function');
  }

  loadingChangeCallbacks.push(newLoadingChangeCallback);
}

// Pass a function in which will be called when it's time to
// transition out the current element.
export function registerTransitionOutCallback(newTransitionOutCallback) {
  if (!isClient()) {
    return;
  }
  if (
    !newTransitionOutCallback ||
    typeof newTransitionOutCallback !== 'function'
  ) {
    throw new Error('argument of registerLoaderCallback must be a function');
  }

  transitionOutCallbacks.push(newTransitionOutCallback);
}

// One time check to see if we are currently loading something in the app
export function isLoading() {
  if (!isClient()) {
    return false;
  }
  return Object.keys(loadingCache).length !== 0;
}

export class TransitionManager extends BaseComponent {
  constructor(props) {
    super(props);
    // This is a state machine. Only one can be true at a time.
    this.safeSetState({
      mode: null,
    });
    this.mode = null;
    // Node that will have a delayed transition out
    this.visibleTransitionOut = null;
  }

  componentDidMount() {
    super.componentDidMount();
    registerLoaderCallback(this.loadStatusChange.bind(this));
    registerTransitionOutCallback(this.handleLeaveCallback.bind(this));
  }

  changeMode(mode) {
    this.mode = mode;
    this.safeSetState({
      mode,
    });

    switch (mode) {
      case 'rest':
      case 'loading':
        break;
      case 'loadEnding':
        this.delayedModeChange(
          'loadEnding',
          'fadingStart',
          TRANSITION_OUT_TIME,
        );
        break;
      case 'fadingStart':
        if (this.visibleTransitionOut) {
          this.visibleTransitionOut();
          this.visibleTransitionOut = null;
        }
        this.delayedModeChange('fadingStart', 'fadingIn', 10);
        break;
      case 'fadingIn':
        window.scrollTo(0, 0);
        this.delayedModeChange('fadingIn', 'rest', TRANSITION_IN_TIME);
        break;
      default:
      // do nothing
    }
  }

  delayedModeChange(fromMode, toMode, delay) {
    setTimeout(() => {
      if (this.mode === fromMode) {
        this.changeMode(toMode);
      }
    }, delay);
  }

  loadStatusChange(loading) {
    if (loading) {
      this.changeMode('loading');
    } else {
      this.changeMode('loadEnding');
    }
  }

  // Causes the current component queued to leave to actually leave.
  handleLeaveCallback(leaveCallback) {
    if (leaveCallback) {
      switch (this.mode) {
        case 'rest':
          this.visibleTransitionOut = leaveCallback;
          this.changeMode('loadEnding');
          break;
        case 'loading':
          if (this.visibleTransitionOut) {
            leaveCallback();
          } else {
            this.visibleTransitionOut = leaveCallback;
          }
          break;
        case 'loadEnding':
        case 'fadingStart':
          leaveCallback();
          break;
        case 'fadingIn':
          this.visibleTransitionOut = leaveCallback;
          this.changeMode('loadEnding');
          break;
        default:
        // do nothing
      }
    }
  }

  render() {
    const classes = classnames('transition-manager', {
      'loading-instance': this.state.mode === 'loading',
      'load-ending': this.state.mode === 'loadEnding',
      'fading-start': this.state.mode === 'fadingStart',
    });
    return <div className={classes}>{this.props.children}</div>;
  }
}
