import React from 'react';
import Card from '../Card';
import './Cards.css';
import firebase from '../../FirebaseConfig';

const Cards = ({ cards, room_name, name, sessions, team_member }) => (
  <div className="centerDiv">
    <ul className="cards">
      {
        cards.map((card) => (
          <li className="cards__card" key={card} onClick={(event) => handleClick(event, card, room_name, name, sessions, team_member)}>
            <Card card={card} />
          </li>
        ))
      }
    </ul>
  </div>
);

const handleClick = (event, point, room_name, name, sessions, team_member) => {
  event.preventDefault();
  if (!sessions && team_member !== null) {
    let members = [];
    team_member.map(member => (
      member.name !== name ? (members.push(member)) : (members.push({name: name, story_point: point, status: true}))
    ));
    firebase.database().ref(room_name).update({ team_member: members });
    console.log("coba click kartu: " + point);
  }
};

export default Cards;