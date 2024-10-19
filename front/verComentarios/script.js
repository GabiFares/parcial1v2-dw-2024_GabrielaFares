const deleteDialog = document.getElementById("deleteDialog");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
var comentarioTemaToDelete = "";
var comentarioIdToDelete = "";
var comentarioIdUserToDelete = "";

var token = localStorage.getItem("token");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function fetchGET() {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const id_tema = getQueryParam("id");
    const response = await fetch(
      `http://localhost/back/temas/${id_tema}/comentarios`,
      { headers }
    );

    if (response.status === 401) {
      window.location.href = "../login/index.html";
    }

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const comentarios = await response.json();

    taskList.innerHTML = "";

    if (comentarios.length > 0) {
      comentarios.forEach((comentario) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                        <td>----</td>
                        <td>${comentario.descripcion}</td>
                        <td class="action-buttons">
                            <button class="edit-btn" data-id="${comentario.id_comentario}">
                                <img src="edit-icon.png" alt="Editar">
                            </button>
                            <button class="delete-btn" data-comentario="${comentario.id_comentario}" data-owner="${comentario.id_usuario}" data-tema="${comentario.id_tema}">
                                <img src="delete-icon.png" alt="Eliminar">
                            </button>
                        </td>
                    `;

        taskList.appendChild(row);
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
          comentarioIdToDelete = this.getAttribute("data-comentario");
          comentarioIdUserToDelete = this.getAttribute("data-owner");
          comentarioTemaToDelete = this.getAttribute("data-tema");
          deleteDialog.style.display = "flex";
        });
      });
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No hay ninguna comentario creada</td>`; // colspan ajustado a 3 columnas
      taskList.appendChild(row);
    }
  } catch (err) {
    console.log(err);
  }
}

confirmDeleteBtn.addEventListener("click", async function () {
  if (comentarioIdToDelete) {
    try {
      const response = await fetch(
        `http://localhost/back/usuarios/${comentarioIdUserToDelete}/temas/${comentarioTemaToDelete}/comentarios/${comentarioIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Comentario eliminado con éxito");
        await fetchGET(); // Actualizar la lista después de eliminar
        window.location.href = "../temas";
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar el comentario:", errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  deleteDialog.style.display = "none";
});

cancelDeleteBtn.addEventListener("click", function () {
  deleteDialog.style.display = "none";
});

fetchGET();
