loadJSON();
async function loadJSON() {
  const productList = document.getElementsByClassName("product-list")[0];
  const data = await fetch("products.json")
  const response = await data.json()

  response.forEach((product) => {
    productList.innerHTML += `
      <div class="col ${product.class}" id="${product.id}">
        <img src="${product.img}" alt="" />
        <div class="product-title">
          <h4>${product.name}</h4>
          <button class="btn">Bunu seç</button>
        </div>
        <p>${product.info}</p>
      </div>
      `;
    openProductModal()
  });
}


function openProductModal() {
  const productList = document.getElementsByClassName("product-list")[0];
  const cartImg = productList.querySelectorAll("img")
  const cartBtn = productList.querySelectorAll("button")
  const productModal = document.getElementById("product-modal")

  cartImg.forEach((item) => {
    item.onclick = (e) => {
      productModal.classList.add("show")
      document.body.classList.add("show")
      fillProductModal(e.target.parentNode.id)
    }
  })

  cartBtn.forEach((item) => {
    item.onclick = (e) => {
      productModal.classList.add("show")
      document.body.classList.add("show")
      fillProductModal(e.target.parentNode.parentNode.id)
    }
  })
}


closeProductModal()
function closeProductModal() {
  const productModal = document.getElementById("product-modal")

  document.getElementById("cart-close").onclick = () => {
    productModal.classList.remove("show")
    document.body.classList.remove("show")
    resetCart()
  }

  windowCloseFunc()
}


async function fillProductModal(id) {
  const data = await fetch("products.json")
  const response = await data.json()

  document.querySelector(".product-modal-container").setAttribute("id", id)
  document.querySelector(".img-container img").src = response[id].img
  document.getElementsByClassName("cart-title")[0].innerHTML = response[id].name
  document.getElementById("select")[0].innerHTML = `Kicik, 10 sm - ${response[id].price.kicik}$`
  document.getElementById("select")[1].innerHTML = `Orta, 20 sm - ${response[id].price.orta}$`
  document.getElementById("select")[2].innerHTML = `Boyuk, 30 sm - ${response[id].price.boyuk}$`
  selectType()
}

document.getElementById("select").onchange = () => {
  selectType()
}
function selectType() {
  let select = document.getElementById("select");
  select = select[select.selectedIndex].text;
  select = select.slice(-3);
  document.getElementsByClassName("cart-price")[0].innerHTML = select;

  document.getElementById("cart-count").innerHTML = 1
  document.getElementById("minus-cart").style.background = "gray"

  countCartPrice()
}


active_nazik()
function active_nazik() {
  const nazik = document.getElementsByClassName("nazik")[0];
  const enenevi = document.getElementsByClassName("enenevi")[0];
  nazik.onclick = () => {
    nazik.classList.add("active");
    enenevi.classList.remove("active");
  };
}

active_enenevi()
function active_enenevi() {
  const nazik = document.getElementsByClassName("nazik")[0];
  const enenevi = document.getElementsByClassName("enenevi")[0];
  enenevi.onclick = () => {
    enenevi.classList.add("active");
    nazik.classList.remove("active");
  };
  enenevi.click();
}


incCartCount()
function incCartCount() {
  let plusBtn = document.getElementById("plus-cart");
  let minusBtn = document.getElementById("minus-cart");

  plusBtn.onclick = () => {
    let cartCount = Number(document.getElementById("cart-count").innerHTML);
    cartCount += 1
    document.getElementById("cart-count").innerHTML = cartCount;

    if (cartCount > 1) {
      minusBtn.style.background = "#0f9675";
    }

    countCartPrice()
  };
}


decCartCount()
function decCartCount() {
  let minusBtn = document.getElementById("minus-cart");

  minusBtn.onclick = () => {
    let cartCount = Number(document.getElementById("cart-count").innerHTML);
    cartCount -= 1
    document.getElementById("cart-count").innerHTML = cartCount;

    if (cartCount == 1) {
      minusBtn.style.background = "gray";
    }
    if (cartCount == 0) {
      document.getElementById("cart-count").textContent = 1;
    }

    countCartPrice()
  };
}


function countCartPrice() {
  const cartCount = Number(document.getElementById("cart-count").textContent);
  let select = document.getElementById("select");
  select = select[select.selectedIndex].text;
  select = Number(select.slice(-3, -1));
  document.getElementsByClassName("cart-price")[0].textContent =
    cartCount * select + "$";
}


