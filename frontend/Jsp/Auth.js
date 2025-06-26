function showAlert(icon, title, text){
    Swal.fire({
        icon: icon,
        title: title,
        text: text
    });
}
function updateNavBar(){
    const authToken = localStorage.getItem("authToken");
    const authButton = document.getElementById("authButton");

    if (authToken){
        //user is logged in
        authButton.textContent = "Sign Out";
        authButton.href = "#";
        authButton.removeEventListener("click", logoutUser);
        authButton.addEventListener("click", logoutUser);

    }else{
        //User is not logged in
        authButton.textContent = "Sign In";
        authButton.href = "SignUpIn.html";
        authButton.removeEventListener("click", logoutUser);   //Remove onclick event if any
        localStorage.removeItem("authToken");
    }
}

// Function to check if token is valid by making a request to the backend
async function isTokenValid(token){
    try{
        const response = await fetch("http://localhost:8080/api/users/validate-token",{
            method: "GET",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return response.ok;    //if status is 200, token is validate
    }catch (error){
        console.error("Token validation failed: ", error);
        return false;
    }
}

function logoutUser(){
    localStorage.removeItem("authToken");   //Remove jwt token
    showAlert('success', 'Logged Out', 'You have successfully logged out!');

    //Redirect to sign-in page after logout
    setTimeout(() =>{
        window.location.href = "SignUpIn.html";
    }, 1500);
}

// Run updateNavBar when the page loads
document.addEventListener("DOMContentLoaded", updateNavBar);
// window.onload = updateNavBar;
