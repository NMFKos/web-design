document.addEventListener('DOMContentLoaded', (event) => {
    const input = document.getElementById("email"), emailIcon = document.querySelector(".email-icon");

    input.addEventListener("keyup", () => {
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if(input.value === ""){
            emailIcon.classList.replace("uil-check-circle", "uil-envelope");
            emailIcon.style.color = "#b4b4b4";
        } else if(input.value.match(pattern)) {
            emailIcon.classList.replace("uil-envelope", "uil-check-circle");
            emailIcon.style.color = "#4bb543";
        } else {
            emailIcon.classList.replace("uil-check-circle", "uil-envelope");
            emailIcon.style.color = "#de0601";
        }
    });
});

