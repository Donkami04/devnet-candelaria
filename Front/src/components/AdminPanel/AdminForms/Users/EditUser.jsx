import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { BASE_API_URL, getUsers } from "../../../../utils/Api-candelaria/api";
import "./users.css";
import { FaEdit, FaTrash } from "react-icons/fa";

export const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    rol: "",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({
    id: null,
    name: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersList = await getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Error al obtener el listado de Usuarios:", error);
      return error;
    }
  };
  
  const getJWTFromLocalStorage = () => {
    return localStorage.getItem("jwtToken"); // Adjust the key as per your application
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleEditClick = (user) => {
    setSelectedUserId(user.id);
    setEditedUser({
      name: user.name,
      email: user.email,
      rol: user.rol,
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const { name, email, rol } = editedUser;
      const editData = {
        name,
        email,
        rol,
      };

      const jwtToken = getJWTFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      await axios.put(`${BASE_API_URL}/users/edit/${selectedUserId}`, editData, {
        headers,
      });
      await fetchData();
      setEditedUser({
        name: "",
        email: "",
        rol: "",
      });
      setSelectedUserId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  const handleDeleteClick = (userId, userName) => {
    setUserToDelete({
      id: userId,
      name: userName,
    });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const jwtToken = getJWTFromLocalStorage();
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    try {
      const { id } = userToDelete;
      await axios.delete(`${BASE_API_URL}/users/remove/${id}`, {
        headers
      });
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="users-main-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.rol.toUpperCase()}</td>
              <td >
                <div className="td-icons-container">
                  <div onClick={() => handleEditClick(user)}>
                    <FaEdit />
                  </div>
                  <div onClick={() => handleDeleteClick(user.id, user.name)}>
                    <FaTrash />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Usuario"
        ariaHideApp={false}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <h2 className="form-title form-title-users">Editar Usuario</h2>
          <form>
            <div>
              <label className="form-users-label" htmlFor="name">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-users-label" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-users-label" htmlFor="rol">
                Rol:
              </label>
              <select
                type="text"
                id="rol"
                name="rol"
                value={editedUser.rol}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value=""></option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="button-form-container">
              <button
                className="form-button"
                type="button"
                onClick={handleEditSubmit}
              >
                Editar
              </button>

              <button
                className="form-button cancel-button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <h2 className="form-title form-title-users">Confirmar Eliminación</h2>
          <p className="confirm-delete-message">Desea realmente eliminar al usuario {userToDelete.name}?</p>
          <div className="button-form-container">
              <button
                className="form-button cancel-button"
                type="button"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>

              <button
                className="form-button "
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};