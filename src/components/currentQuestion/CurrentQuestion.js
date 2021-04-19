import React from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";

function CurrentQuestion() {

    const CurrentQuestionRef = useFirestore().collection("CurrentQuestion").doc("CurrentQuestion");
    const CurrentQuestionStatus = useFirestoreDocData(CurrentQuestionRef).status;
    const CurrentQuestionData = useFirestoreDocData(CurrentQuestionRef).data;

    if (CurrentQuestionStatus === 'loading')
        return <p>loading...</p>;
    else {
        return (
            <div>
                <h1>Current Question:</h1>
                <h1 style={{fontSize: 50}}>{CurrentQuestionData?.question}</h1>
            </div>
        );
    }
}

export default CurrentQuestion;
