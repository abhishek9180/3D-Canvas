import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
    const { classes } = this.props;
    return (
        <div>
          <MenuAppBar />
          <AppLogo />
          <div id="holder">
            <Typography variant="title" className="typography-header" gutterBottom>
              Explore our examples and experience the real power of Canvas. 
            </Typography>
            <h3><Link className="try-now" to="/examples/text-animation-geometry">Try out more</Link></h3>
           
          </div>
          
        </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
