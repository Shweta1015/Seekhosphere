function showAlert(icon, title, text){
    Swal.fire({
        icon: icon,
        title: title,
        text: text
    });
}

document.addEventListener("DOMContentLoaded", function(){
    const inputs = document.querySelectorAll(".otp-container input");
    const continueButton = document.querySelector(".continue");

    // Auto-focus the first input
    inputs[0].focus();

    inputs.forEach((input, index) => {
        input.addEventListener("input", (event) => {
            const value = event.target.value;

            // Only allow digits
            if (!/^[0-9]$/.test(value)) {
                event.target.value = "";
                return;
            }

            // Move to the next input
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && input.value === "" && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    continueButton.addEventListener("click", function(event){
        event.preventDefault(); // Prevent form reload

        let enteredOtp = "";
        inputs.forEach(input => enteredOtp += input.value);

        if (enteredOtp.length !== 6) {
            showAlert("error", "Invalid OTP", "Please enter all 6 digits.");
            return;
        }

        const storedEmail = localStorage.getItem("otpEmail");
        if (!storedEmail) {
            showAlert("error", "Email not found", "Please request a new OTP.");
            return;
        }

        // API call
        fetch("http://localhost:8080/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: storedEmail, otp: enteredOtp })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire("Success", "OTP Verified!", "success").then(() => {
                    window.location.href = "Reset.html";
                });
            } else {
                showAlert("error", "Invalid OTP", "Please try again.");
            }
        })
        .catch(error => {
            console.error("OTP verification error:", error);
            showAlert("error", "Server Error", "Something went wrong!");
        });
    });
});

// click animation to button
document.querySelectorAll(".continue").forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.add("clicked");

    setTimeout(() => {
      this.classList.remove("clicked");
    }, 300); 
  });
});
