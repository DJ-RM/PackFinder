import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Segment, Grid, Header, Button } from 'semantic-ui-react';
import { PetProfileItem, UserProfileItem, EditPetModal } from '.';
import { getPets, deletePet, updatePet, addPet } from '../store';

/**
 * COMPONENT
 */

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPetModal: false,
      selectedPet: {
        bio: '',
        breed: '',
        imageUrls: [],
        name: '',
        weight: undefined,
        age: undefined,
        id: undefined,
        userId: undefined,
      },
      isUpdatePet: false,
    };
    this.togglePetModal = this.togglePetModal.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openPetModal = this.openPetModal.bind(this);
  }
  componentDidMount() {
    this.props.getData();
  }
  openPetModal = (pet, edit = true) => {
    let selPet = {};
    if (edit) selPet = Object.assign({}, pet);
    else {
      selPet = {
        bio: '',
        breed: '',
        imageUrls: [],
        name: '',
        weight: undefined,
        age: undefined,
        id: undefined,
        userId: undefined,
      };
    }
    this.setState({
      selectedPet: selPet,
      isUpdatePet: edit,
    });
    this.togglePetModal();
  };
  togglePetModal = () => {
    this.setState({
      showPetModal: !this.state.showPetModal,
    });
  };
  handleAdd = () => {
    console.log('handleADD');
    this.props.addNewPet(this.state.selectedPet);
    this.togglePetModal();
  };
  handleUpdate = () => {
    console.log('handleupdate');
    this.props.updatePet(this.state.selectedPet);
    this.togglePetModal();
  };
  handleChange = e => {
    this.setState({
      selectedPet: Object.assign(this.state.selectedPet, {
        [e.target.name]: e.target.value,
      }),
    });
  };
  render() {
    const { user, userPets } = this.props;
    return (
      <div>
        <EditPetModal
          show={this.state.showPetModal}
          onClose={this.togglePetModal}
          item={this.state.selectedPet}
          handleAdd={this.handleAdd}
          handleChange={this.handleChange}
          handleUpdate={this.handleUpdate}
          isUpdatePet={this.state.isUpdatePet}
        />
        <Container className="container">
          <Grid columns={2} divided>
            <Header as="h3">Owner:</Header>
            <UserProfileItem user={user} />
            <Grid.Row>
              <Grid.Column width="4">
                <Header as="h3">Dogs:</Header>
              </Grid.Column>
              <Grid.Column width="12">
                <Button
                  color="teal"
                  onClick={() => this.openPetModal(null, false)}
                >
                  Add a dog
                </Button>
              </Grid.Column>
            </Grid.Row>
            {userPets ? (
              userPets.map((pet, i) => {
                return (
                  <PetProfileItem
                    key={i}
                    info={pet}
                    openPetModal={this.openPetModal}
                  />
                );
              })
            ) : (
              <h3>Add a dog to your profile!</h3>
            )}
          </Grid>
        </Container>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = ({ user, pets }) => {
  return {
    user,
    userPets: pets.filter(pet => pet.userId === user.id),
  };
};

const mapDispatch = dispatch => {
  return {
    getData() {
      dispatch(getPets());
    },
    removePet(pet) {
      dispatch(deletePet(pet));
    },
    updatePet(pet) {
      dispatch(updatePet(pet));
    },
    addNewPet(pet) {
      dispatch(addPet(pet));
    },
  };
};

export default connect(mapState, mapDispatch)(Profile);
// export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 //  */
// UserHome.propTypes = {
//   email: PropTypes.string
// }
