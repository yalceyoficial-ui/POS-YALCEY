const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    // Leer el token del header Authorization
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.userRole = decoded.role

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

module.exports = auth