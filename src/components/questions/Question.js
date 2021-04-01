import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";
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
        prevRef.update({
            cost: CurrentQuestionData.cost,
            rightAnswer: CurrentQuestionData.rightAnswer
        }).then(() => {
            CurrentQuestionRef.update({
                index: index+1,
                question: question1Data.question,
                answer1: question1Data.answer1,
                answer2: question1Data.answer2,
                answerX: question1Data.answerX,
                rightAnswer: question1Data.rightAnswer,
                cost: question1Data.cost
            })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }).catch((error) => console.log('Error write data to prev question', error));
    }

    if (question1Status === 'loading')
        return <p></p>;
    else {
        return (
            <div>
                <p className={complete ? 'quesStyle com' : 'quesStyle'} onClick={updateCurrentQuestion}>Question {index + 1}: {item[index].question}</p>
            </div>
        );
    }
}

export default Question;
