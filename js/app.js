// Core app logic for Ale Brokering

function initApp() {
  updateAuthUI();
  setupMobileMenu();
  setupUserMenu();
}

function updateAuthUI() {
  const user = getCurrentUser();
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  const adminLink = document.getElementById('adminLink');

  if (user) {
    if (authButtons) authButtons.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (userName) userName.textContent = user.name.split(' ')[0];
    if (adminLink && user.role === 'admin') adminLink.classList.remove('hidden');
  } else {
    if (authButtons) authButtons.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
  }
}

function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('hidden'));
  }
}

function setupUserMenu() {
  const btn = document.getElementById('userBtn');
  const dropdown = document.getElementById('userDropdown');
  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => dropdown.classList.add('hidden'));
  }
}

function logout() {
  setCurrentUser(null);
  window.location.href = 'index.html';
}

function updateStats() {
  const listings = getListings().filter(l => l.status === 'approved');
  const wanted = getWanted();
  const projects = getProjects();
  const experts = getExperts();

  const el1 = document.getElementById('statListings');
  const el2 = document.getElementById('statWanted');
  const el3 = document.getElementById('statProjects');
  const el4 = document.getElementById('statExperts');

  if (el1) el1.textContent = listings.length;
  if (el2) el2.textContent = wanted.length;
  if (el3) el3.textContent = projects.length;
  if (el4) el4.textContent = experts.length;
}

function renderFeaturedListings() {
  const container = document.getElementById('featuredListings');
  if (!container) return;

  const listings = getListings().filter(l => l.status === 'approved').slice(0, 6);
  container.innerHTML = listings.map(listing => createPropertyCard(listing)).join('');
}

function createPropertyCard(listing) {
  const purposeBadge = listing.purpose === 'sale'
    ? `<span class="badge-sale text-white text-xs font-semibold px-2.5 py-1 rounded-full">${t('for_sale')}</span>`
    : `<span class="badge-rent text-white text-xs font-semibold px-2.5 py-1 rounded-full">${t('for_rent')}</span>`;

  const details = [];
  if (listing.bedrooms > 0) details.push(`<span><i class="fas fa-bed mr-1"></i>${listing.bedrooms} ${t('beds')}</span>`);
  if (listing.bathrooms > 0) details.push(`<span><i class="fas fa-bath mr-1"></i>${listing.bathrooms} ${t('baths')}</span>`);
  if (listing.area > 0) details.push(`<span><i class="fas fa-ruler-combined mr-1"></i>${listing.area} ${t('sqm')}</span>`);

  return `
    <div class="property-card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      <div class="relative">
        <img src="${listing.image}" alt="${listing.title}" class="w-full h-48 object-cover" loading="lazy"
             onerror="this.src='https://via.placeholder.com/600x400/0A2540/ffffff?text=Property'">
        <div class="absolute top-3 left-3">${purposeBadge}</div>
        <div class="absolute top-3 right-3 bg-white/90 text-primary-600 text-xs font-medium px-2 py-1 rounded-full">
          ${getTypeLabel(listing.type)}
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">${listing.title}</h3>
        <p class="text-sm text-gray-500 mb-2"><i class="fas fa-map-marker-alt mr-1 text-primary-600"></i>${listing.location}</p>
        <div class="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
          ${details.join('')}
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="text-primary-600 font-bold text-lg">${formatPrice(listing.price)}${listing.purpose === 'rent' ? '<span class="text-xs font-normal text-gray-500">/mo</span>' : ''}</div>
          <a href="property-detail.html?id=${listing.id}" class="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg transition">
            ${t('view')}
          </a>
        </div>
      </div>
    </div>
  `;
}

function performSearch() {
  const type = document.getElementById('searchType')?.value || '';
  const purpose = document.getElementById('searchPurpose')?.value || '';
  const location = document.getElementById('searchLocation')?.value || '';
  const minPrice = document.getElementById('searchMinPrice')?.value || '';
  const maxPrice = document.getElementById('searchMaxPrice')?.value || '';

  // Save recent search
  saveRecentSearch({ type, purpose, location, minPrice, maxPrice, time: new Date().toISOString() });

  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (purpose) params.set('purpose', purpose);
  if (location) params.set('location', location);
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);
  window.location.href = 'properties.html?' + params.toString();
}

