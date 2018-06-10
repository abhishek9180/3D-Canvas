import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import { Switch, Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';



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
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
      <CssBaseline />
        <Main className={classes.root}>
          <CircularProgress className={classes.progress} color="primary"  size={50} thickness={5} />
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
