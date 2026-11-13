// blocks/product-cards/product-cards.js
const DEFAULT_API = 'https://main--2026-nov-training--jmffraiz.aem.page/product-data.json';
 
async function fetchItems(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`API ${resp.status}`);
  const data = await resp.json();
  // DummyJSON wraps results in { products: [...] }
  return Array.isArray(data) ? data : data.data;
}
 
// Support both DummyJSON and MockAPI field names
function normalise(item) {
  return {
    title: item.title || item.name,
    image: item.thumbnail || item.image,
    price: item.price,
  };
}

function buildCard(item) {
  const { title, image, price } = normalise(item);
 
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.src = image;
  img.alt = title;
  img.loading = 'lazy';
 
  const h3 = document.createElement('h3');
  h3.textContent = title;
 
  const p = document.createElement('p');
  p.className = 'price';
  p.textContent = `$${price}`;
 
  li.append(img, h3, p);
  return li;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const url = link ? link.href : DEFAULT_API;
  block.textContent = '';
 
  try {
    const items = await fetchItems(url);
    const ul = document.createElement('ul');
    items.forEach((item) => ul.append(buildCard(item)));
    block.append(ul);
  } catch (e) {
    block.innerHTML = '<p class="error">Unable to load items.</p>';
  }
}
