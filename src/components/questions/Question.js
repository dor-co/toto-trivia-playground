import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import firebase from 'firebase';
import './Style.css';

function Question({ item }) {

    const CurrentQuestionRef = useFirestore().collection("CurrentQuestion").doc("CurrentQuestion");
    const CurrentQuestionData = useFirestoreDocData(CurrentQuestionRef).data;

    const prevRef = useFirestore().collection("CurrentQuestion").doc('PrevQuestion');

    // const question1Ref = useFirestore().collection("Questions").doc(id);
    // const question1Status = useFirestoreDocData(question1Ref).status;
    // const question1Data = useFirestoreDocData(question1Ref).data;

    const [complete, setComplete] = useState(false);

    const updateCurrentQuestion = () => {
        setComplete(!complete);
        if (CurrentQuestionData.cost == undefined) {
            prevRef.set({
                cost: null,
                questionIndex: null,
                rightAnswer: null,
                question: null
            }).then(() => {
                CurrentQuestionRef.update({                    
                    //index: index + 1,
                    questionIndex: 1,
                    question: item.question,
                    answer1: item.answer1,
                    answer2: item.answer2,
                    answerX: item.answerX,
                    rightAnswer: item.rightAnswer,
                    cost: item.cost,
                    id: item.NO_ID_FIELD,
                }).then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }).catch((error) => console.log('Error write data to prev question', error));
        }
        else {
            // question1Ref.update({
            //     isSelected: true
            // })
            prevRef.update({
                cost: CurrentQuestionData.cost,
                rightAnswer: CurrentQuestionData.rightAnswer,
                question: CurrentQuestionData.question
            }).then(() => {
                CurrentQuestionRef.update({
                    //index: index + 1,
                    questionIndex: CurrentQuestionData.questionIndex + 1,
                    question: item.question,
                    answer1: item.answer1,
                    answer2: item.answer2,
                    answerX: item.answerX,
                    rightAnswer: item.rightAnswer,
                    cost: item.cost,
                    //id: item.NO_ID_FIELD, 
                }).then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }).catch((error) => console.log('Error write data to prev question', error));
        }
    }

    // if (question1Status === 'loading')
    //     return <p></p>;
    // else {
        return (
            <div>
                
                {item.isSelected ? <button disabled={true} className='quesStyle com' onClick={updateCurrentQuestion}>Question: {item.question}</button>
                    : <button disabled={false} className='quesStyle' onClick={updateCurrentQuestion}>Question: {item.question}</button>}
            </div>
        );
    }
//}

export default Question;
