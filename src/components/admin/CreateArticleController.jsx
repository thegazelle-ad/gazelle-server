import React from 'react';

// Material UI
import Dialog from 'material-ui/Dialog';

export class CreateArticleController extends React.Component {
  constructor(props) {
    super(props);
    this.onCreate = this.onCreate.bind(this);
  }
  onCreate() {}
  render() {
    return (
      <Dialog open modal={false} autoScrollBodyContent>
        Dummy
      </Dialog>
    );
  }
}
