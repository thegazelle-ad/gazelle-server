import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import _ from 'lodash';

// material-ui
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

import { withModals } from 'components/admin/hocs/modals';

const styles = {
  paper: {
    height: '100%',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'left',
    display: 'inline-block',
  },
};

class ArticleList extends BaseComponent {
  render() {
    if (this.props.elements) {
      const { elements } = this.props;
      return (
        <Paper style={styles.paper} zDepth={1}>
          <List style={{ overflow: 'auto', maxHeight: '400px' }}>
            <Subheader>Recent Articles</Subheader>
            {_.map(elements, this.props.createElement)}
          </List>
          <button
            // eslint-disable-next-line
            onClick={this.displayAlert.bind(this, 'Oh no something went wrong')}
          >
            Click Me
          </button>
        </Paper>
      );
    }
    return <div>This page does not exist</div>;
  }
}

ArticleList.propTypes = {
  elements: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]).isRequired,
  createElement: React.PropTypes.func.isRequired,
};

const EnhancedList = withModals(ArticleList);
export { EnhancedList as ArticleList };
