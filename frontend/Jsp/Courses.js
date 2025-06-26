const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get("subject");
const level = urlParams.get("level");


// Optional: implement this if you want to validate token on server
async function isTokenValid(token) {
  try {
    const response = await fetch("/api/users/validate-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (err) {
    return false;
  }
}

// Check login before enrollment
document.addEventListener("DOMContentLoaded", () => {
  const enrollButtons = document.querySelectorAll(".enroll-btn");

  enrollButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault(); 
      const token = localStorage.getItem("authToken");

      const subject = button.getAttribute("data-subject");
      const level = button.getAttribute("data-level");
      console.log("Subject: " + subject, "Level: " + level);

      if (!token || !(await isTokenValid(token))) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please sign in to access the course.",
        }).then(() => {
          window.location.href = "SignUpIn.html";
        });
      } else {
        // Redirect to PlayList.html if authenticated
        window.location.href = `PlayList.html?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}`;
      }
    });
  });
});


