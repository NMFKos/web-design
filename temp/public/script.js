const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const login = document.getElementsByClassName("login_button")
const loginForm = document.getElementById("loginForm")
const loginURL = 'http://localhost:3000/login'

loginForm.addEventListener('submit', (event)=>{
    event.preventDefault()
    const formData = new FormData(loginForm)
    let phone = formData.get('Login_phone')
    let password = formData.get('Login_password')
    loginForm.reset()

    let user = {
        phone,
        password
    }

    fetch(loginURL, {
        method: 'post',
        body: JSON.stringify(user),
        headers:{
            'content-type': 'application/json'
        }
    })
})
.then(response => response.json())
.then(data => {
  if (data.exists) {
    console.log('phone and password exist in database');
  } else {
    console.log('phone and password do not exist in database');
  }
})
.catch(error => console.error('Error:', error));

// const Email = document.getElementById("email")
// const emailIcon = document.getElementsByClassName("fa-solid fa-xmark")
// Email.addEventListener("keyup", ()=>{
//     let emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    
//     if(Email.value.match(emailRegex)){
//         return emailIcon.style.display = "flex"
//     }
//     else{
//         return emailIcon.style.display = "none"
//     }
// })


