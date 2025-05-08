document.addEventListener("DOMContentLoaded", function () {
    const mechanicsBtn = document.getElementById("mechanics-btn");
    const mechanicsBox = document.getElementById("mechanics-box");

    mechanicsBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (mechanicsBox.style.display === "none") {
            mechanicsBox.style.display = "block";
            mechanicsBox.innerHTML = `
                <div style="position: relative;">
                    <button id="closeMechanicsBtn">X</button>
                    <p>🎮 <strong>Game Mechanics</strong></p>
                    <p> Nine numbered circles (1-9) will be displayed in a random order for a short time before disappearing.
                        The player must recall their position and click the circles in the correct numerical sequence.
                        Points are on accuracy. </p>
                </div>`;

            const closeMechanicsBtn = document.getElementById('closeMechanicsBtn');
            if (closeMechanicsBtn) {
                closeMechanicsBtn.addEventListener('click', function () {
                    mechanicsBox.style.display = "none";
                });
            }
        } else {
            mechanicsBox.style.display = "none";
        }
    });


    const lastUser = localStorage.getItem("lastUser");
    if (lastUser) {
        alert(`Welcome back, ${lastUser}!`);
    }

    const userBtn = document.getElementById("enter-user-btn");
    const userForm = document.getElementById("userForm");

    userBtn.addEventListener("click", function (e) {
        e.preventDefault();
        userForm.style.display = "block";

        const closeFormBtn = document.getElementById('closeFormBtn');
        if (closeFormBtn) {
            closeFormBtn.addEventListener('click', function () {
                userForm.style.display = "none";
            });
        }
    });

    userForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const usernameInput = document.getElementById("usernameInput");
        const username = usernameInput.value.trim();
        
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            alert("Username must contain only letters and numbers (no symbols or spaces).");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.includes(username)) {
            alert(`Welcome back, ${username}!`);
        } else {
            users.push(username);
            localStorage.setItem("users", JSON.stringify(users));
            alert(`Welcome, ${username}!`);
        }

        localStorage.setItem("lastUser", username);
        userForm.reset();
        userForm.style.display = "none";
    });
    const removeUserBtn = document.getElementById("removeUserBtn");
    if (removeUserBtn) {
    removeUserBtn.addEventListener("click", function () {
        const lastUser = localStorage.getItem("lastUser");
        if (!lastUser) {
            alert("No user to remove.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.filter(user => user !== lastUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.removeItem("lastUser");

        alert(`User "${lastUser}" has been removed.`);
        userForm.style.display = "none";
    });
}
});