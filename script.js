let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;
let sortTitleAsc = true;
let sortPriceAsc = true;

async function getAll() {
  const url = "https://api.escuelajs.co/api/v1/products";
  const res = await fetch(url);
  const data = await res.json();

  allProducts = data;
  filteredProducts = data;

  render();
}

function render() {
  renderTable();
  renderPagination();
}

function renderTable() {
  const tbody = document.getElementById("product-body");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredProducts.slice(start, end);

  pageData.forEach(item => {
    let imgUrl = "";

    if (item.images && item.images.length > 0) {
      let rawImg = item.images[0];

      if (rawImg.startsWith("[")) {
        try {
          rawImg = JSON.parse(rawImg)[0];
        } catch (e) {}
      }

      imgUrl = rawImg;
    }

    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td class="title-cell">
  ${item.title}
  <span class="desc-tooltip">${item.description || ""}</span>
</td>
        <td>${item.price}</td>
        <td>
          <img 
            src="${imgUrl}"
            onerror="this.src='https://picsum.photos/seed/${item.id}/120'"
            style="width:120px;height:120px;object-fit:contain;background:white"
          >
        </td>
      </tr>
    `;
  });
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button onclick="goToPage(${i})" ${i === currentPage ? "disabled" : ""}>
        ${i}
      </button>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  renderTable();
  renderPagination();
}

// SEARCH
function searchByTitle() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  filteredProducts = allProducts.filter(item =>
    item.title.toLowerCase().includes(keyword)
  );

  currentPage = 1;
  render();
}

// CHANGE PAGE SIZE
function changePageSize() {
  pageSize = parseInt(document.getElementById("pageSize").value);
  currentPage = 1;
  render();
}
function sortByTitle() {
  filteredProducts.sort((a, b) => {
    if (sortTitleAsc) {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  sortTitleAsc = !sortTitleAsc;
  currentPage = 1;
  render();
}

function sortByPrice() {
  filteredProducts.sort((a, b) => {
    if (sortPriceAsc) {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  sortPriceAsc = !sortPriceAsc;
  currentPage = 1;
  render();
}

getAll();