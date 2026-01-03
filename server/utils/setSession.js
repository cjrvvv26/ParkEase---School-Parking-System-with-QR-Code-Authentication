module.exports = (role) => {
  let tokenName =
    role === "super admin"
      ? "token"
      : role === "student"
      ? "student_token"
      : role === "guard" && "guard_token";

  const expiredAt =
    role === "super admin"
      ? 24 * 60 * 1000
      : role === "student_token" ||
        (role === "guard_token" && 7 * 24 * 60 * 1000);

  return { tokenName, expiredAt };
};
