let users = [
  { name: "Blazy", email: "blazy@gmail.com", password: "blazyonts" },
  { name: "Bob", email: "bob@gmail.com", password: "bobonts" },
  { name: "Ayomide", email: "ayo@gmail.com", password: "ayoontsbs" },
  { name: "Ayomikun", email: "mikun@gmail.com", password: "mikungotts" },
  { name: "Jane", email: "jane@gmail.com", password: "janetooswaggy" }
];

function submitLogin() {
  let input_email = document.getElementById("email");
  let input_password = document.getElementById("pwd");

  let foundUser = users.find(
    user => user.email === input_email.value && 
    user.password === input_password.value
  );

  let displaymsg = document.getElementById("emailMsg");
  let dispmsg = document.getElementById("pwdMsg");

  if (foundUser) {
    displaymsg.innerHTML = "Email is valid.";
  } else {
    displaymsg.innerHTML = "Email is invalid.";
  }

  if (foundUser) {
    dispmsg.innerHTML = "Password is valid.";
  } else {
    dispmsg.innerHTML = "Password is invalid.";
  }

  if (foundUser) {
    alert("Log in successful.");
    alert("Welcome " + foundUser.name + "!!");
  } else {
    alert("Log in unsuccessful.");
  }
}