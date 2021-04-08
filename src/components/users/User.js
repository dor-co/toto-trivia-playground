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

	const [crews, setCrews] = useState([]);
	const [crewsID, setCrewsID] = useState([]);
	const crewsTemp = [];
	let crewsIds = [];

	const db = firestore();

	useEffect(() => {
		ueCall()
	}, [])

	const ueCall=async()=>{
		const teamData = await db.collection('Teams').get(); //need to fix it, slow the prosses
			teamData.forEach((doc) => {
				teamsIds.push(doc.id);
				teamsTemp.push(doc.data());
			})
			setTeams(teams);
			setTeamsID(teamsIds)

			const crewData = await db.collection('Crews').get(); //need to fix it, slow the prosses
			crewData.forEach((doc) => {
				crewsIds.push(doc.id);
				crewsTemp.push(doc.data());
			})
			setCrews(crews);
			setCrewsID(crewsIds)
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

	const updateCrew = () => {
		var e = document.getElementById("crew");
		console.log(e.value);
		userRef.update({
			crew: e.value
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
				<p>Username: {item.firstName}</p>
				<p>Job Title: {userRefData?.job}</p>
				<p>Crew: {userRefData?.crew}</p>
				<button className='userBtn deleteUser' onClick={deleteUser}>delete user</button>
				{dropdown ? (
					<>
						<button className='userBtn' onClick={updateUser}>hide dropdown</button>
						<div>
							<p>
								<h4>update job title:</h4>
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
							</p>

							<p>
								<h4>update crew:</h4>
								<select name="crew" id="crew">
									{crewsID.map((item, index) => {
										return (
											<Selector
												key={item}
												item={item}
												index={index}
												id={crewsID[index]} />
										)
									})}
								</select>
								<button className='userBtn' onClick={updateCrew}>update</button>
							</p>

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
