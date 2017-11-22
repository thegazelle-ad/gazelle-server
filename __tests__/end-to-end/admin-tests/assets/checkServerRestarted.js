// In order to avoid 'undefined has no property X' errors
window.THE_GAZELLE = {};
// Redefine window.alert from what Nightmare does in preload script to the check we need
window.alert = msg => {
  if (msg === 'Server restarted successfully') {
    window.THE_GAZELLE.serverRestartedSuccessfully = true;
  }
};