openBasketModal()
function openBasketModal() {
  const basket = document.querySelectorAll(".basket")
  const basketModal = document.getElementById("basket-modal")
  const productModal = document.getElementById("product-modal")

  basket.forEach(el => {
    el.onclick = () => {
      basketModal.classList.add("show")
      document.body.classList.add("show")
      productModal.classList.remove("show")
      resetCart()
    }
  });
}


closeBaketModal()
function closeBaketModal() {
  const basketModal = document.getElementById("basket-modal")
  document.getElementById("basket-close").onclick = () => {
    basketModal.classList.remove("show")
    document.body.classList.remove("show")
  }

  windowCloseFunc()
}


let array = JSON.parse(localStorage.getItem("productStorage")) || [];

fillBasketModal()
function fillBasketModal() {
  document.getElementsByClassName("add-btn")[0].onclick = (e) => {
    const img = document.querySelector(".img-container img").src;
    const name = document.getElementsByClassName("cart-title")[0].textContent
    const cartCount = Number(document.getElementById("cart-count").textContent);
    const cartPrice = document.getElementsByClassName("cart-price")[0].textContent
    const id = e.target.parentNode.parentNode.id
    let select = document.getElementById("select");
    select = select[select.selectedIndex].text;

    const type = document.getElementsByClassName("product-type");
    const productName = document.getElementsByClassName("product-name");

    for (i = 0; i < type.length; i++) {
      if (type[i].textContent == select && productName[i].textContent == name) {
        const basketCount = Number(document.getElementsByClassName("basket-count")[i].textContent);
        const toalCount = cartCount + basketCount;
        document.getElementsByClassName("basket-count")[i].textContent = toalCount;
        array.forEach((item) => item.cartCount = toalCount);

        countBasketPrice()
        totalCount()
        countTotalPrice()
        changeBtnColor()
        return;
      }
    }

    array.push({ img, name, select, cartCount, cartPrice, id })
    localStorage.setItem("productStorage", JSON.stringify(array));
    addToBasket(img, name, select, cartCount, cartPrice, id)
  }
}

loadBasketItem()
function loadBasketItem() {
  array.forEach((el) => {
    const { img, name, select, cartCount, cartPrice, id } = el
    addToBasket(img, name, select, cartCount, cartPrice, id)
  })
}

function addToBasket(img, name, select, cartCount, cartPrice, id) {
  document.getElementsByClassName("products-container")[0].innerHTML += `
    <div class="products" id="${id}">
      <div class="product-info">
        <img src="${img}"alt="" />
        <div>
           <span class="product-name">${name}</span>
           <span class="product-type">${select}</span>
        </div>
      </div>
      <div class="count count-basket">
        <span class="fa fa-minus basket"></span>
        <span class="basket-count">${cartCount}</span>
        <span class="fa fa-plus basket"></span>
      </div>
      <div class="modal-price">
        <span class="basket-price">${cartPrice}</span>
        <i class="fa fa-times" onclick="remove(event)"></i>
      </div>
    </div>
    `;
  changeBtnColor()
  incBasketCount()
  decBasketCount()
  totalCount()
  countTotalPrice()
  changeButtonText()
}

function saveStorage(e, basketCount) {
  const type = e.target.parentElement.previousElementSibling.children[1].children[1].textContent;
  const name = e.target.parentElement.previousElementSibling.children[1].children[0].textContent;
  array.forEach((item) => {
    if (item.name == name && item.select == type) {
      item.cartCount = basketCount
    }
  });
  localStorage.setItem("productStorage", JSON.stringify(array));
}

function incBasketCount() {
  const plusBtn = document.getElementsByClassName("fa fa-plus basket");
  for (let i = 0; i < plusBtn.length; i++) {
    plusBtn[i].onclick = (e) => {

      const minusBtn = e.target.previousElementSibling.previousElementSibling;
      let basketCount = Number(e.target.previousElementSibling.textContent);
      basketCount = basketCount + 1;
      e.target.previousElementSibling.textContent = basketCount;

      if (basketCount > 1) {
        minusBtn.style.background = "#0f9675";
      }

      saveStorage(e, basketCount)
      countBasketPrice()
      countTotalPrice()
      totalCount()
    }
  }
}


function decBasketCount() {
  const minusBtn = document.getElementsByClassName("fa fa-minus basket");
  for (let i = 0; i < minusBtn.length; i++) {
    minusBtn[i].onclick = (e) => {
      let basketCount = Number(e.target.nextElementSibling.textContent);
      basketCount -= 1
      e.target.nextElementSibling.textContent = basketCount;

      if (basketCount == 1) {
        e.target.style.background = "gray";
      }
      if (basketCount == 0) {
        e.target.nextElementSibling.textContent = 1;
      }

      saveStorage(e, basketCount)
      countBasketPrice()
      countTotalPrice()
      totalCount()
    }
  }
};


