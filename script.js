// LocalStorage helpers
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

    const pageTitle = document.querySelector('h1').innerText.toLowerCase();

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
    } else if (pageTitle.includes('arrabiata')) {
      item = {
        id: 'arrabiata',
        name: 'Penne Arrabiata',
        price: 500,
        quantity,
      };
    } else if (pageTitle.includes('lasagna')) {
      item = {
        id: 'lasagna',
        name: 'Lasagna Bolognese',
        price: 650,
        quantity,
      };
    }

    if (item) {
      const cart = getCart();

      const existingIndex = cart.findIndex(ci => ci.id === item.id);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += item.quantity;
      } else {
        cart.push(item);
      }

      saveCart(cart);
      alert(`${item.name} (${item.quantity}) added to cart.`);
    }
  });
}

// On Cart page - display items and handle order submission
if (window.location.pathname.endsWith('cart.html')) {
  const cartItemsSection = document.getElementById('cartItems');
  const orderSection = document.querySelector('.order-section');
  const orderForm = document.getElementById('orderForm');

  function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
      cartItemsSection.innerHTML = '<p>Your cart is empty.</p>';
      orderSection.style.display = 'none';
      return;
    }

    let html = `<table class="cart-table">
      <thead>
        <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th><th>Remove</th></tr>
      </thead><tbody>`;

    let grandTotal = 0;

    cart.forEach((item, i) => {
      const total = item.price * item.quantity;
      grandTotal += total;
      html += `<tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>PKR ${item.price}</td>
        <td>PKR ${total}</td>
        <td><button data-index="${i}" class="removeBtn">Remove</button></td>
      </tr>`;
    });

    html += `</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align:right;"><strong>Grand Total:</strong></td>
          <td colspan="2"><strong>PKR ${grandTotal}</strong></td>
        </tr>
      </tfoot>
    </table>`;

    cartItemsSection.innerHTML = html;
    orderSection.style.display = 'block';

    // Add remove button handlers
    const removeBtns = document.querySelectorAll('.removeBtn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-index');
        let cart = getCart();
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  renderCart();

  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const deliveryTime = document.getElementById('deliveryTime').value;
    const address = document.getElementById('address').value.trim();
    const payment = orderForm.payment.value;
    const orderMethod = orderForm.orderMethod.value;

    if (!deliveryTime || !address) {
      alert('Please fill delivery time and address.');
      return;
    }
    let message = 'Pastalicious Order%0A';
    message += `Delivery Time: ${deliveryTime}%0A`;
    message += `Delivery Address: ${address}%0A`;
    message += `Payment Method: ${payment}%0A`;
    message += 'Order Details:%0A';

    let total = 0;
    cart.forEach(item => {
      message += `- ${item.name} x${item.quantity} = PKR ${item.price * item.quantity}%0A`;
      total += item.price * item.quantity;
    });

    message += `Total Price: PKR ${total}%0A`;
    message += 'Thank you for ordering from Pastalicious!';

    // WhatsApp & Email Info
    const whatsappNumber = '03120452699'; 
    const email = 'rebiyaismail93@gmail.com'; 

    if (orderMethod === 'whatsapp') {
      const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(waUrl, '_blank');
    } else {
      // Email with subject and body
      const subject = encodeURIComponent('Pastalicious Order');
      const body = decodeURIComponent(message.replace(/%0A/g, '\n'));
      window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    }

    localStorage.removeItem('pastaliciousCart');
  });
}
