document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("authContainer");

    if (container) {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get("mode");

        if (mode === "register") {
            container.innerHTML = `
                <h2>Register</h2>
                <input type="text" id="regUser" placeholder="Username">
                <input type="password" id="regPass" placeholder="Password">
                <button onclick="register()">Register</button>
            `;
        } else {
            container.innerHTML = `
                <h2>Login</h2>
                <input type="text" id="loginUser" placeholder="Username">
                <input type="password" id="loginPass" placeholder="Password">
                <button onclick="login()">Login</button>
            `;
        }
    }

    if (window.location.pathname.includes("events.html")) {
        if (sessionStorage.getItem("loggedIn") !== "true") {
            alert("Please login first!");
            window.location.href = "index.html";
        } else {
            loadEvents();
        }
    }
});

function register() {
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value.trim();

    console.log("Registering with:", username, password);

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Server response:", data);
        alert(data.message);

        if (data.success) {
            console.log("✅ Registration successful. Redirecting...");
            window.location.href = "auth.html?mode=login";
        } else {
            console.log("❌ Registration failed:", data.message);
        }
    })
    .catch(err => console.error("Register error:", err));
}



function login() {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    console.log("Logging in with:", username, password);

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        console.log("Raw response:", res);
        return res.json();
    })
    .then(data => {
        console.log("Login JSON:", data);
        alert(data.message);

        if (data.success) {
            console.log("✅ Login success. Saving session + redirecting.");
            sessionStorage.setItem("loggedIn", "true");
            sessionStorage.setItem("currentUser", username);
            window.location.href = "events.html";
        } else {
            console.log("❌ Login failed.");
        }
    })
    .catch(err => {
        console.error("Login error:", err);
        alert("Login failed due to network or server error.");
    });
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function addEvent() {
    const input = document.getElementById("eventInput");
    const event = input.value.trim();

    if (!event) {
        alert("Enter an event!");
        return;
    }

    const user = sessionStorage.getItem("currentUser");
    let events = JSON.parse(localStorage.getItem("events_" + user)) || [];
    events.push(event);
    localStorage.setItem("events_" + user, JSON.stringify(events));
    input.value = "";
    loadEvents();
}

function loadEvents() {
    const eventsList = document.getElementById("eventsList");
    if (!eventsList) return;

    const user = sessionStorage.getItem("currentUser");
    let events = JSON.parse(localStorage.getItem("events_" + user)) || [];

    eventsList.innerHTML = "";
    events.forEach((event, index) => {
        const li = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = event;
        li.appendChild(textSpan);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginLeft = "10px";
        editBtn.onclick = () => editEvent(index, textSpan);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "5px";
        deleteBtn.onclick = () => deleteEvent(index);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        eventsList.appendChild(li);
    });
}

function editEvent(index, textSpan) {
    const user = sessionStorage.getItem("currentUser");
    let events = JSON.parse(localStorage.getItem("events_" + user)) || [];

    const newEvent = prompt("Edit your event:", events[index]);
    if (newEvent !== null && newEvent.trim() !== "") {
        events[index] = newEvent.trim();
        localStorage.setItem("events_" + user, JSON.stringify(events));
        loadEvents();
    }
}

function deleteEvent(index) {
    const user = sessionStorage.getItem("currentUser");
    let events = JSON.parse(localStorage.getItem("events_" + user)) || [];

    if (confirm("Are you sure you want to delete this event?")) {
        events.splice(index, 1);
        localStorage.setItem("events_" + user, JSON.stringify(events));
        loadEvents();
    }
}