function countBasketPrice() {
  const basketCount = document.getElementsByClassName("basket-count")
  for (i = 0; i < basketCount.length; i++) {
    let price = document.getElementsByClassName("product-type")[i].innerHTML
    price = Number(price.slice(-3, -1));

    const basketCountInner = Number(basketCount[i].textContent)
    const totalPrice = price * basketCountInner
    document.getElementsByClassName("basket-price")[i].innerHTML = totalPrice + "$"

    const type = document.getElementsByClassName("product-type")[i].innerHTML
    const name = document.getElementsByClassName("product-name")[i].innerHTML
    array.forEach((item) => {
      if (item.name == name && item.select == type) {
        item.cartPrice = totalPrice + "$"
      }
    });
    localStorage.setItem("productStorage", JSON.stringify(array));
  }
}


function countTotalPrice() {
  const price = document.getElementsByClassName("basket-price");
  let total = 0;
  for (i = 0; i < price.length; i++) {
    total += Number(price[i].textContent.slice(-4, -1));
  }

  document.getElementById("total-price").innerHTML = `Ümumi məbləğ: ${total}$`
  const basketIconPrice = document.querySelectorAll(".basket-icon-price")
  basketIconPrice.forEach(el => el.innerHTML = `${total}$`)
}


function totalCount() {
  const basketCount = document.getElementsByClassName("basket-count");
  let total = 0;
  for (i = 0; i < basketCount.length; i++) {
    total += Number(basketCount[i].textContent);
  }

  document.getElementsByClassName("total-count")[0].innerHTML = `Səbətinizdə məhsulların sayı: <span>${total}</>`
  const basketIconCount = document.querySelectorAll(".basket-icon-count")
  basketIconCount.forEach(el => el.innerHTML = total)
}


function remove(e) {
  if (e.target.className == "fa fa-times") {
    e.target.parentElement.parentElement.remove();

    const type = e.target.parentElement.previousElementSibling.previousElementSibling.children[1].children[1].textContent;
    const name = e.target.parentElement.previousElementSibling.previousElementSibling.children[1].children[0].textContent;
    array = array.filter((item) => {
      if (item.name == name) {
        return item.select != type;
      } else {
        return item.name != name;
      }
    });
    localStorage.setItem("productStorage", JSON.stringify(array));

    countTotalPrice()
    totalCount()
    changeButtonText()
  }
}


changeButtonText()
function changeButtonText() {
  const products = document.querySelectorAll(".products")
  const checkoutBtn = document.getElementById("checkout-btn")
  if (products.length === 0) {
    checkoutBtn.innerHTML = "menyuya keçin"
  } else {
    checkoutBtn.innerHTML = "sifarişi göndər"
  }

  checkoutBtn.onclick = () => {
    if (products.length === 0) {
      document.getElementById("basket-modal").classList.remove("show")
      document.body.classList.remove("show")
    }
  }
}


function changeBtnColor() {
  const countItem = document.getElementsByClassName("basket-count");
  const minus = document.getElementsByClassName("fa fa-minus basket");
  for (i = 0; i < countItem.length; i++) {
    if (Number(countItem[i].textContent) > 1) {
      minus[i].style.background = "#0f9675";
    }
  }
}


function resetCart() {
  setTimeout(() => {
    document.getElementById("cart-count").innerHTML = "1"
    document.getElementById("select").value = ""
    document.getElementsByClassName("fa fa-minus")[0].style.background = "gray";
    document.getElementsByClassName("enenevi")[0].click()
  }, 300);
}


function windowCloseFunc() {
  const basketModal = document.getElementById("basket-modal")
  const productModal = document.getElementById("product-modal")

  window.onclick = (event) => {
    if (event.target == basketModal) {
      basketModal.classList.remove("show");
      document.body.classList.remove("show")
    }
    if (event.target == productModal) {
      productModal.classList.remove("show");
      document.body.classList.remove("show")
      resetCart()
    }
  };
}


function tab(par) {
  const col = document.querySelectorAll(".col");
  const tab = document.querySelectorAll(".tab");
  col.forEach(el => el.style.display = "none");
  tab.forEach(el => el.classList.remove("active"));

  const items = document.querySelectorAll(`.${par}`);
  items.forEach(el => el.style.display = "block");
  event.target.classList.add("active");
}
document.getElementById("active").click();