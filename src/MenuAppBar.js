import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
};

const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { scrollClass: 'initialHeader' };
    this.boundScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", debounce(this.boundScroll, 16));
  }

  handleScroll() {
    //  add logic for checks here.
    if (window.pageYOffset > (this.mount.clientHeight - 100)) {
      this.setState({ scrollClass: 'undefined' })
    } else {
      this.setState({ scrollClass: 'initialHeader' })
    }
  }

  render() {
    let { classes } = this.props;
    let { scrollClass } = this.state;


    return (
      <div className={classes.root}>

        <AppBar position="fixed" className={scrollClass}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <div className="logo">

                <span className="cuboid">
                  <span className="cuboid-face cuboid-face-front"></span>
                  <span className="cuboid-face cuboid-face-back"></span>

                  <span className="cuboid-face cuboid-face-left"></span>
                </span>

                <span className="logo-text">anvasmagic</span>
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);