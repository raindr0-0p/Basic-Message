import {db,auth} from "./firebase.js";
import {collection,addDoc,onSnapshot,
        deleteDoc,updateDoc,doc,
        serverTimestamp,query,orderBy
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import {GoogleAuthProvider,signInWithPopup,
        signOut,onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const saveBtn=document.getElementById("saveBtn");
const messagesDiv=document.getElementById("messages");
const loginBtn=document.getElementById("loginBtn");
const logoutBtn=document.getElementById("logoutBtn");
const userInfo=document.getElementById("userInfo");

const provider=new GoogleAuthProvider();
let currentUser=null;

loginBtn.addEventListener("click",async()=>{
    if(currentUser){
        alert("Log out first!");
        return;
    }
    try{
        await signInWithPopup(auth,provider);
        renderMessages();
    }catch(error){
        console.log(error);
        alert("Sign in failed");
    }
})

logoutBtn.addEventListener("click",async()=>{
    if(!currentUser){
        alert("You are not logged in!");
        return;
    }
    await signOut(auth);
    renderMessages();
})

onAuthStateChanged(auth,(user)=>{
    if(user){
        currentUser=user;
        userInfo.innerHTML=`Logged in as
                            <br>
                            ${user.displayName.length>24?user.displayName.slice(0,21)+"...":user.displayName}`;
    }else{
        currentUser=null;
        userInfo.innerHTML=`Not logged in`;
    }
})

let qSnap=[];

function renderMessages(){
    messagesDiv.innerHTML="";
    qSnap.forEach((doc)=>{
        const data=doc.data();
        messagesDiv.innerHTML+=`
            <div class="message">
                <h3>${escapeHTML(data.name)}:</h3>
                <p>${escapeHTML(data.message)}</p>
                <small>${data.createdAt?data.createdAt.toDate():"No timestamp"}</small>
                <br>
                <small>${data.editedAt?"Latest edition: "+data.editedAt.toDate():""}</small>
                <br><br>
                ${currentUser&&currentUser.uid===data.uid?
                `<button onclick="deleteMessage('${doc.id}')">Delete</button>
                <button onclick="editMessage('${doc.id}')">Edit</button>`
                :""}
            </div>
        `;
    });
    document.getElementById("counter").innerHTML=`Total messages: ${qSnap.size}`;
}

function loadMessages(){
    onSnapshot(query(collection(db,"messages"),orderBy("createdAt","desc")),(querySnapshot)=>{
        qSnap=querySnapshot;
        renderMessages();
    });
}

saveBtn.addEventListener("click",async()=>{
    if(!currentUser){
        alert("Please log in first!");
        return;
    }
    const message=document.getElementById("message");
    if(message.value.trim()===""){
        return;
    }
    await addDoc(collection(db,"messages"),{
        name:currentUser.displayName,
        uid:currentUser.uid,
        message:message.value,
        createdAt:serverTimestamp()
    })
    message.value="";
})

window.deleteMessage=async function(id){
    if(confirm("Delete this message?")){
        await deleteDoc(doc(db,"messages",id));
    }
}

window.editMessage=async function(id){
    const newMessage=prompt("Enter new message");
    if(newMessage===null||newMessage.trim()===""){
        return;
    }
    await updateDoc(doc(db,"messages",id),{
        message:newMessage,
        editedAt:serverTimestamp()
    });
}

function escapeHTML(str){
    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

loadMessages();