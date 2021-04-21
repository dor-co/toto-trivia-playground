import "./App.css";
import "firebase/firestore";
import { useFirestore, firestore } from "reactfire";
import Users from "./components/users/Users";
import Questions from "./components/questions/Questions";
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
  const [currentQuestion, setCurrentQuestion] = useState([]);

  const onSelect = (questionItem) => {
    const currentQuestionRef = db
      .collection("CurrentQuestion")
      .doc("CurrentQuestion");
    const questionRef = db.collection("Questions").doc(questionItem.id);
    let newIndex = currentQuestion[0]?.index ? currentQuestion[0].index + 1 : 1;
    console.log("🚀 ~ file: App.js ~ line 26 ~ onSelect ~ currentQuestion.index", currentQuestion[0])
    console.log("🚀 ~ file: App.js ~ line 29 ~ onSelect ~ newIndex", newIndex);
    questionRef.update({ index: newIndex,isUsed:true });

    currentQuestionRef.set({
      ...questionItem,
      index: newIndex,
      answers: questionItem.answers.map(({ isCorrect, ...attr }) => attr),
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

  return (
    <div>
      <h1 className="playgroundTitle">
        Playground
        <img className="logoImg" src={logo} />
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ textAlign: "left", marginRight: 50, fontSize: 27 }}>
          {currentQuestion[0]?.countAnswered}/{users.length} Users answered the
          question
        </h1>
        <table
          style={{ width: 500, height: 160, marginRight: 50, marginLeft: 50 }}
        >
          <thead>
            <tr>
              <th>קבוצה</th>
              <th>מספר חברים</th>
              <th>תשובות</th>
              <th>נקודות</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((item) => {
              let scr = item.score;
              let usersInTeam = users.filter((u) => u.teamId === item.id);

              usersInTeam.forEach((el) => {
                //pass all the users of this team
                el.AQ.forEach((e) => {
                  const questionRef = useFs.collection("Questions").doc(e.ques);
                  const teamRef = useFs.collection("Teams").doc(item?.id);
                  questionRef.get().then((doc) => {
                    let rightAns = doc.data()?.rightAnswer;
                    let Cost = doc.data()?.cost;
                    let teamScore = item.score;
                    if (rightAns === e.ans) {
                      //check if the right answer of the question in the AQ array is the answer the user select
                      teamRef.update({
                        //    score: teamScore + Cost //update the score of the team
                      });
                    }
                  });
                });
              });

              return (
                <tr>
                  <td>{item.title}</td>
                  <td>{users.filter((u) => u.teamId == item.id).length}</td>
                  <td>{item.answerArray.join(", ")}</td>
                  <td>{item.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
        <table style={{ width: 500, height: 160, marginLeft: 50 }}>
          <thead>
            <tr>
              <th>צוות</th>
              <th>מספר חברים</th>
              <th>תשובות</th>
              <th>נקודות</th>
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
                  <td>{item.title}</td>
                  <td>{users.filter((u) => u.crewId == item.id).length}</td>
                  <td>{item.answerArray.join(", ")}</td>
                  {/* <td>{item.answersArray.length}</td> */}
                  <td>{item.score}</td> {/* scores */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="currQues">
       <h1 style={{paddingTop: 20}}> {currentQuestion[0]?.question}</h1>
      </div>
      <div style={{alignItems: 'center', textAlign: 'center', alignSelf: 'center', alignContent: 'center', justifyContent: 'center'}}>
        <Questions questions={questions} onSelectHandler={onSelect} />
        <Users users={users} crews={crews} teams={teams} />
      </div>
    </div>
  );
}

export default App;
