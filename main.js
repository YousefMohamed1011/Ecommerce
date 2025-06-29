let list = document.querySelector(".category-list");
let product = document.getElementById("product");
let producttwo = document.getElementById("productTwo");
let productmobiles = document.getElementById("productmobiles");
let productFour = document.getElementById("productappliances");
let cart = document.getElementById("cart");
let CountIcon = document.getElementById("count-item");
let cartcount = document.getElementById("cart-count");
let priceTotal = document.querySelector(".price-total");
let UlLinks = document.querySelector(".ul-links");
let checkout_items = document.getElementById("checkout_items");

const handleOpen = () => {
  list.classList.toggle("active");
};

const handleOpenCart = () => {
  cart.classList.toggle("active");
};

const OpenMenu = () => {
  UlLinks.classList.toggle("active");
};

const CloseMenu = () => {
  UlLinks.classList.remove("active");
};

fetch("/data/products.json")
  .then((response) => response.json())
  .then((data) => {
    let allProductsHtml = "";
    let electronicsHtml = "";
    let mobilesHtml = "";
    let appliances = "";

    data.forEach((productItem) => {
      let OldPrice = productItem.old_price
        ? `<p class="old-price">$${productItem.old_price}</p>`
        : " ";
      let discount = productItem.old_price
        ? `<span class="sale-paresent">%${Math.floor(
            ((productItem.old_price - productItem.price) /
              productItem.old_price) *
              100
          )}</span>`
        : " ";

      let productHtml = `
        <div class="swiper-slide product">
          ${discount}
          <div class="img-products">
            <img src="${productItem.img}" alt="" />
          </div>
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <p class="name-products">
            <a href="#">${productItem.name}</a>
          </p>
          <div class="price">
            <span>$${productItem.price}</span>
            ${OldPrice}
          </div>
          <div class="icons">
            <span class="icon-cart" data-id="${productItem.id}">
              <i class="fa-solid fa-cart-shopping"></i>Add To Cart
            </span>
            <span class="icon-product">
              <i class="fa-solid fa-heart"></i>
            </span>
          </div>
        </div>
      `;

      allProductsHtml += productHtml;

      if (productItem.category === "electronics") {
        electronicsHtml += productHtml;
      } else if (productItem.category === "mobiles") {
        mobilesHtml += productHtml;
      } else if (productItem.category === "appliances") {
        appliances += productHtml;
      }
    });

    product.innerHTML = allProductsHtml;
    producttwo.innerHTML = electronicsHtml;
    productmobiles.innerHTML = mobilesHtml;
    productFour.innerHTML = appliances;

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let AddToCart = document.querySelectorAll(".icon-cart");

    AddToCart.forEach((btn) => {
      let productId = btn.getAttribute("data-id");

      if (cartItems.find((item) => item.id == productId)) {
        btn.classList.add("active");
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>Product  Cart`;
      }

      btn.addEventListener("click", () => {
        let selected = data.find((product) => product.id == productId);
        AddCart(selected);
        let allbtn = document.querySelectorAll(
          `.icon-cart[data-id="${productId}"]`
        );
        allbtn.forEach((btn) => {
          btn.classList.add("active");
          btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>Product  Cart`;
        });
      });
    });
  });

function AddCart(selected) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingItem = cart.find((item) => item.id === selected.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...selected, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  UpdateCart();
}

function UpdateCart() {
  let cartProduct = document.getElementById("cartProduct");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartProduct.innerHTML = "";
  if (checkout_items) checkout_items.innerHTML = "";
  CountIcon.innerHTML = cart.length;
  cartcount.innerHTML = cart.length;
  let total_price = 0;

  cart.forEach((item, index) => {
    let TotalPrice = item.price * item.quantity;
    total_price += TotalPrice;

    cartProduct.innerHTML += `
      <div class="items">
        <img src="${item.img}" alt="" />
        <div class="details">
          <h4>${item.name}</h4>
          <p class="price-cart">$${TotalPrice}</p>
        </div>
        <div class="quantity-control">
          <button class="dec" data-id="${index}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="inc" data-id="${index}">+</button>
        </div>
        <button class="delete-product" data-id="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    if (checkout_items) {
      checkout_items.innerHTML += `
        <div class="item_cart">
          <div class="image_name">
            <img src="${item.img}" alt="" />
          </div>
          <div class="content">
            <h4>${item.name}</h4>
            <p class="price_cart">$${TotalPrice}</p>
            <div class="quantity_control">
              <button class="dec" data-id="${index}">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="inc" data-id="${index}">+</button>
            </div>
          </div>
                  <button class="delete-product" data-id="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        </div>

      `;
    }
  });

  priceTotal.innerHTML = `$${total_price.toFixed(2)}`;

  if (
    document.querySelector(".subtotal_checkout") &&
    document.querySelector(".total_checkout")
  ) {
    let subtotal_checkout = document.querySelector(".subtotal_checkout");
    let total_checkout = document.querySelector(".total_checkout");
    let shipping = 10;
    subtotal_checkout.innerHTML = `$${total_price.toFixed(2)}`;
    total_checkout.innerHTML = `$${(total_price + shipping).toFixed(2)}`;
  }

  let deletBtns = document.querySelectorAll(".delete-product");
  deletBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let index = e.target.closest("button").getAttribute("data-id");
      Delete(index);
    });
  });

  let incBtns = document.querySelectorAll(".inc");
  incBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let index = e.target.getAttribute("data-id");
      increase(index);
    });
  });

  let decBtns = document.querySelectorAll(".dec");
  decBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let index = e.target.getAttribute("data-id");
      decrease(index);
    });
  });

  function Delete(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let removedItem = cart.splice(index, 1)[0];
    localStorage.setItem("cart", JSON.stringify(cart));
    UpdateCart();
    UpdateStatebtn(removedItem.id);
  }
}

function UpdateStatebtn(id) {
  let btns = document.querySelectorAll(`.icon-cart[data-id="${id}"]`);
  btns.forEach((btn) => {
    btn.classList.remove("active");
    btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>Add To Cart`;
  });
}

function increase(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  UpdateCart();
}

function decrease(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  UpdateCart();
}

UpdateCart();
