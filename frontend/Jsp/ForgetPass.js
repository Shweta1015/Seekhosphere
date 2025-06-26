function showAlert(icon, title, text){
    Swal.fire({
        icon: icon,
        title: title,
        text: text
    });
}

document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault();

    const email = document.getElementById("email").value;
    const response = await fetch("http://localhost:8080/api/auth/send-otp",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"email": email})
    });
    const result = await response.json();

    if(response.ok){
        localStorage.setItem("otpEmail", email);
        Swal.fire("Success", "OTP sent successfully!", "success").then(() =>{
            window.location.href = "EnterOtp.html";   //Redirect to OTP input
        });
    }else{
        Swal.fire("Error","Failed to send OTP. Please try again.", "error");
    }
});

// click animation to button
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.add("clicked");

    setTimeout(() => {
      this.classList.remove("clicked");
    }, 300); 
  });
});