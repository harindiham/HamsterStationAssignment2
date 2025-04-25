
    const cart = {};

    function addToCart(name, price) {
      const qtyInput = document.getElementById(`qty-${name}`);
      const quantity = parseInt(qtyInput.value) || 1;

      if (cart[name]) {
        cart[name].quantity += quantity;
      } else {
        cart[name] = { price, quantity };
      }
      renderCart();
    }

    function renderCart() {
      const tbody = document.getElementById("cart-body");
      tbody.innerHTML = "";
      let grandTotal = 0;

      for (const [name, data] of Object.entries(cart)) {
        const total = data.price * data.quantity;
        grandTotal += total;
        tbody.innerHTML += `<tr>
          <td>${name}</td>
          <td>${data.quantity}</td>
          <td>$${data.price}</td>
          <td>$${total}</td>
        </tr>`;
      }

      document.getElementById("grand-total").textContent = "$" + grandTotal;
    }

    function toggleCart() {
      const cartPanel = document.getElementById("cart-panel");
      cartPanel.style.display = cartPanel.style.display === "block" ? "none" : "block";
    }

    function goToCheckout() {
      localStorage.setItem("cartData", JSON.stringify(cart));
      location.href = "experiment2.html";
    }

    function dragElement(elmnt, header) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      header.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }

    dragElement(document.getElementById("cart-panel"), document.getElementById("cart-drag-header"));

