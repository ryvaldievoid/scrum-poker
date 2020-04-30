import React from 'react';
import '../../App.css';
import banner from './banner.png';
import firebase from '../../FirebaseConfig';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            room_name: '',
            name: '',
            status: '',
            rooms: [],
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div>
                        <img src={banner} className="App-logo" alt="logo" />
                        <h1>Scrum Poker Online</h1>
                        <p>Enter or Create a Room Here:</p>
                        <form className="login-form" autoComplete="off" onSubmit={this.handleSubmit}>
                            <div className="form-row">
                                <div style={{ marginTop: '13px' }}>
                                    <input type="text" ref='room_name' name='room_name' className="form-control" placeholder="Room Name" required onChange={this.handleInputChange} style={{ height: '32px', width: "70%" }} />
                                </div>
                                <div style={{ marginTop: '13px', marginBottom: '13px' }}>
                                    <input type="text" ref='name' name='name' className="form-control" placeholder="Name" required onChange={this.handleInputChange} style={{ height: '32px', width: "70%" }} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </header>
            </div>
        );
    }

    getData = () => {
        this.setState.loading = true;
        let ref = firebase.database().ref(this.state.room_name);
        let listener = ref.on('value', snapshot => {
            ref.off('value', listener);
            let data = snapshot.val();
            this.setState({ loading: false, rooms: data });
            if (data !== null && this.state.room_name !== '') {
                // join room
                this.setState({ status: 'join' });
                const { room_name, name, status } = this.state;
                this.props.history.push('/lobby', { room_name, name, status });
            } else {
                // alert('Create or Enter a room name first!');
                // create room
                this.createRoom();
                this.setState({ status: 'create' });
                const { room_name, name, status } = this.state;
                this.props.history.push('/lobby', { room_name, name, status });
            }
        })
    }

    createRoom = () => {
        firebase.database().ref(this.state.room_name).set({
            creator: this.state.name,
            sessions: false,
            story: 'Your user story',
            team_member: [{
                name: this.state.name,
                story_point: '',
                status: false
            }]
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.getData();
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    componentDidMount() {
        if (this.state.room_name === '') {
            // Login first
            console.log('login dulu');
        } else {
            // Check room
            console.log('udah login');
            this.getData();
        }
    }

}

export default Login;
