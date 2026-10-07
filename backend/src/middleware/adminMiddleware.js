const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Ви не авторизовані",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Доступ дозволено тільки адміністраторам",
    });
  }

  next();
};

module.exports = adminMiddleware;