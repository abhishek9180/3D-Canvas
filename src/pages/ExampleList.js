import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
  }
});

class ExampleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeItem: ''};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(i, e) {
    //e.preventDefault();
    this.setState({ activeItem: i });
    this.props.onChange(i.title);
  }
  render() {
    const { classes } = this.props;
    const linkArray = [
      {
        id: 1,
        url: "/examples/polygon-animation-geometry",
        title: "Polygon Animation (Geometry)"
      },
      {
        id: 2,
        url: "/examples/polygon-animation1-geometry",
        title: "Polygon Animation1 (Geometry)"
      },
      {
        id: 3,
        url: "/examples/universe-animation-lights",
        title: "Universe Animation (Lights)"
      },
      {
        id: 4,
        url: "/examples/text-animation-geometry",
        title: "Text Animation (Geometry)"
      }
    ];
  
    return (
      <div className={classes.root}>
        <List component="nav">
          {linkArray.reverse().map(i => (
            <div key={`list-${i.id}`}>
              <ListItem button>
                <Link to={`${i.url}`} onClick={this.handleClick.bind(this, i)}>
                      <ListItemText primary={`${i.title}`} />
                </Link>
              </ListItem>
              <Divider />
            </div>
          ))}   
        </List>
      </div>
    );
  }
  
}

ExampleList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExampleList);
