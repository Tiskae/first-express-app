exports.getLogin = (req, res, next) => {
  const isAuthenticated = req.get("Cookie").split("=")[1] === "true";

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
