exports.get404 = (_, res) => {
  res
    .status(404)
    .render("404", {
      docTitle: "Page not found",
      path: "",
      isAuthenticated: false,
    });
};
