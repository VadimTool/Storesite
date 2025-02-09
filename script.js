const PRODUCTS = [
  {
    id: 1,
    name: "Костюм мужской",
    photo: "./images/men.webp",
    price: 16000,
    sale: true,
    discount: "-23%",
    oldPrice: 170000,
    color: "золотой",
  },
  {
    id: 2,
    name: "Костюм женский",
    photo: "./images/woman.webp",
    oldPrice: 14330,
    price: 13330,
    sale: true,
    color: "голубой",
  },
  {
    id: 3,
    name: "Макбук",
    photo: "./images/notebok.webp",
    price: 45000,
    new: true,
    color: "графитовый",
  },
];

const sortBlock = document.getElementById("sort");
const priceMinBlock = document.getElementById("price-min");
const priceMaxBlock = document.getElementById("price-max");
const colorCheckboxes = document.getElementsByClassName("main-color-checkbox");
const resetBtn = document.getElementById("reset-btn");
const basketCount = document.getElementById("basket-count");

const createLabel = (label, product) => {
  const labelBlock = document.createElement("div");
  labelBlock.className = `label ${label}`;

  switch (label) {
    case "new":
      labelBlock.innerText = "Новинка";
      break;
    case "sale":
      labelBlock.innerText = "Распродажа";
      break;
    case "discount":
      labelBlock.innerText = product.discount;
      break;
  }

  return labelBlock;
};

const filter = {
  price: {},
  colors: [],
};

let sortDirection = "";

// TODO: Отрефактори данную функцию
const createProduct = (product) => {
  const productWrapper = document.createElement("div");
  productWrapper.className = "product";

  // Создаем лейблы
  if (product.new || product.sale || product.discount) {
    const labels = document.createElement("div");
    labels.className = "labels";

    if (product.new) {
      const label = createLabel("new", product);
      labels.appendChild(label);
    }
    if (product.discount) {
      const label = createLabel("discount", product);
      labels.appendChild(label);
    }

    if (product.sale) {
      const label = createLabel("sale", product);
      labels.appendChild(label);
    }

    productWrapper.appendChild(labels);
  }

  // Создаем избранное
  const favorites = document.createElement("div");
  favorites.className = "favorites";

  const imgFavorites = document.createElement("img");
  imgFavorites.src = "./icons/gray-heart.svg";
  imgFavorites.className = "no-in-favorites";

  const imgInFavorites = document.createElement("img");
  imgInFavorites.src = "./icons/red-heart.svg";
  imgInFavorites.className = "in-favorites";

  favorites.appendChild(imgFavorites);
  favorites.appendChild(imgInFavorites);

  favorites.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("in");
  });

  productWrapper.appendChild(favorites);

  // Создаем фото
  const photo = document.createElement("div");
  photo.className = "photo";

  const mainImage = document.createElement("img");
  mainImage.src = product.photo;
  mainImage.alt = product.name;

  photo.appendChild(mainImage);

  productWrapper.appendChild(photo);

  // Создаем name
  const name = document.createElement("div");
  name.className = "name";
  name.innerText = product.name;

  productWrapper.appendChild(name);

  // Создаем блок с ценами
  const productFooter = document.createElement("div");
  productFooter.className = "product-footer";

  const priceContainer = document.createElement("div");
  priceContainer.className = "price-container";

  if (product.oldPrice) {
    const oldPrice = document.createElement("div");
    oldPrice.className = "old-price";
    oldPrice.innerText = `${product.oldPrice} руб`;

    priceContainer.appendChild(oldPrice);
  }

  const price = document.createElement("div");
  price.className = "price";
  price.innerText = `${product.price.toFixed(2)} руб`;
  priceContainer.appendChild(price);

  productFooter.appendChild(priceContainer);

  const productAction = document.createElement("div");
  productAction.className = "product-action";

  const actionImg = document.createElement("img");
  actionImg.src = "./icons/basket-white.svg"
  actionImg.className = "product-action-img"

  productAction.appendChild(actionImg);

  productAction.addEventListener("click", (e) => {
    const currentElement = e.currentTarget;

    const countInBasketOldBlock =
      currentElement.getElementsByClassName("count-in-basket")[0];
    let countInBaksetValue = 1;

    if (countInBasketOldBlock) {
      countInBaksetValue = Number(countInBasketOldBlock.innerText) + 1;
    }

    currentElement.innerHTML = "+1 шт";

    const countInBasketBlock = document.createElement("div");
    countInBasketBlock.className = "count-in-basket";
    countInBasketBlock.innerHTML = countInBaksetValue;

    currentElement.appendChild(countInBasketBlock);

    const countInBasket = Number(basketCount.innerText);
    basketCount.innerText = countInBasket + 1;
  });

  productFooter.appendChild(productAction);

  productWrapper.appendChild(productFooter);

  return productWrapper;
};

