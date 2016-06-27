// TODO: Add Jest Testing
export function debounce (func, timeout) {
  let scheduled = false;
  let lastCalled = null;
  let debouncedFunction = function () {
    let now = new Date();
    if (lastCalled === null || now - lastCalled >= timeout && !scheduled) {
      lastCalled = now;
      func.apply(this, arguments);
    }
    else if (!scheduled) {
      scheduled = true;
      setTimeout(() => {
        func.apply(this, arguments);
        scheduled = false;
      }, timeout-(now-lastCalled));
    }
  }
  return debouncedFunction;
}