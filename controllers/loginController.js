const { PrismaClient } = require('@prisma/client');
const { validPassword, issueJWT } = require('../utils/passwordUtils');

const prisma = new PrismaClient();

const loginController = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: 'incorrect email or password' });
    }

    const isValid = validPassword(req.body.password, user.hash, user.salt);

    if (isValid) {
      const tokenObject = issueJWT(user);
      res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      res
        .status(401)
        .json({ success: false, msg: 'incorrect email or password' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginController,
};
