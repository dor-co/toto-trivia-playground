import "./App.css";
import "firebase/firestore";
import { useFirestore, firestore } from "reactfire";
import User from "./components/users/User";
import Question from "./components/questions/Question";
import React, { useEffect, useState } from "react";
import CurrentQuestion from "./components/currentQuestion/CurrentQuestion";
import logo from "./asserts/logos_a_logos_winner.png";

function App() {
  const db = firestore();
  const useFs = useFirestore();
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [crews, setCrews] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currwntQuestion, setCurrwntQuestion] = useState([]);
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
  useItems("CurrentQuestion", setCurrwntQuestion, currwntQuestion);

  return (
    <div>
      <h1 className="playgroundTitle">
        Playground
        <img className="logoImg" src={logo} />
      </h1>
	  <div style={{display: 'flex', flexDirection: 'row', textAlign: 'center', justifyContent: 'center'}}>
		  <h1 style={{textAlign: 'left', marginRight: 50, fontSize: 27}}>{currwntQuestion[0]?.countAnswered}/{users.length} Users answered the question</h1>
          <table style={{width: 500, height: 160, marginRight: 50, marginLeft: 50}}>
            <tr>
              <th>קבוצה</th>
              <th>מספר חברים</th>
              <th>תשובות</th>
              <th>נקודות</th>
            </tr>

			{teams.map((item, index) => {
				let scr = item.score;
				let usersInTeam = users.filter((u) => u.teamId === item.id);
				let answered
				let teamAnswers = answers.filter((a) => {				
					return usersInTeam.indexOf((u) => u.id === a.userId) > -1;
				});

				// usersInTeam.map((user) => { //pass all the users of this team
				// 	for(let i = 0 ; i < user.AQ.length ; i++){	//pass all the AQ array of all user in this team						
				// 		const questionRef = useFs.collection("Questions").doc(user.AQ[i]?.ques);
				// 		const teamRef = useFs.collection("Teams").doc(item?.id);
				// 		questionRef.get().then((doc) => {
				// 			let rightAns = doc.data()?.rightAnswer
				// 			let Cost = doc.data()?.cost;
				// 			//console.log('user:', user.firstName, 'i:', i, 'question:', user.AQ[i]?.ques, 'answer:', user.AQ[i]?.ans, 'right answer:', rightAns, 'index:', index)
				// 			if(rightAns === user.AQ[i]?.ans){ //check if the right answer of the question in the AQ array is the answer the user select
				// 				teamRef.update({
				// 					// score: item.score + Cost //update the score of the team
				// 				})
				// 			}
				// 		})
				// 	}
				// })

              return (
                <tr>
                  <td>{item.title}</td>
                  <td>{users.filter((u) => u.teamId == item.id).length}</td>
                  <td>{item.answerArray.join(', ')}</td>
                  {/* <td>{score}</td> scores */}
				  <td>{item.score}</td>
                </tr>
              );
            })}
          </table>
		  <br/>
		  <table style={{width: 500, height: 160, pmarginLeft: 50}}>
            <tr>
              <th>צוות</th>
              <th>מספר חברים</th>
              <th>תשובות</th>
              <th>נקודות</th>
            </tr>

            {crews.map((item, index) => {
              let usersInCrew = users.filter((u) => u.crewId === item.id);
              let crewAnswers = answers.filter((a) => {
                return usersInCrew.indexOf((u) => u.id === a.userId) > -1;
              });

              return (
                <tr>
                  <td>{item.title}</td>
                  <td>{users.filter((u) => u.crewId == item.id).length}</td>
				  <td>{item.answerArray.join(', ')}</td>			  
                  {/* <td>{item.answersArray.length}</td> */}
                  <td>{item.score}</td> {/* scores */}
                </tr>
              );
            })}
          </table>
        </div>
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
        
        <div className="us">  
		  <h2 style={{ paddingRight: 180 }}>Users:</h2>
          <table style={{direction: "rtl", width: 800 }}>
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