const createProductList = (products) => {
  const productsWrapper = document.getElementById("products");

  productsWrapper.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const product = createProduct(products[i]);
    productsWrapper.appendChild(product);
  }
};

const sortProducts = (products, sortDirection) => {
  switch (sortDirection) {
    case "PRICE_ASC":
      products.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        }

        if (a.price > b.price) {
          return 1;
        }

        return 0;
      });
      break;
    case "PRICE_DESC":
      products.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        }

        if (a.price < b.price) {
          return 1;
        }

        return 0;
      });
      break;
    case "NEW":
      products.sort((a, b) => {
        if (a?.new) {
          return -1;
        }

        return 0;
      });
      break;
    case "NAME":
      products.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }

        if (a.name > b.name) {
          return 1;
        }

        return 0;
      });
      break;
  }

  return products;
};

const filterProducts = (filter, sortDirection) => {
  let products = [...PRODUCTS];

  if (filter) {
    if (filter.price.min || filter.price.max) {
      products = products.filter((product) => {
        if (filter.price.min && filter.price.max) {
          return (
            product.price <= filter.price.max &&
            product.price >= filter.price.min
          );
        }

        if (filter.price.min) {
          return product.price >= filter.price.min;
        }

        if (filter.price.max) {
          return product.price <= filter.price.max;
        }
      });
    }

    if (filter.colors && filter.colors.length) {
      products = products.filter((product) => {
        return filter.colors.includes(product.color);
      });
    }
  }

  if (sortDirection) {
    products = sortProducts(products, sortDirection);
  }

  return products;
};

sortBlock.addEventListener("change", (e) => {
  sortDirection = e.target.value;

  if (!sortDirection) {
    const products = filterProducts(filter, "");
    createProductList(products);
    return;
  }

  const products = filterProducts(filter, sortDirection);

  createProductList(products);
});

priceMinBlock.addEventListener("keyup", (e) => {
  const minPrice = Number(e.target.value);

  if (!minPrice) {
    delete filter.price?.min;

    const products = filterProducts(filter, sortDirection);

    createProductList(products);
    return;
  }

  filter.price.min = minPrice;

  const products = filterProducts(filter, sortDirection);

  createProductList(products);
});

priceMaxBlock.addEventListener("keyup", (e) => {
  const maxPrice = Number(e.target.value);

  if (!maxPrice) {
    delete filter.price?.max;

    const products = filterProducts(filter, sortDirection);

    createProductList(products);
    return;
  }

  filter.price.max = maxPrice;

  const products = filterProducts(filter, sortDirection);

  createProductList(products);
});

for (let i = 0; i < colorCheckboxes.length; i++) {
  colorCheckboxes[i].addEventListener("change", (e) => {
    const color = e.target.value;

    if (e.target.checked) {
      filter.colors.push(color);

      const products = filterProducts(filter, sortDirection);

      createProductList(products);
      return;
    }

    console.log(filter.colors);

    filter.colors = filter.colors.filter((item) => item !== color);

    const products = filterProducts(filter, sortDirection);

    createProductList(products);
    return;
  });
}

resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createProductList(PRODUCTS);
});

createProductList(PRODUCTS);
