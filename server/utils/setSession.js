module.exports = (role) => {
  let tokenName =
    role === "super admin"
      ? "token"
      : role === "student"
        ? "student_token"
        : role === "guard"
          ? "guard_token"
          : "token";

  let expiredAt =
    role === "super admin"
      ? 24 * 60 * 60 * 1000
      : role === "student" || role === "guard"
        ? 7 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;

  return { tokenName, expiredAt };
};
