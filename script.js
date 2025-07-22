document.getElementById("pastaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const pastaType = document.getElementById("pastaType").value;
  const quantity = document.getElementById("quantity").value;
  const address = document.getElementById("address").value.trim();

  if (!name || !pastaType || !quantity || !address) {
    alert("Please fill out all fields.");
    return;
  }

  const order = {
    name,
    pastaType,
    quantity,
    address,
    time: new Date().toLocaleString(),
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  document.getElementById("pastaForm").reset();
  document.getElementById("confirmationMsg").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("confirmationMsg").classList.add("hidden");
  }, 4000);
});

