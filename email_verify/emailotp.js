const sendOTP = document.getElementById('send-otp')
sendOTP.addEventListener('click', ()=>{
	const email = document.getElementById("email");
    const otpverify = document.getElementsByClassName("email-verify")[0];
    
    let otp_code = Math.floor(Math.random() * 10000);
    let Emailbody = `<h1> Your OTP is </h1> ${otp_code}`;
    Email.send({
        SecureToken : "af6e9c76-f18d-42eb-a1ec-bbe91641ab79",
        To : email.value,
        From : "kashanfaheem88@gmail.com",
        Subject : "Email OTP using Javascript",
        Body : Emailbody,
    }).then(
      message => {
        if(message ==="OK"){
          
          otpverify.style.display ="flex";
          let otp_inp = document.getElementById("otp-input");
          let otp_btn = document.getElementById("btn-verify-otp");

          otp_btn.addEventListener("click", ()=>{

            if(otp_inp.value == otp_code){
              window.location.href = 'localhost:8080/reset-pass.html'
            }
            else{
              alert("Invalid OTP")
            }
          })
        }
      }
    );
}) 
	
