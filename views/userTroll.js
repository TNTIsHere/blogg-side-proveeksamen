// Import Firebase
import { initializeApp } from "firebase/app"
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDNUeFgdgS4CbBAD2WQ5rVk9IOQEkyvHGE",
    authDomain: "proveeksamen-april.firebaseapp.com",
    projectId: "proveeksamen-april",
    storageBucket: "proveeksamen-april.appspot.com",
    messagingSenderId: "363829029809",
    appId: "1:363829029809:web:9e46d43a614173fa4d2b90"
};

// Initialize Firebase
initializeApp(firebaseConfig)

// Initialize Firebase services
const db = getFirestore()
const auth = getAuth()

// Collection ref
const colRefBlogs = collection(db, "blogs")
const colRefComments = collection(db, "comments")

// Console.log forEach collection data
getDocs(colRefBlogs)
    .then((snapshot) =>{
        let blogs = []
        snapshot.docs.forEach((doc) => {
            blogs.push({ ...doc.data(), id: doc.id})
        })
        console.log(blogs)
    })
    .catch(err => {
        console.log(err.message)
});

getDocs(colRefComments)
    .then((snapshot) =>{
        let comments = []
        snapshot.docs.forEach((doc) => {
            comments.push({ ...doc.data(), id: doc.id})
        })
        console.log(comments)
    })
    .catch(err => {
        console.log(err.message)
});

// Displaying content
getDocs(colRefBlogs)
.then((snapshot) => {
    snapshot.docs.forEach((doc) => {
        let item = doc.data();
        if (item.blogAuthor === "troll") {
            let div = document.createElement("div");
            div.classList.add("result-item");
            let br = document.createElement("br");

            let h1 = document.createElement("h1");
            h1.classList.add("result-h1");
            h1.innerText = `Title: ${item.blogTitle}`;
            div.appendChild(h1);
            div.appendChild(br);

            let p = document.createElement("p");
            p.classList.add("result-p");
            p.innerText = `${item.blogContent}`;
            div.appendChild(p);
            div.appendChild(br);

            let deleteBlog = document.createElement("button")
            deleteBlog.classList.add("blog-delete")
            deleteBlog.innerText = "Delete Blog"
            div.appendChild(deleteBlog)

            let commentDiv = document.createElement("div");
            commentDiv.classList.add("comment-container");

            let h2 = document.createElement("h2")
            h2.classList.add("comments-h2")
            h2.innerText = "Comments:"
            commentDiv.appendChild(h2);

            let label = document.createElement("label")
            label.classList.add("comment-label")
            label.setAttribute("for", "comment")
            commentDiv.appendChild(label)

            let input = document.createElement("input")
            input.classList.add("comment-input")
            input.setAttribute("type", "text")
            input.setAttribute("name", "commentContent")
            input.setAttribute("required", "")
            commentDiv.appendChild(input)

            let submitComment = document.createElement("button")
            submitComment.classList.add("comment-submit")
            submitComment.innerText = "Submit Comment"
            commentDiv.appendChild(submitComment)

            // Adding comment
            submitComment.addEventListener("click", (e) => {
                e.preventDefault()
                addDoc(colRefComments, {
                    commentContent: input.value,
                    blogID: item.blogID
                })
                .then(() => {
                    input.value = "";
                    console.log("Comment Added")
                })
                .catch((err) => {
                    console.log(err.message)
                })
            })

            getDocs(colRefComments)
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    let commentItem = doc.data();

                    if (commentItem.blogID === item.blogID) {
                        let commentp = document.createElement("p");
                        commentp.classList.add("comment-p")
                        commentp.innerText = `${commentItem.commentContent}`
                        commentDiv.appendChild(commentp)
                    }
                    else {

                    }
                })
            })

            document.querySelector("#search-result").appendChild(div);
            div.appendChild(commentDiv);
        }
        else {

        }
    })
})
.catch(err => {
    console.log(err.message)
});


// Login
const loginForm = document.querySelector(".login")
loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log("User logged in:", cred.user)
    })
    .catch((err) => {
        console.log(err.message)
    })
})

// Logout
const logoutButton = document.querySelector(".logout")
logoutButton.addEventListener("click", () => {
    signOut(auth)
    .then(() => {
        console.log("User has logged out");
    })
    .catch((err) => {
        console.log(err.message)
    })
})

// Signup
const signupForm = document.querySelector(".signup")
signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = signupForm.email.value
    const username = signupForm.username.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth, email, username, password)
        .then((cred) => {
            console.log("user created:", cred.user)
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})

// Adding blog
const addBlogForm = document.querySelector(".add")
addBlogForm.addEventListener("submit", (e) => {
    e.preventDefault()
    addDoc(colRefBlogs, {
        blogTitle: addBlogForm.blogTitle.value,
        blogContent: addBlogForm.blogContent.value,
        blogID: addBlogForm.blogID.value,
        blogAuthor: "troll"
    })
    .then(() => {
        addBlogForm.reset()
        console.log("Blog Added")
    })
    .catch((err) => {
        console.log(err.message)
    })
})

// Search Functionality
const searchBar = document.querySelector("#search-bar");
const searchResult = document.querySelector("#search-result");

searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase();
    const items = searchResult.getElementsByClassName("result-item");
    Array.from(items).forEach((item) => {
        if (item.textContent.toLowerCase().indexOf(searchText) !== -1) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});

const deleteBlogForm = document.querySelector(".delete")
deleteBlogForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const docRef = doc(db, "blogs", deleteBlogForm.id.value)
    deleteDoc(docRef)
        .then(() => {
            deleteBlogForm.reset()
            console.log("Object Deleted")
        })       
})

// Change display based on authentication
onAuthStateChanged(auth, (user) => {
    console.log("user status:", user)
        if (user === null){
            signupForm.style.display = "block"
            loginForm.style.display = "block"
            addBlogForm.style.display = "none"
            logoutButton.style.display = "none"
            deleteBlogForm.style.display = "none"
        }
        else if (user.uid === "esxms38H66UsaE9LzgQdET4hQ0w2"){
            addBlogForm.style.display = "block"
            logoutButton.style.display = "block"
            signupForm.style.display = "none"
            loginForm.style.display = "none"
            deleteBlogForm.style.display = "block"
        }
        else {
            addBlogForm.style.display = "none"
            logoutButton.style.display = "block"
            signupForm.style.display = "none"
            loginForm.style.display = "none"
            deleteBlogForm.style.display = "none"
        }
    })