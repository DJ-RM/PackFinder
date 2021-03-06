import axios from 'axios';
import history from '../history';
import socket from '../socket'

/**
 * ACTION TYPES
 */
const GET_EVENTS = 'GET_EVENTS';
const DELETE_EVENT = 'DELETE_EVENT';
const UPDATE_EVENT = 'UPDATE_EVENT';
const ADD_EVENT = 'ADD_EVENT';

/**
 * INITIAL STATE
 */
const defaultEvents = [];
/*
 * ACTION CREATORS
 */
const getAllEvents = events => ({ type: GET_EVENTS, events });
const delEvent = eventId => ({ type: DELETE_EVENT, eventId });
const updEvent = event => ({ type: UPDATE_EVENT, event });
const addNewEvent = event => ({ type: ADD_EVENT, event });

/**
 * THUNK CREATORS
 */
export const getEvents = () => dispatch =>
  axios
    .get('/api/events')
    .then(res => dispatch(getAllEvents(res.data || defaultEvents)))
    .catch(err => console.log(err));

export const deleteEvent = eventId => dispatch =>{

console.log('delete',eventId)
  axios
    .delete(`/api/events/${eventId}`)
    .then(() => dispatch(delEvent(eventId || defaultEvents)))
    .catch(err => console.log(err));
}

export const updateEvent = event => dispatch =>
  axios
    .put(`/api/events/${event.id}`, event)
    .then(res => dispatch(updEvent(res.data || defaultEvents)))
    .catch(err => console.log(err));

export const addEvent = event => dispatch =>
  axios
    .post(`/api/events/`, event)
    .then(async res => {
      await dispatch(getEvents())
      //history.push(`/event/${res.data.id}`)
    })
    .catch(err => console.log(err));

// export const getuninvitedFriends(event, userId) => dispatch =>
//   axios
//   .get(`/api/events/${event.id}/`)
//   .then(res => dispatch(getAllEvents(res.data || defaultEvents)))
//   .catch(err => console.log(err));


export const inviteUsers = (event, userIds) => dispatch => {
  return axios
  .put(`/api/events/${event.id}/invite-users`, {userIds})
  .then(res => {
    dispatch(updEvent(res.data || defaultEvents))
    socket.emit('event-invite', {
      userIds,
      event
    })
  })
  .catch(err => console.log(err));
}

export const inviteUsersOnSocket = (event, userIds) => dispatch => {
  return axios
  .put(`/api/events/${event.id}/invite-users`, {userIds})
  .then(res => {
    dispatch(updEvent(res.data || defaultEvents))
  })
  .catch(err => console.log(err));
}

export const removeInvite = (event, userId) => dispatch =>
  axios
  .put(`/api/events/${event.id}/remove-invite`, {userId})
  .then(res => dispatch(updEvent(res.data || defaultEvents)))
  .catch(err => console.log(err));

export const addAttendee = (event, userId) => dispatch =>
  axios
  .put(`/api/events/${event.id}/add-attendee`, {userId})
  .then(res => dispatch(updEvent(res.data || defaultEvents)))
  .catch(err => console.log(err));

export const removeAttendee = (event, userId) => dispatch =>
{
  axios
  .put(`/api/events/${event.id}/remove-attendee`, {event, userId})
  .then(res => dispatch(updEvent(res.data || defaultEvents)))
  .catch(err => console.log(err));
}

// Invite Users, Add User, Remove User, Retract Invite


/**
 * REDUCER
 */
export default function(state = defaultEvents, action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.events;
    case UPDATE_EVENT:
      return state.map(
        event => (action.event.id !== event.id ? event : action.event)
      );
    case DELETE_EVENT:
      return state.filter(event => action.eventId !== event.id);
    case ADD_EVENT:
      return [...state, action.event]; //must do a get all after adding a new event
    default:
      return state;
  }
}
