var idOwner = null;
var taskUserToAdd = null;

var token = localStorage.getItem("token");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.localStorage.search);
  return urlParams.get(param);
}

if (!token) {
  if (getQueryParam("token") != null || getQueryParam("token") != undefined) {
    token = getQueryParam("token");
    localStorage.setItem("token", token);
  }
}

async function fetchGET() {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const username = tokenPayload.username;
    const response = await fetch(`http://localhost/back/temas`, { headers });

    if (response.status === 401) {
      window.location.href = "../login/index.html";
    }

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const temas = await response.json();

    userInfo.innerHTML = `Bienvenido ${username}`;
    taskList.innerHTML = "";

    if (temas.length > 0) {
      temas.forEach((tema) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                        <td>${tema.titulo}</td>
                        <td>${tema.descripcion}</td>
                        <td class="action-buttons">
                           <button class="seeComents-btn" data-tema="${tema.id_tema}">
                                Ver comentarios
                            </button>
                        </td>
                    `;

        taskList.appendChild(row);
      });

      document.querySelectorAll(".seeComents-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const temaId = this.getAttribute("data-tema");
          taskUserToAdd = this.getAttribute("data-owner");
          window.location.href = `../verComentarios/index.html?id=${temaId}`;
        });
      });
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No hay ningun tema creado</td>`; // colspan ajustado a 3 columnas
      taskList.appendChild(row);
    }
  } catch (err) {
    console.log(err);
  }
}

const deletetoken = document.getElementById("botoncerrar");
deletetoken.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "../";
});

fetchGET();
