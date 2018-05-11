import React, { Component } from 'react';
import { Map, ParkListItem, EventM, EventModal, SingleParkMap } from '../index.js';
import moment from 'moment';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Card,
  Item,
  Label,
  Embed,
  Form,
  Input,
  Radio,
  Select,
  TextArea,
  Checkbox,
} from 'semantic-ui-react';
import axios from 'axios';
import {
  addEvent,
  updateEvent,
  deleteEvent,
  getEvents
} from '../../store';
import { connect } from 'react-redux';

export class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isUpdateModal: true,
      map: {},
    };
    this.toggleModal = this.toggleModal.bind(this)
  }

  componentDidMount() {
    this.props.getEvents()
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  mapLoaded(map) {
    if (this.state.map !== null) {
      return
    }
    this.setState({ map })
  }

  render() {
    let { addEvent, updateEvent, deleteEvent, match, allEvents } = this.props
    let { showModal, isUpdateModal } = this.state

    let displayEvent = allEvents.filter(event => event.id === Number(match.params.id))[0]
    console.log('event', displayEvent)
    return (
      displayEvent ?
        <div>
          <EventModal
            onClose={this.toggleModal}
            showModal={showModal}
            onSubmit={isUpdateModal ? updateEvent : addEvent}
            onDelete={deleteEvent}
            isUpdateModal={isUpdateModal}
            item={displayEvent}
          />
          <Segment style={{ padding: '2em', paddingTop: '2em' }} vertical>
            <Container text style={{ marginBottom: '2em' }}>
              <Header as="h3" style={{ fontSize: '3em' }} textAlign="center">
                {}
              </Header>
            </Container>
            <Grid celled>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Segment attached>
                    <b>
                      Park Name: {displayEvent.park.name}<br />
                    </b>
                  </Segment>
                  <Segment attached>
                    <b>
                      Date: {moment(displayEvent.start).format('MMMM Do YYYY, h:mm a')}<br />
                    </b>
                  </Segment>
                  <Segment attached>
                    <b>
                      Description: {displayEvent.description}<br />
                    </b>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <SingleParkMap
                    zoom={15}
                    center={{ lat: 41.8781, lng: -87.6298 }}
                    mapLoaded={this.mapLoaded.bind(this)}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment>
                    <h4>What goes here</h4>
                    <Button positive style={{ marginRight: 20, marginTop: 20 }} onClick={() => addEvent()}>Add Event</Button>
                    <Button color="blue" style={{ marginRight: 20, marginTop: 20 }} onClick={() => this.toggleModal()}>Edit Event</Button>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br /> <br /> <br />
          </Segment>
        </div>
        :
        <div />
    );
  }
}
const mapState = state => {
  return {
    allEvents: state.events,
    attendees: [],
  };
};

const mapDispatch = (dispatch, ownProps) => {
  console.log(ownProps)
  return {
    addEvent(event) {
      dispatch(addEvent(event));
    },
    deleteEvent(eventId) {
      dispatch(deleteEvent(eventId));
      ownProps.history.push('/home')
    },
    updateEvent(event) {
      dispatch(updateEvent(event));
    },
    getEvents() {
      dispatch(getEvents());
    },
  };
};
export default connect(mapState, mapDispatch)(EventDetail);
