import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";
import firebase from 'firebase';

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
                <h1>{CurrentQuestionData?.question}</h1>
            </div>
        );
    }
}

export default CurrentQuestion;
