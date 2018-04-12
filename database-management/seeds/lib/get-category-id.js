module.exports.getCategoryId = (articleId, numCategories) =>
  (articleId - 1) % numCategories + 1;
