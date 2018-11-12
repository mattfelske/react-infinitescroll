import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Material-UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import GIF from './components/gif'

import $ from 'jquery';

const GENM_API_KEY = 'dc6zaTOxFJmzC';
const MY_API_KEY = 'R13CKlkCHh1gUIV1hrIXD4xTjNPKh6Vc';
const API_KEY = MY_API_KEY;
const QUERY_LIMIT = 50;
const SCROLL_OFFSET = 500;

var currentOffset = 0;
var currentScrollYOffset = 0;
var ticking = false;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      images: []
    }
    
    window.addEventListener('scroll', this.handleScroll);
    
    
    console.log('Getting first batch of gifs')
    getGifs('ryan+gosling', currentOffset, (err, result) => {
      if (err) {
        console.error(err);
        return this.setState({ error: true });
      }
      console.log('success', result);
      
      var newArray = this.state.images.slice();
      result.data.map((elem) => newArray.push(elem.images.fixed_height_small.url));
      currentOffset += result.data.length;
      this.setState({
        images: newArray,
        loading: false
      });
    });
  }
  
  handleScroll = (evt) => {
    currentScrollYOffset = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // console.log('Need to add GIFS', needToAddGifs(currentScrollYOffset));
        if (needToAddGifs(currentScrollYOffset) && !this.state.loading) {
          this.setState({loading: true})
          getGifs('ryan+gosling', currentOffset, (err, result) => {
            if (err) {
              console.error(err);
              return this.setState({ error: true });
            }
            console.log('success', result);
            
            var newArray = this.state.images.slice();
            result.data.map((elem) => newArray.push(elem.images.fixed_height_small.url));
            currentOffset += result.data.length;
            this.setState({
              images: newArray,
              loading: false
            });
          });
        }
        ticking = false;
      });

      ticking = true;
    }
  }
  
  render() {
    var gifs = this.state.images.map((url, index) => {
      return (
        <GIF key={index} url={url} />
      )
    });
    
    return (
      <div>
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              GIF Infinite Scroll Example
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container className="root">
          {gifs}
        </Grid>
      </div>
    )
  }
}

/**
 * Retrieves an array of GIF objects based on function parameters, and return the array
 * @param {String} query      - A formatted query String
 * @param {Number} offset     - The index to start querying gifs
 * @param {Function} callback - The callback function (err, result)
 */
var getGifs = (query, offset, callback) => {
  // TODO add validation on function parameters
  
  console.log('GET', `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}&limit=${QUERY_LIMIT}&offset=${currentOffset}`);
  var xhr = $.get(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}&limit=${QUERY_LIMIT}&offset=${currentOffset}`);
  xhr.done((data) => callback(null, data));
  xhr.fail((err) => callback(err));
}

/**
 * Checks to see wether the user has scrolled far enough.
 * @return {Boolean} True if we need to add assets
 */
var needToAddGifs = () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - SCROLL_OFFSET)) {
    return true;
  }
  return false;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)