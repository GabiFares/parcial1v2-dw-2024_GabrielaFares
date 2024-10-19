import { auth } from "./auth/auth.js";

if (auth.isAuthenticated() && auth.getRole()) {
  window.location.href = "temas/index.html";
} else if (auth.isAuthenticated()) {
  window.location.href = "temasUsuarios/index.html";
}

const usernameInput = document.getElementById("username");
const contraseñaInput = document.getElementById("contraseña");

class Usuario {
  constructor(username, contraseña) {
    this.username = username;
    this.contraseña = contraseña;
  }
}

function validarUsername(input) {
  const username = input.value;
  if (username === "") {
    error(input, "Debe completar el campo username");
    return false;
  }
  return true;
}

function validarContraseña(input) {
  const contraseña = input.value;
  if (contraseña === "") {
    error(input, "Debe completar el campo contraseña");
    return false;
  }
  return true;
}

function error(input, errormessage) {
  const div = input.parentElement;
  const small = div.querySelector("small");
  small.innerText = errormessage;
  div.className = "divinputerror";
}

document.getElementById("LogInForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameValido = validarUsername(usernameInput);
  const contraseñaValida = validarContraseña(contraseñaInput);

  if (usernameValido && contraseñaValida) {
    var persona = new Usuario(usernameInput.value, contraseñaInput.value);
    login(persona);
  }
});

async function login(persona) {
  try {
    const response = await fetch("http://localhost/back/auth", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(persona),
    });

    if (response.status === 401) {
      error(usernameInput, "");
      error(contraseñaInput, "Su username o contraseña no es válido");
      usernameInput.value = "";
      contraseñaInput.value = "";
      return;
    }

    if (!response.ok) {
      throw new Error("No funciona");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    console.log(localStorage.getItem("token"));

    console.log(auth);
    if (auth.isAuthenticated() && auth.getRole()) {
      window.location.href = "temas/index.html";
    } else if (auth.isAuthenticated()) {
      window.location.href = "temasUsuarios/index.html";
    }
  } catch (err) {
    console.log(err);
  }
}