// Recent Searches
function getRecentSearches() {
  const data = localStorage.getItem('ale_recent_searches');
  return data ? JSON.parse(data) : [];
}

function saveRecentSearch(search) {
  let searches = getRecentSearches();
  // Avoid exact duplicates
  searches = searches.filter(s => !(s.type === search.type && s.purpose === search.purpose && s.location === search.location && s.minPrice === search.minPrice && s.maxPrice === search.maxPrice));
  searches.unshift(search);
  searches = searches.slice(0, 8); // keep last 8
  localStorage.setItem('ale_recent_searches', JSON.stringify(searches));
}

function renderRecentSearches() {
  const container = document.getElementById('recentSearches');
  if (!container) return;
  const searches = getRecentSearches();
  if (searches.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400">No recent searches yet</p>';
    return;
  }
  container.innerHTML = searches.map(s => {
    const parts = [];
    if (s.type) parts.push(getTypeLabel(s.type));
    if (s.purpose) parts.push(s.purpose === 'sale' ? 'For Sale' : 'For Rent');
    if (s.location) parts.push(s.location);
    if (s.minPrice || s.maxPrice) {
      const priceStr = (s.minPrice ? formatPrice(parseInt(s.minPrice)) : 'Any') + ' - ' + (s.maxPrice ? formatPrice(parseInt(s.maxPrice)) : 'Any');
      parts.push(priceStr);
    }
    const label = parts.join(' • ') || 'All properties';
    const params = new URLSearchParams();
    if (s.type) params.set('type', s.type);
    if (s.purpose) params.set('purpose', s.purpose);
    if (s.location) params.set('location', s.location);
    if (s.minPrice) params.set('minPrice', s.minPrice);
    if (s.maxPrice) params.set('maxPrice', s.maxPrice);
    return `<a href="properties.html?${params.toString()}" class="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-400 hover:bg-primary-50 text-sm px-3 py-1.5 rounded-full transition">
      <i class="fas fa-history text-gray-400 text-xs"></i> ${label}
    </a>`;
  }).join('');
}

// AI Market Analysis (simulated intelligent insights based on real data)
function generateMarketAnalysis() {
  const listings = getListings().filter(l => l.status === 'approved');
  if (listings.length === 0) return null;

  const saleListings = listings.filter(l => l.purpose === 'sale');
  const rentListings = listings.filter(l => l.purpose === 'rent');

  const avgSale = saleListings.length ? Math.round(saleListings.reduce((a, b) => a + b.price, 0) / saleListings.length) : 0;
  const avgRent = rentListings.length ? Math.round(rentListings.reduce((a, b) => a + b.price, 0) / rentListings.length) : 0;

  // Price by type
  const byType = {};
  listings.forEach(l => {
    if (!byType[l.type]) byType[l.type] = { count: 0, total: 0 };
    byType[l.type].count++;
    byType[l.type].total += l.price;
  });

  // Location hotspots
  const byLocation = {};
  listings.forEach(l => {
    const loc = l.location.split(',')[0].trim();
    byLocation[loc] = (byLocation[loc] || 0) + 1;
  });
  const topLocations = Object.entries(byLocation).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Insights
  const insights = [];
  if (saleListings.length > rentListings.length) {
    insights.push('More properties are listed for sale than rent — sellers are active in the market.');
  } else {
    insights.push('Rental demand appears strong with more rent listings currently available.');
  }

  if (avgSale > 0) {
    insights.push(`Average sale price across active listings is approximately ${formatPrice(avgSale)}.`);
  }
  if (avgRent > 0) {
    insights.push(`Average monthly rent is around ${formatPrice(avgRent)}.`);
  }

  if (topLocations.length > 0) {
    insights.push(`Hottest areas right now: ${topLocations.map(([loc, c]) => `${loc} (${c})`).join(', ')}.`);
  }

  // Trend simulation
  const villaCount = listings.filter(l => l.type === 'villa').length;
  const landCount = listings.filter(l => l.type === 'land').length;
  if (villaCount >= 2) insights.push('Villas remain popular among high-value buyers.');
  if (landCount >= 1) insights.push('Land listings indicate ongoing interest in development opportunities.');

  return {
    totalListings: listings.length,
    saleCount: saleListings.length,
    rentCount: rentListings.length,
    avgSale,
    avgRent,
    topLocations,
    insights,
    byType
  };
}

