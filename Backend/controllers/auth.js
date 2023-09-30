const bcrypt = require("bcrypt");
const { Users } = require("../models/users");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

async function getUser(email, password) {
  try {
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
      return { status: 401, message: "Email no encontrado" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 401, message: "Contraseña incorrecta" };
    }
    delete user.dataValues.password;
    return { status: 200, message: "Inicio de sesión exitoso", data: user };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function signToken(user) {
  const payload = {
    rol: user.rol
  };
  const token = jwt.sign(payload, SECRET);
  return {
    user,
    token,
  };
}

module.exports = { getUser, signToken };
