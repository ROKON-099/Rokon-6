const PLANTS_API_URL = 'https://openapi.programming-hero.com/api/plants';
const container = document.getElementById('plants-container');
const categoryButtons = document.querySelectorAll('aside ul li button');
const cartItemsList = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
let allPlants = [];
let cart = [];

// Show plants
function loadPlants(plants) {
  container.innerHTML = ''; // Clear container
  plants.forEach(plant => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow p-4 flex flex-col items-center';

    card.innerHTML = `
      <img src="${plant.image || 'https://via.placeholder.com/150'}" alt="${plant.name}" class="w-full h-48 object-cover mb-2 rounded">
      <h3 class="font-semibold text-lg">${plant.name}</h3>
      <p class="text-xs text-gray-500 mb-3 line-clamp-3">
        ${plant.description || 'No description available'}
      </p>
      <p class="text-sm text-gray-600">${plant.category || ''}</p>
      <button class="mt-2 px-3 py-1 bg-green-600 text-white rounded add-to-cart">Add to Cart</button>
    `;

    // Add to cart button
    card.querySelector('.add-to-cart').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(plant);
    });

    // Show modal on card click (not on button click)
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-to-cart')) {
        openModal(plant);
      }
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
    setActiveButton(button);

    // Filter plants
    if (category === 'All trees') {
      loadPlants(allPlants);
    } else {
      const filtered = allPlants.filter(p => p.category === category);
      loadPlants(filtered);
    }
  });
});

// Highlight active button
function setActiveButton(activeBtn) {
  categoryButtons.forEach(btn => btn.classList.remove('bg-green-700', 'text-white'));
  activeBtn.classList.add('bg-green-700', 'text-white');
}

// Cart functionality
function addToCart(plant) {
  const existing = cart.find(item => item.name === plant.name);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...plant, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  cartItemsList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const price = parseFloat(item.price) || 0;
    total += price * (item.quantity || 1);

    const li = document.createElement('li');
    li.className = 'flex items-center rounded-sm justify-between p-2 border-b bg-[#f0fdf4] border-gray-200';

    li.innerHTML = `
      <div>
        <div class="font-semibold">${item.name}</div>
        <div class="text-gray-500 text-sm">৳${price} × ${item.quantity}</div>
      </div>
      <button class="text-red-500 ml-4" onclick="removeFromCart('${item.name}')">❌</button>
    `;

    cartItemsList.appendChild(li);
  });

  cartTotalEl.textContent = `Total: ৳${total}`;
}

window.removeFromCart = function(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

// Modal
function openModal(plant) {
  let modal = document.getElementById('plant-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'plant-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onclick="closeModal()" class="absolute top-2 right-2 text-red-500 text-lg">❌</button>
        <div id="modal-content"></div>
      </div>`;
    document.body.appendChild(modal);
  }
  const modalContent = modal.querySelector('#modal-content');
  modalContent.innerHTML = `
    <img src="${plant.image || 'https://via.placeholder.com/150'}" alt="${plant.name}" class="w-full h-60 object-cover rounded-lg mb-3">
    <h2 class="text-xl font-bold mb-2">${plant.name}</h2>
    <p class="text-gray-600 mb-2"><strong>Category:</strong> ${plant.category}</p>
    <p class="text-gray-600 mb-2"><strong>Price:</strong> ৳${plant.price || 'N/A'}</p>
    <p class="text-gray-500 mb-2">${plant.description || 'No description available'}</p>
  `;
  modal.classList.remove('hidden');
}

window.closeModal = function() {
  const modal = document.getElementById('plant-modal');
  if (modal) modal.classList.add('hidden');
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  fetchPlants();
  const defaultBtn = document.querySelector('[data-category="All trees"]');
  if (defaultBtn) setActiveButton(defaultBtn);
});



