// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBLbEZg0oG1YRA1Dnza52n6KHu7POqbbLs",
	authDomain: "nest-chat-websocket.firebaseapp.com",
	projectId: "nest-chat-websocket",
	storageBucket: "nest-chat-websocket.firebasestorage.app",
	messagingSenderId: "1037218552422",
	appId: "1:1037218552422:web:693fbd4768927c89afaba7",
	measurementId: "G-BBZSEPC3XS",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
