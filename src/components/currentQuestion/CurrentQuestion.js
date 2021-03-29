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
                <p>Current Question: {CurrentQuestionData?.question}</p>
            </div>
        );
    }
}

export default CurrentQuestion;
