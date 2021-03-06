
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import history from '../../history';
import { Grid, Button, Image, Label, Header, Segment } from 'semantic-ui-react';
import {
  addAttendee,
  removeAttendee, removeInvite
} from '../../store';

/**
 * COMPONENT
 */

export const EventsListItem = props => {
  const { id, park, description, start, attendees } = props.item;
  const { submit, user, activeIndex, decline, removeAttendee, removeInvite, addAttendee, item } = props;
  const buttonText = {
    0: 'Delete',
    1: 'Join',
    2: 'Leave',
    3: 'Accept',
  };
  const buttonColor = {
    0: 'red',
    1: 'green',
    2: 'red',
    3: 'green',
  }
  return (
    <Segment style={{ margin: '0px', width: '100%' }}>
      <Grid>
        <Grid.Row style={{ padding: '0.25em', alignItems: 'center' }}>
          <Header style={{ flex: 2, margin: '0' }} as="a">
            {description}
          </Header>
          <Button
            style={{ flex: 1, padding: '0.5em 0.5em', backgroundColor: '#54B8BF', color: 'white'}}
            onClick={() => history.push(`/event/${id}`)}
            size="tiny"
            name="add"
          >
            View Details
          </Button>
          <Button
            style={{ flex: 1, padding: '0.5em 0.5em' }}
            onClick={() => history.push(`/dog-park/${park.id}`)}
            size="tiny"
            name="add"
          >
            {park.name}
          </Button>
        </Grid.Row>
        <Grid.Row columns={2} style={{ padding: '1.5em 0px' }}>
        <Grid.Column width={13}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
            }}
          >
            {moment(start).format('MMMM Do YYYY, h:mm a')}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
            }}
          >
            {`${attendees.length} packs planning to attend`}
          </div>
          </Grid.Column>
          <Grid.Column width={3}>
          <Button color={buttonColor[activeIndex]}
            style={{ flex: 1, padding: '0.5em 0.5em' }}
            onClick={() => submit(item, user.id)}
            size="tiny"
            floated="right"
            name="add"
            >
          {buttonText[activeIndex]}
          </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

/**
 * CONTAINER
 */
const mapState = ({ user }) => ({ user });

const mapDispatch = dispatch => {
  return {
    getSuggestedFriends(location) {
      dispatch(getNearByUsersInfo(location));
    },
    getUserLocation() {
      dispatch(getGeolocation());
    }
  };
};

export default connect(mapState, mapDispatch)(EventsListItem);
