import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import firebase from 'firebase';
import { useFirestoreDocData, useFirestore, firestore } from "reactfire";
import './Style.css';
import Selector from '../selector/Selector';

function User({ item, index, id }) {
	const [dropdown, setDropdown] = useState(false)
	const [renderCount, setRenderCount] = useState(0);

	const userRef = useFirestore().collection("Users").doc(id);
	const userRefStatus = useFirestoreDocData(userRef).status;
    const userRefData = useFirestoreDocData(userRef).data;

	const [teams, setTeams] = useState([]);
	const [teamsID, setTeamsID] = useState([]);
	const teamsTemp = [];
	let teamsIds = [];

	if (renderCount < 1) {
		setRenderCount(1)
		firestore().collection('Teams').get().then((querySnapshot) => { //need to fix it, slow the prosses
			querySnapshot.forEach((doc) => {
				teamsIds.push(doc.id);
				teamsTemp.push(doc.data().id);
			})
			setTeams(teamsTemp);
			setTeamsID(teamsIds)
		})
	}

	

	const deleteUser = () => {
		userRef.delete().then(() => {
			console.log("Document successfully deleted!");
		}).catch((error) => {
			console.error("Error removing document: ", error);
		});
	}

	const updateUser = () => {
		setDropdown(!dropdown)
		console.log(dropdown)
	}

	const update = () => {
		var e = document.getElementById("jobTitle");
		console.log(e.value);
		userRef.update({
			job: e.value
		})
			.then(() => {
				console.log("Document successfully written!");
			})
			.catch((error) => {
				console.error("Error writing document: ", error);
			});
	}
	if (userRefStatus === 'loading')
		return <p>loading...</p>;
	else {
		return (
			<div className='userStyle'>
				<p>Username: {item[index].Name}</p>
				<p>Job Title: {userRefData?.job}</p>
				{/* <p>ID: {id}</p> */}
				<button className='userBtn deleteUser' onClick={deleteUser}>delete user</button>
				{dropdown ? (
					<>
						<button className='userBtn' onClick={updateUser}>hide dropdown</button>
						<div>
						<select name="jobTitle" id="jobTitle">


							{teamsID.map((item, index) => {
								return (
									<Selector
										key={item}
										item={item}
										index={index}
										id={teamsID[index]} />
								)
							})}
							</select>
							<button className='userBtn' onClick={update}>update</button>
							
						</div>
					</>) : (
					<button className='userBtn' onClick={updateUser}>update user</button>
				)}
				<br />
			</div>
		);
	}
}

export default User;
