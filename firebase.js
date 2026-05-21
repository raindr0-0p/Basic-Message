
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBsdjiM82a-sqGOrwn1uDDa9PGB9Rxg1Vk",
    authDomain: "test-project-c030f.firebaseapp.com",
    projectId: "test-project-c030f",
    storageBucket: "test-project-c030f.firebasestorage.app",
    messagingSenderId: "1049419781004",
    appId: "1:1049419781004:web:fcf5d5b123a911e19ebca9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  export{db};