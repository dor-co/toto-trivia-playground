//import logo from "./logo.svg";
import "./App.css";
import "firebase/firestore";
import { useFirestoreDocData, useFirestore, firestore, useSuspenseEnabledFromConfigAndContext } from "reactfire";
import User from './components/users/User';
import Question from './components/questions/Question'
import React, { Children, useEffect, useState } from 'react';
// import userEvent from "@testing-library/user-event";
// import { render } from "@testing-library/react";
// import firebase from 'firebase';
import CurrentQuestion from './components/currentQuestion/CurrentQuestion';
import logo from './asserts/logos_a_logos_winner.png';

function App() {
	const [users, setUsers] = useState([]);
	const [ID, setID] = useState([]);
	const temp = [];
	let ids = [];

	const [questions, setQuestions] = useState([]);
	const [quesID, setQuesID] = useState([]);
	const quesTemp = [];
	let quesIds = [];

	useEffect(() => {
		ueCall()
	}, [])

	const db = firestore();

	const ueCall=async()=>{
		const userData = await db.collection('Users').get();
			userData.forEach((doc) => {
				ids.push(doc.id);
				temp.push(doc.data());
			})
			setUsers(temp);
			setID(ids)
		
		const questionData = await db.collection('Questions').get();
			questionData.forEach((doc) => {
				quesIds.push(doc.id);
				quesTemp.push(doc.data());
			})
			setQuestions(quesTemp); //array of object of all the questions
			//console.log(quesTemp)
			setQuesID(quesIds) //array of the ids of the questions
			//console.log(quesIds)
	}
	
	const displayScoreRef = useFirestore().collection('Dashboard').doc('Dashboard');

	const refresh = () => {
		displayScoreRef.update({
		showScore: true
		})
		setTimeout(function(){
			displayScoreRef.update({
			showScore: false
		}) }, 0);
	}

	return (
		<div>
			<h1 className='playgroundTitle'>Playground<img className='logoImg' src={logo} /></h1>
			<button className='refreshBtn' onClick={refresh}>refresh dashboard</button>
			<div className="currQues">
				<CurrentQuestion />
			</div>
			<div className="App">
				<div className='que'>
					<h2>Questions List:</h2>
					{questions.map((item) => {
						return (
							<Question
								key={item.id}
								item={item}
								//index={index} //for display - Question # 
								//id={quesID[index]} //for the reference save isSelected field
							/>
						)
					})}
				</div>
				<div className='us'>
					<h2>Users:</h2>
					{users.map((item, index) => {
						return (
							<User
								key={item.id}
								item={item}
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
