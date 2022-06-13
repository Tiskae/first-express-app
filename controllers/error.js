exports.get404 = (req, res) => {
  res.status(404).render("404", {
    docTitle: "Page not found",
    path: "",
    isAuthenticated: requ.session.isLoggedIn,
  });
};

exports.get500 = (req, res) => {
  res.status(500).render("500", {
    docTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
