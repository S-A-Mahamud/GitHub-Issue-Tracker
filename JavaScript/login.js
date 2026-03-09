// Login form validation and authentication logic
const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");
const alertMessage = document.getElementById("alertMessage");

// Event listener for form submission
document.addEventListener("DOMContentLoaded", function () {
    const signInBtn = document.getElementById("signIn-btn");

    // check if the sign-in button exists before adding event listener
    if (signInBtn) {
        signInBtn.addEventListener("click", (event => {
            event.preventDefault();
            const username = inputUsername.value.trim();
            const password = inputPassword.value.trim();

            // validation logic 
            if (username === '' && password === '') {
                alertMessage.textContent = "Username and Password cannot be empty!";
            } else if (username !== 'admin') {
                alertMessage.textContent = "Username is incorrect!";
            } else if (password === '') {
                alertMessage.textContent = "Password cannot be empty!";
            } else if (password !== 'admin123') {
                alertMessage.textContent = "Password is incorrect!";
            } else {
                // user authentication check and get local storage
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "dashboard.html";  //success → redirect
            }
        }));
    } else {
        alert("Sign In Failed!");
    }
});

