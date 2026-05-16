const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authSection = document.getElementById("authSection");
const notesSection = document.getElementById("notesSection");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const saveBtn = document.getElementById("saveBtn");

const notesContainer = document.getElementById("notesContainer");

const message = document.getElementById("message");

let editingId = null;



// REGISZTRÁCIÓ
registerBtn.addEventListener("click", async () => {

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {

        alert("Minden mező kötelező");
        return;

    }

    try {

        const response = await fetch("http://localhost:3000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (data.error) {

            message.textContent = data.error;

        } else {

            message.textContent = "Sikeres regisztráció!";

        }

    } catch (error) {

        console.error(error);

    }

});



// LOGIN
loginBtn.addEventListener("click", async () => {

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {

        alert("Minden mező kötelező");
        return;

    }

    try {

        const response = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (data.token) {

            localStorage.setItem("token", data.token);

            authSection.style.display = "none";
            notesSection.style.display = "block";

            loadNotes();

        } else {

            message.textContent = data.error;

        }

    } catch (error) {

        console.error(error);

    }

});



// LOGOUT
logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    authSection.style.display = "block";
    notesSection.style.display = "none";

    notesContainer.innerHTML = "";

});



// JEGYZETEK BETÖLTÉSE
async function loadNotes() {

    try {

        const response = await fetch("http://localhost:3000/notes", {

            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }

        })

        const notes = await response.json();

        notesContainer.innerHTML = "";

        notes.forEach(note => {

            const div = document.createElement("div");

            div.classList.add("note");

            div.innerHTML = `
                <h3>${note.title}</h3>

                <p>${note.content}</p>

                <button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">
                    Szerkesztés
                </button>

                <button onclick="deleteNote(${note.id})">
                    Törlés
                </button>
            `;

            notesContainer.appendChild(div);

        });

    } catch (error) {

        console.error(error);

    }

}



// JEGYZET MENTÉS
saveBtn.addEventListener("click", async () => {

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {

        alert("Minden mezőt tölts ki!");
        return;

    }

    try {

        // SZERKESZTÉS
        if (editingId) {

            await fetch(`http://localhost:3000/notes/${editingId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${localStorage.getItem("token")}`

                },

                body: JSON.stringify({
                    title,
                    content
                })

            });

            editingId = null;

            saveBtn.textContent = "Jegyzet mentése";

        }

        // ÚJ JEGYZET
        else {

            await fetch("http://localhost:3000/notes", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${localStorage.getItem("token")}`

                },

                body: JSON.stringify({
                    title,
                    content
                })

            });

        }

        titleInput.value = "";
        contentInput.value = "";

        loadNotes();

    } catch (error) {

        console.error(error);

    }

});



// TÖRLÉS
async function deleteNote(id) {

    try {

        await fetch(`http://localhost:3000/notes/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${localStorage.getItem("token")}`

            }

        });

        loadNotes();

    } catch (error) {

        console.error(error);

    }

}



// SZERKESZTÉS
function editNote(id, title, content) {

    editingId = id;

    titleInput.value = title;
    contentInput.value = content;

    saveBtn.textContent = "Jegyzet frissítése";

}



// AUTO LOGIN
const token = localStorage.getItem("token");

if (token) {

    authSection.style.display = "none";
    notesSection.style.display = "block";

    loadNotes();

}