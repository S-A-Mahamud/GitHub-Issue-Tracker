const inputUsername = document.getElementById("input-username");
const inputPassword = document.getElementById("input-password");

document.getElementById("signIn-btn").addEventListener("click", (event => {
    event.preventDefault();
    // validation logic 
    const inputUsernameValue = inputUsername.value;

    const inputPasswordValue = inputPassword.value;
    // console.log(typeof inputPasswordValue);

    // const inputPasswordValue 
    if (inputUsernameValue === "admin") {
        if (inputPasswordValue === "admin123") {       
            window.location.assign('./dashboard.html');
        }
        else {
            alert('Plz Check Your Password');
        }
    }
    else {
        // console.log('no');
        alert("Plz Check Your Username");
    }

}));