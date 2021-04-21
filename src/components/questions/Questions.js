import React, { useState, useEffect } from "react";
import "firebase/firestore";
import Question from "./Question"
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import "./Style.css";

function Questions({ questions ,onSelectHandler}) {
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [answerInputPrice, setAnswerInputPrice] = useState();
  const [answerInputIsCorrect, setAnswerInputIsCorrect] = useState("בחר האם התשובה נכונה");
  const [openAnswerInput, setOpenAnswerInput] = useState(false);
  const [newDocId, setNewDocId] = useState(""); 
  const db = useFirestore();

  const closeAnswerField = () => {
    setOpenAnswerInput(false);
    setAnswerInput("")
  }

  const addQuestion = () => {
    setOpenAnswerInput(true)
    if (questionInput != "" ) {
      setOpenAnswerInput(true)
      db.collection("Questions")
        .add({
          answers: [],
          index: 0,
          isUsed: false,
          question: questionInput
        })
        .then((function(docRef){
          setQuestionInput("");
          setNewDocId(docRef.id);
        }))
    } else {
      alert("please enter question");
    }
  };

  const addAnswer = () => {
    let newAnswersArray = [];
    db.collection("Questions").doc(newDocId).get().then((doc) => {
      newAnswersArray = doc.data().answers;
      newAnswersArray.push({answer: answerInput, isCorrect: (answerInputIsCorrect === "true"), price: parseInt(answerInputPrice)})
      if (answerInput != "" && answerInputPrice != "" && answerInputIsCorrect != "" &&  answerInputIsCorrect != "בחר האם התשובה נכונה") {
        setAnswerInput("");
        setAnswerInputPrice("");
        setAnswerInputIsCorrect("בחר האם התשובה נכונה");
        db.collection("Questions").doc(newDocId)
          .update({
            answers: newAnswersArray
          })
          .then(() => setAnswerInput(""), setAnswerInputPrice(""), setAnswerInputIsCorrect("בחר האם התשובה נכונה"));
        } else {
          alert("please fill in all fields");
        }
    })
  };

  questions = questions.sort((a,b)=>(a.index>b.index)?1:((b.index>a.index)?-1:0));
  return (
    <div className="que">
    <h2>Questions List:</h2>
    <table style={{ direction: "rtl", width: '100%' }}>
      <thead>
        <tr>
          <th>שאלה</th>
          <th>isUsed</th>
          <th>Index</th>
          <th>תשובות</th>
          {/* <th></th> */}
          {/* <th></th> */}
        </tr>
      </thead>
      <tbody>
        {questions.map((item) => {
          return (
            <Question
              key={item.id}
              item={item}
              onSelectHandler={onSelectHandler}
            />
          );
        })}
      </tbody>
      <td>
        <input 
          value={questionInput}
          style={{width: 180}}
          placeholder='הוסף שאלה'
          type="text"
          id="newQuestion"
          onClick={closeAnswerField}
          onChange={(e) => setQuestionInput(e.currentTarget.value)} />
      </td>
      <td>
        <button className="userBtn" onClick={addQuestion}>
          add question
        </button>
      </td>
      
      {openAnswerInput ? (
      <tr>
        <td>
          <input 
            value={answerInput}
            style={{width: 180}}
            placeholder='הכנס תשובה'
            type="text"
            id="newAnswerText"
            onChange={(e) => {
              setAnswerInput(e.currentTarget.value) 
            }} />
        </td>
        <td>
          <input 
            value={answerInputPrice}
            style={{width: 180}}
            placeholder='הכנס מחיר'
            type="number"
            id="newAnswerPrice"
            onChange={(e) => {
              setAnswerInputPrice(e.currentTarget.value) 
            }} />
        </td>
        <td>
          <select value={answerInputIsCorrect} onChange={(e) => {
            setAnswerInputIsCorrect(e.currentTarget.value)
          }} 
            style={{height: 22}}>
            <option selected disabled>בחר האם התשובה נכונה</option>
            <option value='true'>כן</option>
            <option value='false'>לא</option>
          </select>
        </td>
      <td>
        <button className="userBtn" onClick={addAnswer}>
          add answer
        </button>
      </td>
      </tr>) : (
        null
      )}
      
    </table>
    
  </div>
  );
}

export default Questions;