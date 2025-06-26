document.addEventListener("DOMContentLoaded", function(){
    const menuIcon = document.querySelector(".nav__menu");
    const navLinks = document.querySelector(".nav__links");

    menuIcon.addEventListener("click", function(){
        navLinks.classList.toggle("show");
    });
});

const lines = [
  { text: "Learn from the best", elementId: "line1" },
  { text: "Be the best version", elementId: "line2" },
  { text: "of YOURSELF!", elementId: "line3" }
];

let currentLine = 0;
let currentChar = 0;
let isDeleting = false;

//for typing effect
function typeLine() {
  const line = lines[currentLine];
  const element = document.getElementById(line.elementId);

  if (!isDeleting) {
    element.textContent = line.text.substring(0, currentChar);
    if (currentChar < line.text.length) {
      currentChar++;
      setTimeout(typeLine, 50);
    } else {
      currentLine++;
      if (currentLine < lines.length) {
        currentChar = 0;
        setTimeout(typeLine, 500); // pause between lines
      } else {
        setTimeout(() => {
          isDeleting = true;
          currentLine = lines.length - 1;
          currentChar = lines[currentLine].text.length;
          typeLine();
        }, 2000); // pause after all lines are typed
      }
    }
  } else {
    const line = lines[currentLine];
    const element = document.getElementById(line.elementId);
    element.textContent = line.text.substring(0, currentChar);
    if (currentChar > 0) {
      currentChar--;
      setTimeout(typeLine, 25);
    } else {
      currentLine--;
      if (currentLine >= 0) {
        currentChar = lines[currentLine].text.length;
        setTimeout(typeLine, 100);
      } else {
        isDeleting = false;
        currentLine = 0;
        currentChar = 0;
        setTimeout(typeLine, 500);
      }
    }
  }
}

typeLine();