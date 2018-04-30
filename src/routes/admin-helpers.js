export const getArticleListPath = page => `/articles/page/${page}`;

export const getArticlePath = (id, page) =>
  `${getArticleListPath(page)}/id/${id}`;

export const getStaffPath = slug => `/staff/${slug}`;
