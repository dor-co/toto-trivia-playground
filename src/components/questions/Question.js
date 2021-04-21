import React, { useState, useEffect } from "react";
import "firebase/firestore";
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import "./Style.css";

function Question({ item, onSelectHandler }) {

  const questionRef = useFirestore().collection("Questions").doc(item.id);

  const deleteQuestion = () => {
    questionRef.delete();
    console.log('question deleted!')
  };

  return (
    <tr>
      <td>{item.question}</td>
      <td>{item.isUsed?"yes":"no"}</td>
      <td>{item.index}</td>
 
      <td>
        <table style={{ width: '100%', marginBottom: 10, marginLeft: 10}}>
          <tr>
            <td style={{ fontWeight: "bold" }}>תשובה</td>
            <td style={{ fontWeight: "bold" }}>מחיר</td>
            <td style={{ fontWeight: "bold" }}>תשובה נכונה</td>
          </tr>
          {item.answers.map((answer) => {
            return (
              <tr>
                <td>{answer.answer}</td>
                <td>{answer.price}</td>
                <td>{answer.isCorrect ? "yes" : "no"}</td>
              </tr>
            );
          })}
        </table>
      </td>
      
      <td>
        {" "}
        <button
          className="userBtn deleteUser"
          onClick={() => {
            // if (window.confirm("are you sure?")) {
            onSelectHandler(item);
            // }
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
    </tr>
  );
}

export default Question;
