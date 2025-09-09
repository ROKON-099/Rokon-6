
const PLANTS_API_URL = 'https://openapi.programming-hero.com/api/plants';
const container = document.getElementById('plants-container');
const categoryButtons = document.querySelectorAll('aside ul li button');
let allPlants = [];
let cart = [];

// Show plants
function loadPlants(plants) {
  container.innerHTML = ''; // Clear container
  plants.forEach(plant => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow p-4 flex flex-col items-center';

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover mb-2 rounded">
      <h3 class="font-semibold text-lg">${plant.name}</h3>
      <p class="text-sm text-gray-600">${plant.category || ''}</p>
      <button class="mt-2 px-3 py-1 bg-green-600 text-white rounded add-to-cart">Add to Cart</button>
    `;

    // Add to cart button
    card.querySelector('.add-to-cart').addEventListener('click', () => {
      addToCart(plant);
    });

    container.appendChild(card);
  });
}

// Fetch plants from API
async function fetchPlants() {
  try {
    const res = await fetch(PLANTS_API_URL);
    const data = await res.json();
    allPlants = data.data || data.plants || [];
    loadPlants(allPlants);
  } catch (err) {
    console.error('Error fetching plants:', err);
    container.innerHTML = '<p class="text-red-500">Failed to load plants.</p>';
  }
}

// Filter by category
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    
    // Highlight active button
    categoryButtons.forEach(btn => btn.classList.remove('bg-green-700', 'text-white'));
    button.classList.add('bg-green-700', 'text-white');

    // Filter plants
    if (category === 'All trees') {
      loadPlants(allPlants);
    } else {
      const filtered = allPlants.filter(p => p.category === category);
      loadPlants(filtered);
    }
  });
});

// Cart functionality
function addToCart(plant) {
  cart.push(plant);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price || 0;
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center';
    li.innerHTML = `
      <span>${item.name}</span>
      <button class="text-red-500 remove" data-index="${index}">x</button>
    `;
    cartItems.appendChild(li);
  });

  // Remove item from cart
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      cart.splice(idx, 1);
      renderCart();
    });
  });

  cartTotal.textContent = `Total: ৳${total}`;
}

// Initialize
fetchPlants();
