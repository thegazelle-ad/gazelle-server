// Hack for Ubuntu on Windows: interface enumeration fails with EINVAL, so return empty.
try {
  require('os').networkInterfaces();
} catch (e) {
  require('os').networkInterfaces = () => ({});
}