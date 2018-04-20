import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import Paper from 'material-ui/Paper';
import { GazellePlugin } from './GazellePlugin';

const styles = {
  paper: {
    width: '100%',
    height: '100%',
  },
  editor: { padding: 10 },
};

export class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.plugins = [GazellePlugin()];
  }

  onChange = ({ value }) => {
    this.props.onUpdate(Plain.serialize(value));
  };

  render() {
    return (
      <Paper style={styles.paper} zDepth={2}>
        <Editor
          style={styles.editor}
          placeholder="Begin writing for the Gazelle :)"
          value={Plain.deserialize(this.props.value)}
          onChange={this.onChange}
          plugins={this.plugins}
          spellCheck
        />
      </Paper>
    );
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onUpdate: PropTypes.func,
};

MarkdownEditor.defaultProps = {
  value: '',
  onUpdate: null,
};
