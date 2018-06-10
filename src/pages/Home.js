import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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

            <Button variant="raised" color="primary" href="/examples/animate-cube" className={classes.button}>
              Try Now
              <ArrowForward className={classes.icon} />
            </Button>
            
            
          </div>
          
        </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
