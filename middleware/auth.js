const jwt = require('jsonwebtoken');

const withAuth = function(req, res,next) {
  const token = req.body.token

  if (!token) {
    res.json({
      isValid:false
    })
    return 
  } else {
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (err) {
        res.json({
          isValid:false
        })
        return 
      } else {
        req.body.email = decoded.email
        next()
        return 
      }
    });
  }
}

module.exports = withAuth;