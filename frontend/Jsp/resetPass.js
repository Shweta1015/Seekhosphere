// Show password constraints popup when focusing on password field
let hasSeenPasswordPopup = false;

document.getElementById("password").addEventListener("focus", () => {
    if (!hasSeenPasswordPopup) {
        hasSeenPasswordPopup = true;
        Swal.fire({
            title: 'Password Requirements',
            html: `
                <ul style="text-align: left;">
                    <li>✅ At least one <strong>uppercase</strong> letter</li>
                    <li>✅ At least one <strong>lowercase</strong> letter</li>
                    <li>✅ At least one <strong>number</strong></li>
                    <li>✅ At least one <strong>special character</strong> (!@#$%^&*)</li>
                    <li>❌ No <strong>spaces</strong></li>
                </ul>
            `,
            icon: 'info',
            confirmButtonText: 'Got it!'
        });
    }
});

// Password validation function
function isValidPassword(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
    const hasSpace = /\s/.test(password);

    return hasUpper && hasLower && hasNumber && hasSpecial && !hasSpace;
}

document.getElementById("resetForm").addEventListener("submit", async function(event){
    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const email = localStorage.getItem("otpEmail");  //Retrieve email stored during OTP verification

    const errorMessage = document.getElementById("error-message");

    // Check if password meets constraints
    if (!isValidPassword(password)) {
        errorMessage.textContent = "Password does not meet all constraints.";
        return;
    }

    //check if password match
    if (password !== confirmPassword){
        document.getElementById("error-message").textContent = "Passwords do not match!";
        return;
    }

    // Clear any previous error
    errorMessage.textContent = "";

    //Reset password API call
    try {
        const response = await fetch("http://localhost:8080/api/auth/reset-password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email: email, newPassword: password })
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire("Success", "Password reset successfully!", "success");
            window.location.href = "SignUpIn.html";
        } else {
            errorMessage.textContent = result.message || "Failed to reset password.";
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        errorMessage.textContent = "Something went wrong!";
    }
});