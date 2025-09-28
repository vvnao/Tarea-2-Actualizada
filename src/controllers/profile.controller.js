import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { updateUser, deleteUser, findUserById } from "../services/user.service.js"; 

// GET /profile/public
export async function getPublicProfile(req, res) {
  try {
    handleSuccess(res, 200, "Perfil público obtenido correctamente", { message: "Aquí iría info pública" });
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener perfil público", error.message);
  }
}

// GET /profile/private
export async function getPrivateProfile(req, res) {
  try {
    const user = await findUserById(req.user.id); // usa el id del token
    if (!user) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    handleSuccess(res, 200, "Perfil privado obtenido correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener perfil privado", error.message);
  }
}

// PATCH /profile/private
export async function updatePrivateProfile(req, res) {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return handleErrorClient(res, 400, "Se requiere email y/o password para actualizar");
    }

    const updatedUser = await updateUser(req.user.id, { email, password });

    handleSuccess(res, 200, "Perfil actualizado correctamente", updatedUser);
  } catch (error) {
    handleErrorServer(res, 500, "Error al actualizar perfil", error.message);
  }
}

// DELETE /profile/private
export async function deletePrivateProfile(req, res) {
  try {
    await deleteUser(req.user.id);
    handleSuccess(res, 200, "Perfil eliminado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar perfil", error.message);
  }
}
