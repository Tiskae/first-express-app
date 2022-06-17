const deleteProdBtns = document.querySelectorAll(".btn-delete-product");

const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector("input[name='id']").value;
  const csrfToken = btn.parentNode.querySelector("input[name='_csrf']").value;
  const productELement = btn.closest(".product-item");
  const rootParent = productELement.closest(".grid");

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then(result => {
      if (result.status === 200) {
        rootParent.removeChild(productELement);
      } else {
        throw new Error("Deleting failed!");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

deleteProdBtns.forEach(el => el.addEventListener("click", deleteProduct));
