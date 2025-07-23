document.getElementById("pastaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const pastaType = document.getElementById("pastaType").value;
  const quantity = document.getElementById("quantity").value;
  const address = document.getElementById("address").value.trim();
  const sendMethod = document.getElementById("sendMethod").value;

  if (!name || !pastaType || !quantity || !address || !sendMethod) {
    alert("Please fill out all fields and choose a send method.");
    return;
  }

  const message = `New Pasta Order 🍝\nName: ${name}\nPasta: ${pastaType}\nQuantity: ${quantity}\nAddress: ${address}`;

  if (sendMethod === "whatsapp") {
    const phoneNumber = "o3120452699"; // 🔁 Replace with your number
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  } else if (sendMethod === "email") {
    const email = "rebiyaismail86@gmail.com"; // 🔁 Replace with your email
    const subject = "New Pasta Order 🍝";
    const mailToURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailToURL;
  }

  document.getElementById("pastaForm").reset();
  document.getElementById("confirmationMsg").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("confirmationMsg").classList.add("hidden");
  }, 5000);
});
