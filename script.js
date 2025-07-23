
function getCart() {
  return JSON.parse(localStorage.getItem('pastaliciousCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('pastaliciousCart', JSON.stringify(cart));
}

// Add to Cart button logic on item pages
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);

    // Get current page to know which item is added
    const pageTitle = document.querySelector('h2').innerText.toLowerCase();

    let item = null;

    if (pageTitle.includes('carbonara')) {
      item = {
        id: 'carbonara',
        name: 'Spaghetti Carbonara',
        price: 550,
        quantity,
      };
    } else if (pageTitle.includes('alfredo')) {
      item = {
        id: 'alfredo',
        name: 'Fettuccine Alfredo',
        price: 600,
        quantity,
      };
    }

    if (item) {
      const cart = getCart();

      // Check if item already in cart
      const existingIndex = cart.findIndex(ci => ci.id === item.id);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += item.quantity;
      } else {
        cart.push(item);
      }

      saveCart(cart);
      alert(`${item.name} added to cart!`);
    }
  });
}

// On Cart page: display cart and handle order form
const cartItemsDiv = document.getElementById('cartItems');
const orderForm = document.getElementById('orderForm');

if (cartItemsDiv) {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty. <a href="index.html">Go order some delicious pasta!</a></p>';
  } else {
    // Show cart items in table
    let tableHTML = `<table class="cart-table">
      <thead>
        <tr>
          <th>Item</th><th>Price (PKR)</th><th>Quantity</th><th>Total (PKR)</th><th>Remove</th>
        </tr>
      </thead><tbody>`;

    cart.forEach((item, index) => {
      tableHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>${item.quantity}</td>
          <td>${item.price * item.quantity}</td>
          <td><button class="remove-btn" data-index="${index}">X</button></td>
        </tr>`;
    });

    tableHTML += '</tbody></table>';

    // Show total sum
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    tableHTML += `<p><strong>Total Amount: PKR ${total}</strong></p>`;

    cartItemsDiv.innerHTML = tableHTML;
    orderForm.style.display = 'block';

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        cart.splice(index, 1);
        saveCart(cart);
        location.reload();
      });
    });
  }
}

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const deliveryTime = document.getElementById('deliveryTime').value;
    const address = document.getElementById('address').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if (!deliveryTime || !address) {
      alert('Please fill all required fields.');
      return;
    }

   
    let message = `*Pastalicious Order*\n\nItems:\n`;
    cart.forEach(item => {
      message += `- ${item.name} x${item.quantity} = PKR ${item.price * item.quantity}\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nTotal: PKR ${total}\n`;
    message += `Delivery Time: ${deliveryTime}\n`;
    message += `Delivery Address: ${address}\n`;
    message += `Payment Method: ${payment}\n\nThank you for your order!`;

    const waNumber = '03120452699'; 
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  
    localStorage.removeItem('pastaliciousCart');
    alert('Redirecting to WhatsApp to place your order.');
    window.open(waLink, '_blank');
  });
}
