if (document.location.href.search("amazon.in") !== -1) {
  const addToCart = document.getElementById("add-to-cart-button");

  if (addToCart) {
    addToCart.addEventListener("click", (_) => {
      const category = document.querySelector(
        "[selected='selected']"
      ).outerText;
      const title = document.getElementById("productTitle").innerText;
      console.log(category, title);
      let existing = JSON.parse(sessionStorage.getItem("Shunya"));
      if (existing == null) existing = [];
      existing.push({ category: category, title: title });
      console.log(existing);
      sessionStorage.setItem("Shunya", JSON.stringify(existing));
    });
  }

  const h = document.getElementsByTagName("h1")[0];

  if (h.outerText === "Shopping Cart") {
    let prices = document.getElementsByClassName("sc-product-price");

    let data = JSON.parse(sessionStorage.getItem("Shunya"));

    for (let i = prices.length - 1; i >= 0; i--) {
      console.log(data[i], parseFloat(prices[prices.length - 1 - i].outerText));
    }
  }
}
