import React from 'react';
import { Link } from 'react-router-dom'
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import KeyboardVoice from '@material-ui/icons/KeyboardVoice';

import classNames from 'classnames';

import AnimateCube from './examples/AnimateCube';

const styles = theme => ({
  actions: {
    display: 'flex',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    marginLeft: 'auto',
  },
});

class PostReviewCard extends React.Component {
  handleClick = () => {
    this.props.history.push("/animate-cube");
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card>
          <AnimateCube />
          
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <Button className={classes.button} variant="raised" color="primary" onClick={this.handleClick}>
              <KeyboardVoice className={classes.leftIcon} />
              Send
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

PostReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostReviewCard);