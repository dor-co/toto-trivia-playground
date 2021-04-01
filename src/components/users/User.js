import React, { useState, useEffect } from 'react';
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";
import firebase from 'firebase';
import './Style.css';

function User({ item, index, id }) {
	const [dropdown, setDropdown] = useState(false)

	const userRef = useFirestore().collection("Users").doc(id);
	const userRefStatus = useFirestoreDocData(userRef).status;
    const userRefData = useFirestoreDocData(userRef).data;

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
								<option value="developer">developer</option>
								<option value="qa">qa</option>
								<option value="manager">manager</option>
								<option value="sells">sells</option>
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
