import React, { useState, useEffect } from "react";
import "firebase/firestore";
import Question from "./Question"
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import "./Style.css";
import * as AiIcons from 'react-icons/ai';

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
    setAnswerInput("");
    setAnswerInputPrice("");
    setAnswerInputIsCorrect("בחר האם התשובה נכונה");
  }

  const addQuestion = () => {
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
    <h2 style={{color: '#0d1336'}}>Questions List:</h2>
    <table style={{ border: '1px solid rgb(207, 207, 207)', direction: "rtl", width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          <th className="thStyle">שאלה</th>
          <th className="thStyle">isUsed</th>
          <th className="thStyle">Index</th>
          <th className="thStyle">תשובות</th>
          <th className="thStyle"></th>
          <th className="thStyle"></th>
          <th className="thStyle"></th>
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
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
        <input 
          value={questionInput}
          style={{width: 180}}
          placeholder='הוסף שאלה'
          type="text"
          id="newQuestion"
          onClick={closeAnswerField}
          onChange={(e) => setQuestionInput(e.currentTarget.value)} />
      </td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
        <button className="userBtn" onClick={addQuestion}>
          add question
        </button>
      </td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
      <td style={{background: '#e8e8e8'}}></td>
      {openAnswerInput ? (
      <tr style={{background: '#e8e8e8'}}>
        <td style={{borderLeftStyle: 'hidden', paddingTop: 5}}>
          <AiIcons.AiOutlineCloseCircle className='closeAddAnswerBtn' onClick={closeAnswerField}/>
        </td>
        <td style={{borderLeftStyle: 'hidden'}}>
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
        <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
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
        <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}>
          <select value={answerInputIsCorrect} onChange={(e) => {
            setAnswerInputIsCorrect(e.currentTarget.value)
          }} 
            style={{height: 22}}>
            <option selected disabled>בחר האם התשובה נכונה</option>
            <option value='true'>כן</option>
            <option value='false'>לא</option>
          </select>
        </td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
      <td style={{background: '#e8e8e8', borderLeftStyle: 'hidden'}}></td>
      <td style={{background: '#e8e8e8'}}>
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