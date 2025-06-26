document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // Show SweetAlert2 popup
        Swal.fire({
            icon: "warning",
            title: "Login Required",
            text: "Please log in to access the Chatbot.",
            confirmButtonText: "Go to Login"
        }).then(() => {
            // Redirect to login page after confirmation
            window.location.href = "SignUpIn.html";
        });
    }
});


$(document).ready(function (){
    const messageList = $(".messages");
    const input = $("#msg_input");

    function appendMessage(text, side){
        const message = $(`
            <li class="message ${side} appeared">
            <div class="avatar"></div>
            <div class="text_wrapper">
              <div class="text">${text}</div>
            </div>
      </li>
        `);
        messageList.append(message);
        messageList.scrollTop(messageList[0].scrollHeight);
    }

    function sendMessage(){
        const text = input.val().trim();
        if (!text) return;

        //show user's message
        appendMessage(text, "right");
        input.val("");

        //send to backend
        $.ajax({
            url: "http://localhost:8080/api/chat",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({message: text}),
            success: function (response) {
            const reply = response.reply || "Sorry, I didn't understand that.";
            appendMessage(reply, "left");
        },
        error: function (xhr, status, error) {
        console.error("Error from server:", error);
        appendMessage("Oops! Something went wrong.", "left");
      }
      });
    }

     // On button click
     $("#send_button").on("click", sendMessage);

     // On enter key
     input.on("keypress", function (e) {
     if (e.which === 13) {
      sendMessage();
      return false;
    }
  });
});