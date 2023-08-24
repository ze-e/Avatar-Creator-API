const adminService = require("../services/admin.service");

exports.updateRole = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: "User must be signed in" });
  try {
    let user;
    if (req.role !== "admin")
      return res
        .status(403)
        .json({ error: "Only admins can change user roles" });
    else
      user = await adminService.updateRole(
        req.params.id,
        req.body.newRole,
        req.role
      );
    res.status(200).json({ data: user, message: "updated user role" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
