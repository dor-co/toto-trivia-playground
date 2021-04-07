import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import firebase from 'firebase';
import './Style.css';

function Question({ item, index, id }) {

    const CurrentQuestionRef = useFirestore().collection("CurrentQuestion").doc("CurrentQuestion");
    const CurrentQuestionData = useFirestoreDocData(CurrentQuestionRef).data;

    const prevRef = useFirestore().collection("CurrentQuestion").doc('PrevQuestion');

    const question1Ref = useFirestore().collection("Questions").doc(id);
    const question1Status = useFirestoreDocData(question1Ref).status;
    const question1Data = useFirestoreDocData(question1Ref).data;

    const [complete, setComplete] = useState(false);

    const updateCurrentQuestion = () => {
        setComplete(!complete);
        question1Data.isSelected = true
        if (CurrentQuestionData.cost == undefined) {
            question1Ref.update({
                isSelected: true
            })
            prevRef.set({
                cost: null,
                questionIndex: null,
                rightAnswer: null,
                question: null
            }).then(() => {
                CurrentQuestionRef.update({
                    index: index + 1,
                    questionIndex: 1,
                    question: question1Data.question,
                    answer1: question1Data.answer1,
                    answer2: question1Data.answer2,
                    answerX: question1Data.answerX,
                    rightAnswer: question1Data.rightAnswer,
                    cost: question1Data.cost,
                    id: question1Data.NO_ID_FIELD,
                }).then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }).catch((error) => console.log('Error write data to prev question', error));
        }
        else {
            question1Ref.update({
                isSelected: true
            })
            prevRef.update({
                cost: CurrentQuestionData.cost,
                rightAnswer: CurrentQuestionData.rightAnswer,
                question: CurrentQuestionData.question
            }).then(() => {
                CurrentQuestionRef.update({
                    index: index + 1,
                    questionIndex: CurrentQuestionData.questionIndex + 1,
                    question: question1Data.question,
                    answer1: question1Data.answer1,
                    answer2: question1Data.answer2,
                    answerX: question1Data.answerX,
                    rightAnswer: question1Data.rightAnswer,
                    cost: question1Data.cost,
                    id: question1Data.NO_ID_FIELD,
                    //Answers: question1Data.collection("Answers").doc('test'),
 
                }).then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }).catch((error) => console.log('Error write data to prev question', error));
        }
    }

    if (question1Status === 'loading')
        return <p></p>;
    else {
        return (
            <div>
                
                {question1Data?.isSelected ? <button disabled={true} className='quesStyle com' onClick={updateCurrentQuestion}>Question {index + 1}: {item.question}</button>
                    : <button disabled={false} className='quesStyle' onClick={updateCurrentQuestion}>Question {index + 1}: {item.question}</button>}
            </div>
        );
    }
}

export default Question;
