import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import AppLogo from '../AppLogo';
import MenuAppBar from '../MenuAppBar';
import '../App.css';

const styles = theme => ({
  icon: { 
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Home extends React.Component{
  render() {
    return (
        <div>
          <MenuAppBar />
          <AppLogo />
          <div>
            <div className="arrow bounce"></div>
              <Link className="try-now" to="/examples/camera-array">Try out more<i></i></Link>
            </div>
        </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