function renderMarketAnalysis() {
  const container = document.getElementById('marketAnalysis');
  if (!container) return;

  const analysis = generateMarketAnalysis();
  if (!analysis) {
    container.innerHTML = '<p class="text-gray-500">Not enough data for market analysis yet.</p>';
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 border text-center">
        <div class="text-2xl font-bold text-primary-600">${analysis.totalListings}</div>
        <div class="text-xs text-gray-500">Active Listings</div>
      </div>
      <div class="bg-white rounded-xl p-4 border text-center">
        <div class="text-2xl font-bold text-blue-600">${analysis.saleCount}</div>
        <div class="text-xs text-gray-500">For Sale</div>
      </div>
      <div class="bg-white rounded-xl p-4 border text-center">
        <div class="text-2xl font-bold text-green-600">${analysis.rentCount}</div>
        <div class="text-xs text-gray-500">For Rent</div>
      </div>
      <div class="bg-white rounded-xl p-4 border text-center">
        <div class="text-lg font-bold text-primary-600">${analysis.avgSale ? formatPrice(analysis.avgSale).replace(' ETB','') : '—'}</div>
        <div class="text-xs text-gray-500">Avg Sale Price</div>
      </div>
    </div>
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-5 text-white">
      <div class="flex items-center gap-2 mb-3">
        <i class="fas fa-robot text-xl"></i>
        <h3 class="font-bold text-lg">AI Market Insights</h3>
      </div>
      <ul class="space-y-2 text-sm text-blue-100">
        ${analysis.insights.map(i => `<li class="flex gap-2"><i class="fas fa-check-circle mt-0.5 text-green-300"></i><span>${i}</span></li>`).join('')}
      </ul>
      <p class="text-xs text-blue-300 mt-4">Analysis generated from current platform data • Updated in real-time</p>
    </div>
  `;
}

// Auth functions
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone });
    alert('Login successful!');
    window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
  } else {
    alert('Invalid email or password');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    alert('Email already registered');
    return;
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name,
    email,
    phone,
    password,
    role: 'user'
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: 'user', phone: newUser.phone });
  alert('Registration successful!');
  window.location.href = 'dashboard.html';
}

function handlePostListing(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    alert('You must register and login before posting a listing.');
    window.location.href = 'register.html';
    return;
  }

  // All user listings require admin approval. Only admin posts go live immediately.
  const listing = {
    id: Date.now(),
    title: document.getElementById('postTitle').value.trim(),
    type: document.getElementById('postType').value,
    purpose: document.getElementById('postPurpose').value,
    price: parseInt(document.getElementById('postPrice').value) || 0,
    location: document.getElementById('postLocation').value.trim(),
    bedrooms: parseInt(document.getElementById('postBedrooms').value) || 0,
    bathrooms: parseInt(document.getElementById('postBathrooms').value) || 0,
    area: parseInt(document.getElementById('postArea').value) || 0,
    description: document.getElementById('postDescription').value.trim(),
    image: document.getElementById('postImage').value.trim() || 'https://via.placeholder.com/600x400/0A2540/ffffff?text=Property',
    status: user.role === 'admin' ? 'approved' : 'pending',
    userId: user.id,
    userName: user.name,
    phone: user.phone || '',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const listings = getListings();
  listings.unshift(listing);
  saveListings(listings);

  if (user.role === 'admin') {
    alert('Listing published successfully!');
  } else {
    alert('Your listing has been submitted and is waiting for admin approval. It will appear on the website after approval.');
  }
  window.location.href = 'dashboard.html';
}

function handlePostWanted(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  const wanted = {
    id: Date.now(),
    title: document.getElementById('wantedTitle').value.trim(),
    purpose: document.getElementById('wantedPurpose').value,
    type: document.getElementById('wantedType').value,
    maxPrice: parseInt(document.getElementById('wantedPrice').value) || 0,
    location: document.getElementById('wantedLocation').value.trim(),
    bedrooms: parseInt(document.getElementById('wantedBedrooms').value) || 0,
    description: document.getElementById('wantedDescription').value.trim(),
    userId: user.id,
    userName: user.name,
    phone: user.phone || '',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const list = getWanted();
  list.unshift(wanted);
  saveWanted(list);
  alert('Wanted request posted!');
  window.location.href = 'wanted.html';
}
