import React from 'react';
import ArticleList from 'components/main/ArticleList';
import BaseComponent from 'lib/BaseComponent';
import { parseMarkdown } from 'lib/react-utilities';
import _ from 'lodash';

export default class Staff extends BaseComponent {
  render() {
    const { staff } = this.props;
    return (
      <div key={staff.slug} className="staff">
        <div className="staff__header">
          <img
            className="staff__header__staff-image"
            alt="staff"
            src={staff.image_url}
          />
          <div className="staff__header__staff-info">
            <h1 className="staff__header__staff-info__name">{staff.name}</h1>
            <h2 className="staff__header__staff-info__role">
              {staff.job_title}
            </h2>
            <p className="staff__header__staff-info__biography">
              {parseMarkdown(staff.biography)}
            </p>
          </div>
        </div>
        <ArticleList articles={_.toArray(staff.articles)} />
      </div>
    );
  }
}

Staff.propTypes = {
  staff: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    biography: React.PropTypes.string,
    title: React.PropTypes.string,
    photo: React.PropTypes.string,
    articles: React.PropTypes.object,
  }),
};
