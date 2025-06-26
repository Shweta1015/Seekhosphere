document.addEventListener("DOMContentLoaded", function(){
    const menuIcon = document.querySelector(".nav__menu");
    const navLinks = document.querySelector(".nav__links");

    menuIcon.addEventListener("click", function(){
        navLinks.classList.toggle("show");
    });
});
