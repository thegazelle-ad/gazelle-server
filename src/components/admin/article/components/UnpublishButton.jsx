import React from 'react';
import moment from 'moment';

import BaseComponent from 'lib/BaseComponent';
import RaisedButton from 'material-ui/RaisedButton';
import Warning from 'material-ui/svg-icons/alert/warning';

export default class UnpublishButton extends BaseComponent {
  constructor(props) {
    super(props);
    this.unpublish = this.unpublish.bind(this);
  }

  unpublish() {
    const slug = this.props.slug;
    const jsonGraphEnvelope = {
      paths: [
        ['articles', 'bySlug', slug, 'published_at'],
      ],
      jsonGraph: {
        articles: {
          bySlug: {
            [slug]: {
              published_at: null,
            },
          },
        },
      },
    };
    this.props.save(jsonGraphEnvelope);
  }


  render() {
    return (
      <div>
        {
            this.props.published_at ?
            `This article was published on ${
                  moment(this.props.published_at).format('MMMM DD, YYYY')
                }.`
            : 'The article has yet to be published. It will be published automatically ' +
              'when you publish the issue that contains it.'
          }
        <br />
        <RaisedButton
          label="Unpublish Article"
          secondary
          style={this.props.style}
          disabled={!this.props.published_at}
          onClick={this.unpublish}
          icon={<Warning />}
        />
      </div>
    );
  }
}
