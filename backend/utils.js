import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

//authenticate user
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
//if authorization exists, then get token from authorization
	if (authorization) {
    const token = authorization.slice(7, authorization.length); // only returns token part
//jwt to decript token 
		jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
/* error, data inside of token */
      (err, decode) => {
/* if there is an error, send message that token is invalid */
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
				} else {
          req.user = decode; //return information about user
          next();
        }
      }
    );
//if authorization does not exist, send error message
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

//authenticate only admin users
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};