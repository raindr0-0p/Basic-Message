import {db} from "./firebase.js";
import {collection,addDoc,getDocs,
        deleteDoc,updateDoc,doc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const saveBtn=document.getElementById("saveBtn");
const messagesDiv=document.getElementById("messages");

async function loadMessages(){
    messagesDiv.innerHTML="";
    const querySnapshot=await getDocs(collection(db,"messages"));
    querySnapshot.forEach((doc)=>{
        const data=doc.data();
        messagesDiv.innerHTML+=`
            <div class="message">
                <h3>${data.name}</h3>
                <p>${data.message}</p>
                <small>${data.createdAt.toLocaleString()}</small>
                <br><br>
                <button onclick="deleteMessage('${doc.id}')">Delete</button>
                <button onclick="editMessage('${doc.id}')">Edit</button>
            </div>
        `;
    });
}

saveBtn.addEventListener("click",async()=>{
    const name=document.getElementById("name").value;
    const message=document.getElementById("message").value;
    if(name===""||message===""){
        alert("Fill all fields");
        return;
    }
    await addDoc(collection(db,"messages"),{
        name:name,
        message:message,
        createdAt:new Date()
    })
    loadMessages();
})
loadMessages();

window.deleteMessage=async function(id){
    await deleteDoc(doc(db,"messages",id));
    loadMessages();
}

window.editMessage=async function(id){
    const newMessage=prompt("Enter new message");
    if(newMessage===null||newMessage===""){
        return;
    }
    await updateDoc(doc(db,"messages",id),{
        message:newMessage
    });
    loadMessages();
}