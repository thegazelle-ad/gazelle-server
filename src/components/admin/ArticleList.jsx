import React from 'react';
import _ from 'lodash';

// material-ui
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

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

export const ArticleList = ({ elements, createElement }) => {
  if (!elements) {
    return <div>This page does not exist</div>;
  }
  return (
    <Paper style={styles.paper} zDepth={1}>
      <List style={{ overflow: 'auto', maxHeight: '400px' }}>
        <Subheader>Recent Articles</Subheader>
        {_.map(elements, createElement)}
      </List>
    </Paper>
  );
};

ArticleList.propTypes = {
  elements: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.shape({})),
    React.PropTypes.shape({}),
  ]).isRequired,
  createElement: React.PropTypes.func.isRequired,
};
