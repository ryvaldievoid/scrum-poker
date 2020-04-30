import React from 'react';
import firebase from '../../FirebaseConfig';
import Cards from '../../components/Cards';
import Card from '../../components/Card';

const fibonacciCard = ['0', '1/2', '1', '2', '3', '5', '8', '13', '21', '?', 'Coffe?'];

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      button_status: 'Reveal Cards',
      team_member: [],
      static_member: [],
      story: '',
      isCreator: false,
      sessions: false
    };
  }

  render() {
    return (
      <div className="App-header">
        <h3>The story goes like this:</h3>
        {
          this.state.isCreator ? (
            <input type="text" ref='user_story' name='user_story' className="Input-text" placeholder={
              this.state.story === "" ? (
                "Your user story goes here"
              ) : (
                  this.state.story
                )
            } onChange={this.handleInputChange} />
          ) : (
              <p style={{textAlign:'center'}}>{this.state.story}</p>
            )
        }
        {
          this.state.isCreator ? (
            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>{this.state.button_status}</button>
          ) : ('')
        }
        <hr style={{ color: 'white', backgroundColor: 'white', height: .5, width: '100%' }} />
        <div style={{ margin: '5px' }}>
          <p style={{ fontSize: '14px' }}>Room Name: {this.props.location.state.room_name}</p>
        </div>
        <div className="centerDiv">
          <ul>
            {
              this.state.team_member.map((member, index) =>
                <li className="cards__card" key={member.name}>
                  {/* <Card card={member.name} /> */}
                  <Card card={member.name === this.props.location.state.name
                    || this.state.sessions ? (member.story_point === '' ? (member.name) : (member.story_point)) : ('')} />
                  <p style={
                    member.status ? (
                      { color: 'white', fontWeight: 'bold' }
                    ) : (
                        { color: 'grey' }
                      )
                  }>{member.name}</p>
                </li>
              )
            }
          </ul>
        </div>
        <hr style={{ color: 'white', backgroundColor: 'white', height: .5, width: '100%' }} />
        <Cards cards={fibonacciCard} room_name={this.props.location.state.room_name}
          name={this.props.location.state.name}
          sessions={this.state.sessions}
          team_member={this.state.team_member} />
      </div>
    );
  }

  handleSubmit = (event) => {
    // event.preventDefault();
    let sessions = this.state.button_status === 'Reveal Cards';
    let stringRef = this.props.location.state.room_name;
    firebase.database().ref(stringRef).update({ sessions: sessions });
    if (sessions) {
      let members = [];
      this.state.team_member.map(member => (members.push({ name: member.name, story_point: member.story_point, status: false })));
      firebase.database().ref(stringRef).update({ team_member: members });
      this.setState({ button_status: 'Reset' });
    } else {
      this.setState({ button_status: 'Reveal Cards' });
    }
  }

  handleInputChange = (event) => {
    const { value } = event.target;
    this.updateUserStory(value);
  }

  updateUserStory = (user_story) => {
    let stringRef = this.props.location.state.room_name;
    firebase.database().ref(stringRef).update({ story: user_story });
  }

  getData = () => {
    let ref = firebase.database().ref(this.props.location.state.room_name);
    ref.on('value', snapshot => {
      const team_member = snapshot.val()['team_member'];
      this.setState({
        team_member: team_member, story: snapshot.val()['story']
        , isCreator: snapshot.val()['creator'] === this.props.location.state.name, sessions: snapshot.val()['sessions']
      });
      if (this.state.isCreator) {
        this.setState({button_status: this.state.sessions ? ('Reset'):('Reveal Cards')})
      }
      if (!snapshot.val()['sessions']) {
        this.setState({ static_member: team_member });
      }
    });
  }

  joinRoom = () => {
    let stringRef = this.props.location.state.room_name + '/team_member';
    let ref = firebase.database().ref(stringRef);
    let listener = ref.on('value', snapshot => {
      ref.off('value', listener);
      const team_member = [];
      let data = snapshot.val();
      if (data !== null) {
        data.map(({ name, story_point, status }) => (team_member.push({ name, story_point, status })));
      }
      team_member.push({
        name: this.props.location.state.name,
        story_point: '',
        status: false
      });
      const filterMembers = team_member.filter((member) => !team_member[member.name] && (team_member[member.name] = true));
      firebase.database().ref(stringRef).update(filterMembers);
    });
  }

  componentDidMount() {
    let prevState = this.props.location.state;
    if (prevState.status === 'join') {
      this.joinRoom();
    }
    this.getData();
  }

}

export default Lobby;
