import "./App.css";
import "firebase/firestore";
import { firestore } from "reactfire";
import User from "./components/users/User";
import Question from "./components/questions/Question";
import React, { useEffect, useState } from "react";
import CurrentQuestion from "./components/currentQuestion/CurrentQuestion";
import logo from "./asserts/logos_a_logos_winner.png";

function App() {
  const db = firestore();
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [crews, setCrews] = useState([]);
  const [answers, setAnswers] = useState([]);

  const useItems = (itemType, callback, items) => {
    useEffect(() => {
      db.collection(itemType) //access firestore //access "items" collection
        .onSnapshot((snapshot) => {
          const listItems = snapshot.docs.map((doc) => ({
            id: doc.id, //id and data pushed into items array
            ...doc.data(), //spread operator merges data to id.
          }));
          callback(listItems); //items is equal to listItems
        });
    }, []);
    return items;
  };

  useItems("Users", setUsers, users);
  useItems("Questions", setQuestions, questions);
  useItems("Crews", setCrews, crews);
  useItems("Teams", setTeams, teams);
  useItems("Answers", setAnswers, answers);

  return (
    <div>
      <h1 className="playgroundTitle">
        Playground
        <img className="logoImg" src={logo} />
      </h1>
      <div className="currQues">
        <CurrentQuestion />
      </div>
      <div className="App">
        <div className="que">
          <h2>Questions List:</h2>
          {questions.map((item) => {
            return <Question key={item.id} item={item} />;
          })}
        </div>
        <div>
          <table>
            <tr>
              <th>קבוצה</th>
              <th>מספר חברים</th>
              <th>תשובות</th>
              <th>נקודות</th>
            </tr>

            {teams.map((item, index) => {
              let usersInTeam = users.filter((u) => u.teamId === item.id);
              let teamAnswers = answers.filter((a) => {
                return usersInTeam.indexOf((u) => u.id === a.userId) > -1;
              });

              return (
                <tr>
                  <td>{item.title}</td>
                  <td>{users.filter((u) => u.teamId == item.id).length}</td>
                  <td>{teamAnswers.length}</td>
                  <td>{teamAnswers.length}</td>
                </tr>
              );
            })}
          </table>
        </div>
        <div className="us">
          <h2>Users:</h2>
          <table style={{ direction: "rtl" }}>
            <tr>
              <th>שם</th>
              <th>קבוצה</th>
              <th>צוות</th>
              <th>נקודות</th>
              <th>תשובות</th>
              <th>פעולות</th>
            </tr>
            {users.map((item, index) => {
              return (
                <User
                  key={item.id}
                  user={item}
                  id={item.id}
                  index={index}
                  crews={crews}
                  teams={teams}
                />
              );
            })}
            <User key={33} crews={crews} teams={teams} isNewUser={true} />
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
