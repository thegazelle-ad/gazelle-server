import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';
import Warning from 'material-ui/svg-icons/alert/warning';

export default class UnpublishButton extends React.Component {
  constructor(props) {
    super(props);
    this.unpublish = this.unpublish.bind(this);
  }

  unpublish() {
    const { id } = this.props;
    const jsonGraphEnvelope = {
      paths: [['articles', 'byId', id, 'published_at']],
      jsonGraph: {
        articles: {
          byId: {
            [id]: {
              published_at: null,
            },
          },
        },
      },
    };
    this.props.save(jsonGraphEnvelope, null);
  }

  render() {
    return (
      <div>
        <RaisedButton
          label="Unpublish Article"
          secondary
          style={this.props.style}
          disabled={!this.props.published_at}
          onClick={this.unpublish}
          icon={<Warning />}
        />
        <br />
        {this.props.published_at !== null
          ? `This article was published on ${moment(
              this.props.published_at,
            ).format('MMMM DD, YYYY')}.`
          : 'The article has yet to be published. It will be published automatically ' +
            'when you publish the issue that contains it.'}
      </div>
    );
  }
}

UnpublishButton.propTypes = {
  id: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
  published_at: PropTypes.number,
  style: PropTypes.shape({}),
};

UnpublishButton.defaultProps = {
  style: {},
  published_at: null,
};
