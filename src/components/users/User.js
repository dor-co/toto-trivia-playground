import React, { useState } from "react";
import "firebase/firestore";
import { useFirestore } from "reactfire";
import "./Style.css";
import Selector from "../selector/Selector";

function User({ user, index, id, crews, teams, isNewUser }) {
  const [firstName, setName] = useState("");
  const [crewId, setCrewId] = useState("");
  const [teamId, setTeamId] = useState("");

  // let aq = [];
  // aq.push({ans: '1', ques: 'quesId'})
  // aq.push({ans: '1', ques: 'quesId'})
  // aq.push({ans: '1', ques: 'quesId'})
  // aq.push({ans: '1', ques: 'quesId'})
  // aq.push({ans: '1', ques: 'quesId'})
  // aq.push({ans: '1', ques: 'quesId'})

  const userRef = useFirestore().collection("Users").doc(id);

  const db = useFirestore();

  const addUser = () => {
    if (firstName != "" && crewId != "" && teamId != "") {
      db.collection("Users")
        .add({
          firstName,
          crewId,
          teamId,
          score: 0,
          userAnswer: [],
          //AQ: aq
        })
        .then(() => setName(""), setCrewId(""), setTeamId(""));
    } else {
      alert("please choose something");
    }
    console.log("yesss!");
  };

  const deleteUser = () => {
    userRef.delete();
  };

  const handleCrewChange = (crewId) => {
    userRef.update({ crewId: crewId });
  };
  const handleTeamChange = (teamId) => {
    userRef.update({ teamId: teamId });
  };

  return isNewUser ? (
    <tr>
      <td>
        <input
          value={firstName}
          type="text"
          id="newUserName"
          onChange={(e) => setName(e.currentTarget.value)}
        ></input>
      </td>
      <td>
        <select
          value={teamId}
          id="newTeamId"
          onChange={(e) => setTeamId(e.currentTarget.value)}
        >
          <option>בחר</option>
          {teams.map((item, index) => {
            return <Selector value={item.title} id={item.id} />;
          })}
        </select>
      </td>
      <td>
        <select
          value={crewId}
          id="newCrewId"
          onChange={(e) => setCrewId(e.currentTarget.value)}
        >
          <option>בחר</option>
          {crews.map((item, index) => {
            return <Selector value={item.title} id={item.id} />;
          })}
        </select>
      </td>
      <td></td>
      <td></td>
      <td>
        <button className="userBtn" onClick={addUser}>
          add user
        </button>
      </td>
    </tr>
  ) : (
    <tr>
      <td>{user.firstName}</td>
      <td>
        <select
          value={user.teamId}
          onChange={(e) => handleTeamChange(e.target.value)}
        >
          {teams.map((item, index) => {
            return <Selector value={item.title} id={item.id} />;
          })}
        </select>
      </td>
      <td>
        {" "}
        <select
          value={user.crewId}
          onChange={(e) => handleCrewChange(e.target.value)}
        >
          {crews.map((item, index) => {
            return <Selector value={item.title} id={item.id} />;
          })}
        </select>
      </td>
      <td>{user.score}</td> {/* points */}
      <td style={{direction: 'ltr'}}>{user.userAnswer.join(', ')}</td> {/* answers */}
      <td>
        {" "}
        <button
          className="userBtn deleteUser"
          onClick={() => {
            if (window.confirm("are you sure?")) {
              deleteUser();
            }
          }}
        >
          delete user
        </button>
      </td>
    </tr>
  );
}

export default User;
