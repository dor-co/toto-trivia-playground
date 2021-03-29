import logo from "./logo.svg";
import "./App.css";
import "firebase/firestore";
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import User from './components/users/User';
import Question from './components/questions/Question'
import React, { Children, useEffect, useState } from 'react';
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import firebase from 'firebase';
import CurrentQuestion from './components/currentQuestion/CurrentQuestion'

function App() {

	const [renderCount, setRenderCount] = useState(0);

	const [users, setUsers] = useState([]);
	const [ID, setID] = useState([]);
	const temp = [];
	let ids = [];

	const [questions, setQuestions] = useState([]);
	const [quesID, setQuesID] = useState([]);
	const quesTemp = [];
	let quesIds = [];

	useEffect(() => {

	}, [])


	if (renderCount < 1) {
		firestore().collection('Users').get().then((querySnapshot) => { //need to fix it, slow the prosses
			setRenderCount(1)
			querySnapshot.forEach((doc) => {
				ids.push(doc.id);
				temp.push(doc.data());
			})
			setUsers(temp);
			setID(ids)
		})

		firestore().collection('Questions').get().then((querySnapshot) => { //need to fix it, slow the prosses
			querySnapshot.forEach((doc) => {
				quesIds.push(doc.id);
				quesTemp.push(doc.data());
			})
			setQuestions(quesTemp);
			setQuesID(quesIds)
		})
	}

	return (
		<div>
			<h1>playground</h1>
			<div className="currQues">
				<CurrentQuestion />
			</div>
			<div className="App">
				<div className='que'>
					{users.map((item, index) => {
						return (
							<Question
								key={item.id}
								item={questions}
								index={index}
								id={quesID[index]} />
						)
					})}
				</div>
				<div className='us'>

					{users.map((item, index) => {
						return (
							<User
								key={item.id}
								item={users}
								index={index}
								id={ID[index]}
							/>
						)
					})}</div>
			</div>
		</div>
	);
}

export default App;
