if (
  document.location.href.search("flight.easemytrip.com") &&
  document.location.href.search("Review") &&
  document.location.href.search("Checkout")
) {
  console.log("hello");
  let orgs = document.querySelectorAll("[ng-bind=\"l.org.split('|')[0]\"]");
  let dests = document.querySelectorAll("[ng-bind=\"l.dest.split('|')[0]\"]");

  if (orgs && dests) {
    for (let i = 0; i < orgs.length / 2; i++) {
      console.log(orgs[i].outerText, "-->", dests[i].outerText);
    }
  }
}
