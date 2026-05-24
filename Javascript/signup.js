let users = [
  { name: "Blazy", email: "blazy@gmail.com", password: "blazyonts" },
  { name: "Bob", email: "bob@gmail.com", password: "bobonts" },
  { name: "Ayomide", email: "ayo@gmail.com", password: "ayoontsbs" },
  { name: "Ayomikun", email: "mikun@gmail.com", password: "mikungotts" },
  { name: "Jane", email: "jane@gmail.com", password: "janetooswaggy" }
];



function submitSignIn() {

  let input_email = document.getElementById("email").value;
  let input_password = document.getElementById("pwd").value;
  let input_name = document.getElementById("name").value;
  
  let newUser = {
    name: input_name,
    email: input_email,
    password: input_password
  };
  users.push(newUser);

  alert("New user created succesfully!!");

  document.open();
   document.writeln(`
    <style>
            body { 
                font-family: Arial, sans-serif;
                align-items: center;
                justify-content: center;
                display: flex;
                min-height: 100vh;
                background-color: rgb(255, 228, 196);
            }
            .whole{
                 padding:10px;
                 background-color: #deb1fa;
                 border-radius:10px;
                 display: flex;
                 flex-direction: column;
                 justify-content: center;
                 height:500px;
                 width:350px;
                 box-shadow: 0 0 20px rgba(60, 4, 99, 0.497);
                 overflow: hidden;}
            h1 { color: #6a0dad; font-size: 30px; 
                 text-align: center;
                padding: 10px;}
            p { color: #555; font-size: 20px; 
                margin-left:40px;
                padding:10px;}
        </style>
    <div class="whole">
    <h1>Welcome ${input_name}</h1>
    <br><br><br>
     <p>Name: ${input_name}</p>
     <p>Email: ${input_email}</p>
     <p>Password: ${input_password}</p>
     </div>
     `
);
document.close();


}