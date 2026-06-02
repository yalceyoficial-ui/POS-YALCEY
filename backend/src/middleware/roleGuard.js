const roleGuard = (requiredRole) => {
  return (req, res, next) => {
    if (req.userRole !== requiredRole) {
      return res.status(403).json({ 
        message: 'No tienes permisos para realizar esta acción' 
      })
    }
    next()
  }
}

module.exports = roleGuard