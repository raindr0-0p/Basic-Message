import {db} from "./firebase.js";
import {collection,addDoc,onSnapshot,
        deleteDoc,updateDoc,doc,
        serverTimestamp,query,orderBy
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const saveBtn=document.getElementById("saveBtn");
const messagesDiv=document.getElementById("messages");

function loadMessages(){
    onSnapshot(query(collection(db,"messages"),orderBy("createdAt","desc")),(querySnapshot)=>{
        messagesDiv.innerHTML="";
        querySnapshot.forEach((doc)=>{
            const data=doc.data();
            messagesDiv.innerHTML+=`
                <div class="message">
                    <h3>${data.name}:</h3>
                    <p>${data.message}</p>
                    <small>${data.createdAt?data.createdAt.toDate():"No timestamp"}</small>
                    <br>
                    <small>${data.editedAt?"Latest edition: "+data.editedAt.toDate():""}</small>
                    <br><br>
                    <button onclick="deleteMessage('${doc.id}')">Delete</button>
                    <button onclick="editMessage('${doc.id}')">Edit</button>
                </div>
            `;
        });
        document.getElementById("counter").innerHTML=`Total messages: ${querySnapshot.size}`;
    });
}

saveBtn.addEventListener("click",async()=>{
    const name=document.getElementById("name");
    if(name.value.length>100){
        alert("Maximum 100 characters for name");
        return;
    }
    const message=document.getElementById("message");
    if(name.value===""||message.value===""){
        alert("Fill all fields");
        return;
    }
    await addDoc(collection(db,"messages"),{
        name:escapeHTML(name.value),
        message:escapeHTML(message.value),
        createdAt:serverTimestamp()
    })
    name.value="";
    message.value="";
})

window.deleteMessage=async function(id){
    if(confirm("Delete this message?")){
        await deleteDoc(doc(db,"messages",id));
        alert("Message deleted");
    }
}

window.editMessage=async function(id){
    const newMessage=prompt("Enter new message");
    if(newMessage===null||newMessage===""){
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