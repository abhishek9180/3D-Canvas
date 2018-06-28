import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import { Switch, Route } from 'react-router-dom';



import './App.css';
import Home from './pages/Home'
import ExampleContainer from './pages/ExampleContainer';


const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px"
  },
  progress: {
    margin: theme.spacing.unit * 2,
  }
};

const Main = () => (
  <main>
    <Switch>
      <Route path='/examples' component={ExampleContainer}/>
      <Route exact path='/' component={Home}/>
    </Switch>
  </main>
);

class App extends React.Component{
  state = {
    loading: true
  };

  componentDidMount() {
    this.setState({ loading: false }); // simulates an async action, and hides the spinner
  }
  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
      <CssBaseline />
        <Main className={classes.root}>
          <div className="lds-hourglass"></div>
        </Main>
      </MuiThemeProvider>
    </React.Fragment>
      
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
