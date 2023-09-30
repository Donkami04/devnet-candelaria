import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_API_URL, getUsers } from '../../../../utils/Api-candelaria/api';
import './users.css';

export const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    rol: '',
  });
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersList = await getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Error al obtener el listado de Usuarios:', error);
      return error;
    }
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
  };

  const handleEditSubmit = async () => {
    try {
      const { name, email, rol } = editedUser;
      const editData = {
        name,
        email,
        rol,
      };

      await axios.put(`${BASE_API_URL}/users/edit/${selectedUserId}`, editData);
      await fetchData();
      setEditedUser({
        name: '',
        email: '',
        rol: '',
      });
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error al editar usuario:', error);
    }
  };

  return (
    <div>
      <h2>Tabla de Usuarios</h2>
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
              <td>{user.rol}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Editar Usuario</h2>
      <form>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="rol">Rol:</label>
          <input
            type="text"
            id="rol"
            name="rol"
            value={editedUser.rol}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="button" onClick={handleEditSubmit}>
            Editar Usuario
          </button>
        </div>
      </form>
    </div>
  );
};
