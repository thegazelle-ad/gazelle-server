const articleRoot = '/articles';

export const getArticleListPath = page => `${articleRoot}/page/${page}`;

export const getArticlePath = id => `${articleRoot}/id/${id}`;

export const getStaffPath = slug => `/staff/${slug}`;

export const getTeamPath = (semester, team) => `/semesters/${semester}/${team}`;
