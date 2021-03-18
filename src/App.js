import logo from "./logo.svg";
import "./App.css";
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";

function Burrito() {
	// easily access the Firestore library
	const burritoRef = useFirestore().collection("Questions").doc("Question1");

	// subscribe to a document for realtime updates. just one line!
	const { status, data } = useFirestoreDocData(burritoRef);

	// easily check the loading status
	if (status === "loading") {
		return <p>Fetching burrito flavor...</p>;
	}

	return <p>The burrito is {data.QuestionTitle}!</p>;
}

function App() {
	return (
		<div className="App">
			<Burrito />
		</div>
	);
}

export default App;
