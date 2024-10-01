const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const User = require("../models/User");

function isAdminOrSuperadmin(req) {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return false;
    }

    const decodedToken = jwt.verify(token, authConfig.secret);
    return ["admin", "superadmin"].includes(decodedToken.role);
  } catch (err) {
    console.error("Erro ao verificar o token JWT:", err.message);
    return false;
  }
}

// Função para verificar se o utilizador tem uma permissão específica
async function checkPermission(req, permissionRequired) {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, authConfig.secret);
    const userId = decoded.parametro.id;

    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          association: "roles",
          include: [{ association: "permission" }],
        },
      ],
    });
    if (!user) {
      return false;
    }

    for (const role of user.roles) {
      const permissions = role.permission.map((p) => p.name);
      if (permissions.includes(permissionRequired)) {
        console.log("tem read role");
        return true;
      }
    }
    console.log("ca tem read role");

    return false;
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return false;
  }
}

module.exports = {
  isAdminOrSuperadmin,
  checkPermission,
};
