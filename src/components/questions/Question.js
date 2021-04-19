import React, { useState, useEffect } from "react";
import "firebase/firestore";
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import "./Style.css";

function Question({ item }) {

  const [teams, setTeams] = useState([]);
  const [crews, setCrews] = useState([]);
  const db = firestore();

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

  useItems("Teams", setTeams, teams);
  useItems("Crews", setCrews, crews);

  const CurrentQuestionRef = useFirestore()
    .collection("CurrentQuestion")
    .doc("CurrentQuestion");
  const CurrentQuestionData = useFirestoreDocData(CurrentQuestionRef).data;

  const question1Ref = useFirestore().collection("Questions").doc(item.id);
  const question1Data = useFirestoreDocData(question1Ref).data;

  const prevRef = useFirestore().collection("CurrentQuestion").doc("PrevQuestion");

  const [complete, setComplete] = useState(false);

  const updateCurrentQuestion = () => {
    setComplete(!complete);

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

    if (CurrentQuestionData.cost === undefined) {
      prevRef
        .set({
          cost: null,
          questionIndex: null,
          rightAnswer: null,
          question: null,
        })
        .then(() => {
          CurrentQuestionRef.update({
            questionIndex: 1,
            question: item.question,
            answer1: item.answer1,
            answer2: item.answer2,
            answerX: item.answerX,
            rightAnswer: item.rightAnswer,
            cost: item.cost,
            id: item.id,
            countAnswered: 0
          })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        })
        .catch((error) =>
          console.log("Error write data to prev question", error)
        );
    } else {
        question1Ref
        .update({
          isSelected: !question1Data.isSelected,
        })
        .then(() => {
          console.log(
            "Document successfully written!",
            question1Data.isSelected
          );
        });

      question1Ref
        .update({
          isSelected: !question1Data.isSelected,
        })
        .then(() => {
          console.log(
            "Document successfully written!",
            question1Data.isSelected
          );
        });

      prevRef
        .update({
          cost: CurrentQuestionData.cost,
          rightAnswer: CurrentQuestionData.rightAnswer,
          question: CurrentQuestionData.question,
        })
        .then(() => {
          CurrentQuestionRef.update({
            questionIndex: CurrentQuestionData.questionIndex + 1,
            question: item.question,
            answer1: item.answer1,
            answer2: item.answer2,
            answerX: item.answerX,
            rightAnswer: item.rightAnswer,
            cost: item.cost,
            id: item.id,
            countAnswered: 0
          })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        })
        .catch((error) =>
          console.log("Error write data to prev question", error)
        );
    }
  };

  return (
    <div>
      <button
        className={item.isSelected ? "quesStyle com" : "quesStyle"}
        onClick={updateCurrentQuestion}
      >
        Question: {item.question}
      </button>
    </div>
  );
}

export default Question;
