const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findUserByEmail, findUserById } = require('../models/userModel')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar que llegaron los datos
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      })
    }

    // Buscar el usuario en la base de datos
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas' 
      })
    }

    // Verificar que el usuario está activo
    if (!user.active) {
      return res.status(401).json({ 
        message: 'Usuario inactivo, contacta al administrador' 
      })
    }

    // Comparar la contraseña con el hash guardado
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas' 
      })
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Responder con el token y los datos básicos del usuario
    return res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error en login:', error)
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error en getMe:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { login, getMe }