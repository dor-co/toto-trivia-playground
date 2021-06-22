import React, { useState } from "react";
import "firebase/firestore";
import { useFirestore } from "reactfire";
import "./Style.css";
import * as MdIcons from 'react-icons/md';

function Question({ item, onSelectHandler }) {
  const questionRef = useFirestore().collection("Questions").doc(item.id);
  const [showDeleteBtn, setshowDeleteBtn] = useState(false);
  const [answerInput, setAnswerInput] = useState("");
  const [answerInputPrice, setAnswerInputPrice] = useState();
  const [answerInputIsCorrect, setAnswerInputIsCorrect] = useState("בחר האם התשובה נכונה");
  const [editQ, setEditQ] = useState('');

  const db = useFirestore();

  const deleteQuestion = () => {
    questionRef.delete();
    console.log('question deleted!')
  };

  const addAnswer = () => {
    let newAnswersArray = [];
    db.collection("Questions").doc(item.id).get().then((doc) => {
      newAnswersArray = doc.data().answers;
      newAnswersArray.push({answer: answerInput, isCorrect: (answerInputIsCorrect === "true"), price: parseInt(answerInputPrice)})
      if (answerInput != "" && answerInputPrice != "" && answerInputIsCorrect != "" &&  answerInputIsCorrect != "בחר האם התשובה נכונה") {
        setAnswerInput("");
        setAnswerInputPrice("");
        setAnswerInputIsCorrect("בחר האם התשובה נכונה");
        db.collection("Questions").doc(item.id)
          .update({
            answers: newAnswersArray
          })
          .then(() => setAnswerInput(""), setAnswerInputPrice(""), setAnswerInputIsCorrect("בחר האם התשובה נכונה"));
        } else {
          alert("please fill in all fields");
        }
    })
  };

  const deleteAnswer = (arr, answer) => {
    let indexOfDelete = arr.map(function(e) { return e.answer; }).indexOf(answer);
    if(indexOfDelete !== -1){
      arr.splice(indexOfDelete, 1);
      questionRef.update({
        answers: arr
      })
    }
    else{
      console.log('element not exist')
    }
  }

  const editQue = (value) => {
    setEditQ(value)
  }

  const saveEditQues = () => {
    questionRef.update({
      question: editQ
    })
  }

  return (
    <tr>
      {showDeleteBtn ? (
        <td>
          <input 
            style={{width: '75%'}}
            value={editQ}
            onChange={(e) => editQue(e.currentTarget.value)}
            />
          <button className="userBtn" style={{width: 40}} onClick={saveEditQues}>save</button>
        </td>
      ) : (
        <td>{item.question}</td>
      )}
      <td>{item.isUsed?"yes":"no"}</td>
      <td>Q{item.index}</td>
      <td>
        <table style={{ width: '100%', marginLeft: 10, border: 'none', borderCollapse: 'collapse'}}>
          <tr>
            <td style={{ fontWeight: "bold", minWidth: 80, background: '#0d1336', color: '#fff' }}>תשובה</td>
            <td style={{ fontWeight: "bold", minWidth: 80, background: '#0d1336', color: '#fff' }}>מחיר</td>
            <td style={{ fontWeight: "bold", minWidth: 80, background: '#0d1336', color: '#fff' }}>תשובה נכונה</td>
            {showDeleteBtn ? (<td style={{ fontWeight: "bold", minWidth: 80, background: '#0d1336', color: '#fff' }}></td>) : (null)}
          </tr>
          {item.answers.map((answer) => {
            return (
              <>
                <tr style={{direction: 'ltr', border: 'none'}}> 
                  <td style={{alignItems: 'center'}}>{answer.answer} {showDeleteBtn ? (
                    <>
                      <button className='deleteAnswerBtn' onClick={() => deleteAnswer(item.answers, answer.answer)}><MdIcons.MdDeleteForever /></button>
                    </>
                    ) 
                    : (null)}
                  </td>
                  <td>{answer.price}</td>
                  <td>{answer.isCorrect ? "yes" : "no"}</td>
                </tr>
              </>  
            );
          })}
          {showDeleteBtn ? (<tr style={{background: 'rgb(232, 232, 232)'}}>
        <td style={{borderLeftStyle: 'hidden', borderBottomStyle: 'hidden'}}>
          <input 
            value={answerInput}
            style={{width: 160}}
            placeholder='הכנס תשובה'
            type="text"
            id="newAnswerText"
            onChange={(e) => {
              setAnswerInput(e.currentTarget.value) 
            }} />
        </td>
        <td style={{borderLeftStyle: 'hidden', borderBottomStyle: 'hidden'}}>
          <input 
            value={answerInputPrice}
            style={{width: 160}}
            placeholder='הכנס מחיר'
            type="number"
            id="newAnswerPrice"
            onChange={(e) => {
              setAnswerInputPrice(e.currentTarget.value) 
            }} />
        </td>
        <td style={{borderLeftStyle: 'hidden', borderBottomStyle: 'hidden'}}>
          <select 
          value={answerInputIsCorrect} 
          onChange={(e) => {
            setAnswerInputIsCorrect(e.currentTarget.value)
          }} 
            style={{height: 21, marginTop: 1}}>
            <option selected disabled>בחר האם התשובה נכונה</option>
            <option value='true'>כן</option>
            <option value='false'>לא</option>
          </select>
        </td>
          <span style={{display: 'inline-flex', alignItems: 'center', marginTop: 8}}>
            <button className="addAmswerBtn" onClick={addAnswer}><MdIcons.MdAdd /></button>
          </span>
      </tr>) : (null)}
        </table>
      </td>
      <td>
        {" "}
        <button
          className="userBtn deleteUser"
          onClick={() => {
            onSelectHandler(item);
          }}
        >
          ask question
        </button>
      </td>
      <td>
        {" "}
        <button
          className="userBtn deleteUser"
          onClick={() => {
            if (window.confirm("are you sure?")) {
              deleteQuestion();
            }
          }}
        >
          delete question
        </button>
      </td>
      <td>
        {" "}
        <button
          className="userBtn"
          onClick={() => {
            setshowDeleteBtn(!showDeleteBtn)
            setEditQ(item.question)
            setAnswerInput("");
            setAnswerInputPrice("");
            setAnswerInputIsCorrect("בחר האם התשובה נכונה");
          }}
        >
          edit question
        </button>
      </td>
    </tr>
  );
}

export default Question;
