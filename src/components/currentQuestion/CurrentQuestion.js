import React from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";

function CurrentQuestion(questionTitle) {
        return (
            <div>
                <h1>Current Question:</h1>
                <h1 style={{fontSize: 50}}>{questionTitle}</h1>
            </div>
        );
}

export default CurrentQuestion;
