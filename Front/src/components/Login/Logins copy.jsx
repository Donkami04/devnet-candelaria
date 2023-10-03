import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { BASE_API_URL } from "../../utils/Api-candelaria/api";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_API_URL}/auth/login`, {
        email,
        password,
      });
      console.log(response)
      if (response.status === 200) {
        // Maneja la lógica de inicio de sesión exitoso aquí
        const data = response.data;
        setApiResponse(data.message); // Supongamos que la respuesta del API contiene un campo "message"
        setError('');
      } else {
        // Maneja la lógica de error de inicio de sesión aquí
        setError('Credenciales incorrectas');
        setApiResponse(''); // Limpia la respuesta del API en caso de error
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      // Maneja otros errores de red aquí
      setError('Error de red');
      setApiResponse('');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {apiResponse && <div className="api-response">{apiResponse}</div>}
    </div>
  );
}
