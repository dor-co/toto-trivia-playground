import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";
import firebase from 'firebase';

function Question({ item, index, id }) {

    const CurrentQuestionRef = useFirestore().collection("CurrentQuestion").doc("CurrentQuestion");

    const question1Ref = useFirestore().collection("Questions").doc(id);
    const question1Status = useFirestoreDocData(question1Ref).status;
    const question1Data = useFirestoreDocData(question1Ref).data;

    const [complete, setComplete] = useState(false);

    const updateCurrentQuestion = () => {
        setComplete(!complete)
        CurrentQuestionRef.update({
            question: question1Data.question
        })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

    if (question1Status === 'loading')
        return <p>loading...</p>;
    else {
        return (
            <div style={{ background: '#e6e6e6' }}>
                <p className={complete ? 'com' : ''} onClick={updateCurrentQuestion}>Question {index + 1}: {item[index].question}</p>
            </div>
        );
    }
}

export default Question;
