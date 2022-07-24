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

    let payload = { items: [] };
    for (let i = prices.length - 1; i >= 0; i--) {
      payload["items"].push({
        category: data[i]["category"],
        title: data[i]["title"],
        price: parseFloat(
          prices[prices.length - 1 - i].outerText.replace(",", "")
        ),
      });
    }
    fetch("http://localhost:5000/api/shopping/data", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        const checkout = document.querySelector(
          "[data-feature-id='proceed-to-checkout-label']"
        );
        checkout.outerText = `Checkout - Emissions: ${Math.floor(
          res["emissions"]
        )} kg`;

        chrome.storage.local.set(
          { emissions: Math.floor(res["emissions"]) },
          () => {
            console.log("done");
          }
        );
      });

    const checkout = document.querySelector('[name="proceedToRetailCheckout"]');

    checkout.addEventListener("click", (_) => {
      chrome.storage.local.remove(["emissions"]);
      fetch("http://localhost:5000/api/shopping", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
    });
  }
}
