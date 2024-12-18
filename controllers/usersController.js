const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        created: true,
        updated: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        posts: true,
        comments: true,
      },
    });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const listUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.params.username,
      },
      select: {
        created: true,
        updated: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        posts: true,
        comments: true,
      },
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const oldUser = req.user;
  const data = { ...req.query };
  delete data.id;
  delete data.admin;
  delete data.member;
  data.updated = Date.now();

  try {
    const user = await prisma.user.update({
      where: {
        username: req.params.username,
      },
      data,
    });
    res.status(200).json({ success: true, data: [user, oldUser] });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    console.log(req.user);
    const deletedUser = await prisma.user.delete({
      where: {
        id: req.user.id,
      },
    });
    res.status(200).json({ success: true, data: deletedUser });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, listUser, updateUser, deleteUser };