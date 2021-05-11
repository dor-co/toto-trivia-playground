import "./App.css";
import "firebase/firestore";
import { useFirestore, firestore, useFirestoreDocData } from "reactfire";
import Users from "./components/users/Users";
import Questions from "./components/questions/Questions";
import React, { useEffect, useState } from "react";
import CurrentQuestion from "./components/currentQuestion/CurrentQuestion";
import logo from "./asserts/logos_a_logos_winner.png";
import * as MdIcons from 'react-icons/md';
import { AiFillQqCircle } from "react-icons/ai";

function App() {
  const db = firestore();
  const useFs = useFirestore();
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [crews, setCrews] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [crewInput, setCrewInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [showDeleteCrew, setshowDeleteCrew] = useState(false);
  const [showDeleteTeam, setshowDeleteTeam] = useState(false);

  let globalScore = 0;

  const dashboardRef = db.collection('Dashboard').doc('Dashboard');
  const dashboardRefData = useFirestoreDocData(dashboardRef).data;

  const colCount = dashboardRefData?.columnCounter;

  const onSelect = (questionItem) => {
    
    const currentQuestionRef = db.collection("CurrentQuestion").doc("CurrentQuestion");
    const questionRef = db.collection("Questions").doc(questionItem.id);
    
    let newIndex = currentQuestion[0]?.index ? currentQuestion[0].index + 1 : 1;
    questionRef.update({ index: newIndex,isUsed:true });

    currentQuestionRef.set({
      ...questionItem,
      index: newIndex,
      answers: questionItem.answers.map(({ isCorrect, ...attr }) => attr),
    });

      teams.map((item) => {
      const teamRef = db.collection("Teams").doc(item.id);
      teamRef.update({
      answerArray: []
      })
    });
      crews.map((item) => {
      const crewRef = db.collection("Crews").doc(item.id);
      crewRef.update({
        answerArray: []
      })
    });
  };

  const useItems = (itemType, callback, items) => {
    useEffect(() => {
      const fetchData = async () => {
        await db
          .collection(itemType) //access firestore //access "items" collection
          .onSnapshot((snapshot) => {
            let listItems = [];

            listItems = snapshot.docs.map((doc) => ({
              id: doc.id, //id and data pushed into items array
              ...doc.data(), //spread operator merges data to id.
            }));

            callback(listItems); //items is equal to listItems
          });
      };
      fetchData();
    }, []);

    return items;
  };

  useItems("Users", setUsers, users);
  useItems("Questions", setQuestions, questions);
  useItems("Crews", setCrews, crews);
  useItems("Teams", setTeams, teams);
  useItems("Answers", setAnswers, answers);
  useItems("CurrentQuestion", setCurrentQuestion, currentQuestion);

  console.log("Done fetching");

  const addColumn = () => {
    if(colCount < questions.length){
        dashboardRef.update({
            columnCounter: colCount + 1
        })
        alert('you added one more column for teams score table')
    }else{
        alert('you added all the columns for teams score table')
    }
  } 

  const addCrew = () => {
    if (crewInput != "" ) {
      db.collection("Crews")
        .add({
          answerArray: [],
          score: 0,
          title: crewInput
        })
        .then(() => setCrewInput(""))
    } else {
      alert("please enter crew name");
    }
  }

  const addTeam = () => {
    if (teamInput != "" ) {
      db.collection("Teams")
        .add({
          answerArray: [],
          score: 0,
          title: teamInput
        })
        .then(() => setTeamInput(""))
    } else {
      alert("please enter team name");
    }
  }

  const deleteCrew = (crewId) => {
    const crewRefDelete = db.collection('Crews').doc(crewId);
    crewRefDelete.delete();
  }

  const deleteTeam = (teamId) => {
    const teamRefDelete = db.collection('Teams').doc(teamId);
    teamRefDelete.delete();
  }

  return (
    <div className="container">
      <h1 className="playgroundTitle">
        Playground
        <img className="logoImg" src={logo} />
      </h1>
      <button className='addColumnBtn' onClick={addColumn}>show one more column</button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <div className="currQues">
          <h2 style={{direction: 'rtl', textDecoration: 'underline', marginTop: 30, color: '#0d1336'}}>שאלה נוכחית:</h2>
          <h1 style={{fontSize: 40, color: '#0d1336'}}> {currentQuestion[0]?.question}</h1>
      </div>
        <table
          className='mainTable'
          style={{ width: 600, minHeight: 200, marginRight: 50 }} 
        >
          <thead>
            <tr>
              <th style={{minWidth: 180}}>קבוצה</th>
              <th style={{minWidth: 180}}>מספר חברים</th>
              <th style={{minWidth: 180}}>תשובות</th>
              <th style={{minWidth: 180}}>נקודות</th>
            </tr>
          </thead>
          <tbody>

            {teams.map((item) => {
              let scr = item.score;
              let usersInTeam = users.filter((u) => u.teamId === item.id);
              return (
                <tr>
                  {showDeleteTeam ? (<td style={{direction: 'ltr', textAlign: 'right', whiteSpace: 'nowrap'}}>{item.title}{showDeleteTeam ? (
                      <button className='deleteAnswerBtn' onClick={() => deleteTeam(item.id)}><MdIcons.MdDeleteForever /></button>
                    ) 
                    : (null)}</td>): (<td>{item.title}</td>)}
                  <td>{users.filter((u) => u.teamId == item.id).length}</td>
                  <td>{item.answerArray.join(", ")}</td>
                  <td>{item.score}</td>
                </tr>
              );
            })}
          </tbody>
          <tr>
            <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
              <input
                value={teamInput}
                type="text"
                id="teamInput"
                placeholder='הכנס שם קבוצה'
                onChange={(e) => setTeamInput(e.currentTarget.value)} />
            </td>
            <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
            <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
              <button className="userBtn deleteUser" onClick={() => {setshowDeleteTeam(!showDeleteTeam)}}>
                delete team
              </button>
            </td>
            <td style={{background: '#e8e8e8'}}>
              <button className="userBtn" onClick={addTeam}>
                add team
              </button>
            </td>
          </tr>
        </table>
        <br />
        <table 
        className="mainTable"
        style={{ width: 600, minHeight: 200, marginLeft: 50 }}>
          <thead>
            <tr>
              <th style={{minWidth: 180}}>צוות</th>
              <th style={{minWidth: 180}}>מספר חברים</th>
              <th style={{minWidth: 180}}>תשובות</th>
              <th style={{minWidth: 180}}>נקודות</th>
            </tr>
          </thead>
          <tbody>
            {crews.map((item, index) => {
              let usersInCrew = users.filter((u) => u.crewId === item.id);
              let crewAnswers = answers.filter((a) => {
                return usersInCrew.indexOf((u) => u.id === a.userId) > -1;
              });

              return (
                <tr>
                  {showDeleteCrew ? (<td style={{direction: 'ltr', textAlign: 'right', whiteSpace: 'nowrap'}}>{item.title}{showDeleteCrew ? (
                      <button className='deleteAnswerBtn' onClick={() => deleteCrew(item.id)}><MdIcons.MdDeleteForever /></button>
                    ) 
                    : (null)}</td>): (<td>{item.title}</td>)}
                  <td>{users.filter((u) => u.crewId == item.id).length}</td>
                  <td>{item.answerArray.join(", ")}</td>
                  <td>{item.score}</td>
                </tr>
              );
            })}
          </tbody>
          <tr>
            <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
              <input
                value={crewInput}
                type="text"
                id="crewInput"
                placeholder='הכנס שם צוות'
                onChange={(e) => { setCrewInput(e.currentTarget.value)}} />
            </td>
            <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
            <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
              <button className="userBtn deleteUser" onClick={() => {setshowDeleteCrew(!showDeleteCrew)}}>
                delete crew
              </button>
            </td>
            <td style={{background: '#e8e8e8'}}>
              <button className="userBtn" onClick={addCrew}>
                add crew
              </button>
            </td>
          </tr>
        </table>
      </div>
      <div style={{alignItems: 'center', textAlign: 'center', alignSelf: 'center', alignContent: 'center', justifyContent: 'center'}}>
        <Questions questions={questions} onSelectHandler={onSelect} />
        <Users users={users} crews={crews} teams={teams} />
      </div>
    </div>
  );
}

export default App;
