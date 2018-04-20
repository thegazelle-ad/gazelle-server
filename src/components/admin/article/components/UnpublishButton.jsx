import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';
import Warning from 'material-ui/svg-icons/alert/warning';
import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';

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
        <TextFieldLabel>
          {this.props.published_at !== null
            ? `Published on ${moment(this.props.published_at).format(
                'MMMM DD, YYYY',
              )}.`
            : 'This article is not published'}
        </TextFieldLabel>
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
