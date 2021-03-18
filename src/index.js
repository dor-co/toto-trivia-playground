import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { FirebaseAppProvider } from "reactfire";

var firebaseConfig = {
	apiKey: "AIzaSyD1ZNGirlaxWU4jZwdBl_9l_ppCTawzpbw",
	authDomain: "tototrivia.firebaseapp.com",
	projectId: "tototrivia",
	storageBucket: "tototrivia.appspot.com",
	messagingSenderId: "382271449481",
	appId: "1:382271449481:web:cad213ffddb26cd4dfd958",
	measurementId: "G-HB8TWY4MNW",
};

ReactDOM.render(
	<React.StrictMode>
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<App />
		</FirebaseAppProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
