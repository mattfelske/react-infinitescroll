import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import './index.css'

class GIF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      loaded: false,
      error: false,
      flavorText: 'Loading'
    }
  }
  
  handleLoadEvent() {
    console.log('GIF loaded')
    this.setState({
      loaded: true,
      flavorText: ''
    })
  }
  
  handleErrorEvent() {
    console.error(new Error(`An error occured while loading a gif`), this.state.url);
    this.setState({
      error: true,
      flavorText: 'Error Occured '
    })
  }
  
  render() {
    return (
      <Grid item>
        <Paper className="paper" square={true}>
          <img
            alt={this.state.url}
            src={this.state.url}
            onLoad={this.handleLoadEvent.bind(this)}
            onError={this.handleErrorEvent.bind(this)}
          />
          {this.state.flavorText}
        </Paper>
      </Grid>
    )
  }
}

export default GIF;