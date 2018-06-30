import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom'

import ExampleList from './ExampleList';
import Main from './ExampleRoutes';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    minHeight: '0px !important'
  },

  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: '0px',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  }
});


class ExampleContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mobileOpen: false,
      activeItem: 'Camera Array'
    };
    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);

  }

  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleChange(i, e) {
    this.handleDrawerToggle();
    this.setState({ activeItem: i });

  }

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className="j112">
          <div className="j113">
            <Link to="/">
              <h1 class="logo">
                <span class="cuboid">
                  <span class="cuboid-face cuboid-face-front"></span>
                  <span class="cuboid-face cuboid-face-back"></span>
                  <span class="cuboid-face cuboid-face-left"></span>
                </span>
                <span class="logo-text">anvasmagic</span>
              </h1>
            </Link>
          </div>
        </div>

        <ExampleList onChange={this.handleChange.bind(this)} />
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              {this.state.activeItem ? this.state.activeItem : 'CanvasMagic'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Main>
            <div className="lds-hourglass"></div>
          </Main>
        </main>
      </div>
    );
  }
}

ExampleContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ExampleContainer);
