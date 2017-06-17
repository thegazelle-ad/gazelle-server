// Hack for Ubuntu on Windows: interface enumeration fails with EINVAL, so return empty.
// All hail the Stack Overflow gods.
try {
  require('os').networkInterfaces();
} catch (e) {
  require('os').networkInterfaces = () => ({});
}