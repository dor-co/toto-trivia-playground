import logo from "./logo.svg";
import "./App.css";
import "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";

function CurrentQuestion() {
	// easily access the Firestore library
	const questionsRef = useFirestore().collection("Questions").doc("Question1");
	const currentQuestionRef = useFirestore().collection("CurrentQuestion").doc("CurrentQuestion");
	console.log('uri');
	//console.log(currentQuestion);


	// subscribe to a document for realtime updates. just one line!
	//const { status, data } = useFirestoreDocData(currentQuestion);
	const questionsStatus = useFirestoreDocData(questionsRef).status;
	const questionsData = useFirestoreDocData(questionsRef).data;
	const currentQuestionStatus = useFirestoreDocData(currentQuestionRef).status;
	const currentQuestionData = useFirestoreDocData(currentQuestionRef).data;
	//console.log(currentQuestionData);
	//console.log('this is status1: ', status1);

	// easily check the loading status
	if ((currentQuestionStatus === "loading") || (questionsStatus === "loading"))  {
		return <p>Fetching burrito flavor...</p>;
	}

	return <p>The main question is: {currentQuestionData?.question}!</p>;
}

function App() {
	return (
		<div className="App">
			<CurrentQuestion />
		</div>
	);
}

export default App;
