const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Function to show SweetAlert2 messages
function showAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text
    });
}

// Validate name (letters and spaces only)
function isValidName(name) {
    return /^[A-Za-z\s]+$/.test(name);
}

// Validate password based on constraints
function isValidPassword(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
    const hasSpace = /\s/.test(password);

    return hasUpper && hasLower && hasNumber && hasSpecial && !hasSpace;
}

// Show password rules popup only once
const passwordInput = document.querySelector('input[name="passRegister"]');
let hasSeenPasswordPopup = false;

passwordInput.addEventListener("focus", (e) => {
    if (!hasSeenPasswordPopup) {
        e.target.blur(); // prevent typing until popup is acknowledged
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
        }).then(() => {
            hasSeenPasswordPopup = true;
            passwordInput.focus(); // restore focus after popup
        });
    }
});

// Login form submission
document.querySelector("#login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
        email: formData.get("umail"),
        password: formData.get("upass"),
    };

    if (!userData.email || !userData.password) {
        showAlert('error', 'Error', 'Please fill all the fields');
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        localStorage.setItem('authToken', result.token);
        localStorage.setItem("email", result.email);

        showAlert('success', 'Success', 'Login successful!');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } catch (error) {
        console.error("Error during login:", error);
        showAlert('error', 'Error', error.message || 'Something went wrong');
    }
});

// Register form submission
document.querySelector("#register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
        name: formData.get("nameRegister"),
        email: formData.get("emailRegister"),
        password: formData.get("passRegister"),
        phone: formData.get("phoneRegister")
    };

    if (!userData.name || !userData.email || !userData.password || !userData.phone) {
        showAlert('error', 'Error', 'Please fill all the fields');
        return;
    }

    if (!isValidPassword(userData.password)) {
        showAlert('error', 'Invalid Password', 'Your password must meet all the specified requirements.');
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert('success', 'Success', 'Account created successfully!');
            setTimeout(() => {
                document.querySelector(".toggle-box .login-btn").click();
            }, 2000);
        } else {
            throw new Error(result.message || "Something went wrong");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        showAlert('error', 'Error', error.message || 'Something went wrong');
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

