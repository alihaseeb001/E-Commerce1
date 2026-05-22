const products = [
    { id: 1, name: 'Lawn Frock', price: 4500, category: 'Clothing', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/lawn%20firok.png' },
    { id: 2, name: 'Silk Maxi', price: 12500, category: 'Clothing', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Silk%20Maxi.png' },
    { id: 3, name: 'Shalwar Kameez', price: 5500, category: 'Clothing', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Shalwar%20Kameez.png' },
    { id: 4, name: 'Anarkali Suit', price: 8900, category: 'Clothing', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Anarkali%20Suit.png' },
    { id: 5, name: 'Leather Khussa', price: 2800, category: 'Footwear', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Leather%20Khussa.png' },
    { id: 6, name: 'Kolhapuri Flat', price: 1900, category: 'Footwear', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Flat%20Wedding%20shoes.png' },
    { id: 7, name: 'Oud Perfume', price: 4200, category: 'Perfumes', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Oud%20perfume.png' },
    { id: 8, name: 'Rose Scent', price: 6500, category: 'Perfumes', img: 'file:///C:/Users/User/OneDrive/Desktop/New%20folder/Rose%20Scent.png' }
];

let cart = [];
let currentFilter = 'All';

function navigateTo(viewId) {
    document.querySelectorAll('.page-view').forEach(view => view.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    document.querySelectorAll('header nav button').forEach(btn => {
        btn.classList.remove('text-orange-600', 'border-b-2', 'border-orange-500');
        btn.classList.add('hover:text-orange-500');
    });
    const targetNav = document.getElementById(`nav-${viewId}`);
    if (targetNav) {
        targetNav.classList.add('text-orange-600', 'border-b-2', 'border-orange-500');
        targetNav.classList.remove('hover:text-orange-500');
    }
    window.scrollTo({ top: 0 });
}

function filterCategory(categoryName) {
    currentFilter = categoryName;
    navigateTo('shop');
    document.getElementById('active-tag').innerText = categoryName === 'All' ? 'All Items' : categoryName;
    renderCatalog();
}

function renderCatalog() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    const filtered = currentFilter === 'All' ? products : products.filter(p => p.category === currentFilter);
    grid.innerHTML = filtered.map(product => `
        <div class="depth-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-orange-50 flex flex-col group relative">
            <span class="absolute top-3 left-3 z-10 bg-white/90 text-orange-600 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs">
                ${product.category}
            </span>
            <div onclick="openLightbox('${product.img}', '${product.name}')" class="bg-gradient-to-b from-orange-400 via-orange-500 to-amber-500 h-52 p-4 flex items-center justify-center overflow-hidden cursor-zoom-in relative">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-center justify-center text-white/0 group-hover:text-white/60 z-10">
                    <i class="fa-solid fa-magnifying-glass-plus text-2xl"></i>
                </div>
                <img src="${product.img}" class="w-full h-full object-cover rounded-xl shadow-md mix-blend-normal group-hover:scale-105 transition duration-300 relative z-0" alt="${product.name}" />
            </div>
            <div class="p-5 flex flex-col flex-grow bg-white">
                <h3 class="font-bold text-slate-900 mb-2 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">${product.name}</h3>
                <div class="mt-auto pt-2 flex items-center justify-between">
                    <span class="text-base font-black text-slate-900">Rs. ${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="depth-btn bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-1">
                        <i class="fa-solid fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openLightbox(imgSrc, productName) {
    document.getElementById('lightbox-target-img').src = imgSrc;
    document.getElementById('lightbox-caption').innerText = productName;
    document.getElementById('image-lightbox').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('image-lightbox').classList.add('hidden');
    document.getElementById('lightbox-target-img').src = '';
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('hidden');
}

function addToCart(productId) {
    const matchedProduct = products.find(p => p.id === productId);
    const existingRecord = cart.find(item => item.id === productId);
    if (existingRecord) { existingRecord.quantity += 1; } 
    else { cart.push({ ...matchedProduct, quantity: 1 }); }
    showToast("Added to cart successfully!");
    refreshBasketDOMState();
}

function adjustQuantity(productId, modifierValue) {
    const targetRecord = cart.find(item => item.id === productId);
    if (!targetRecord) return;
    targetRecord.quantity += modifierValue;
    if (targetRecord.quantity <= 0) { cart = cart.filter(item => item.id !== productId); }
    refreshBasketDOMState();
}

function refreshBasketDOMState() {
    const countBadge = document.getElementById('cart-count');
    const itemsListFrame = document.getElementById('cart-items-container');
    const totalCashCounter = document.getElementById('cart-subtotal');
    const totalQuantityCount = cart.reduce((accum, row) => accum + row.quantity, 0);
    countBadge.innerText = totalQuantityCount;

    if (cart.length === 0) {
        itemsListFrame.innerHTML = `
            <div class="text-center py-16 text-gray-400">
                <i class="fa-solid fa-basket-shopping text-5xl mb-4 text-orange-200"></i>
                <p class="font-medium">Your shopping tray is empty.</p>
            </div>`;
    } else {
        itemsListFrame.innerHTML = cart.map(row => `
            <div class="flex items-center gap-4 bg-amber-50/40 p-3 rounded-xl border border-orange-100/50">
                <img src="${row.img}" class="w-14 h-14 object-cover rounded-lg border border-orange-100 flex-shrink-0 shadow-xs" alt="${row.name}" />
                <div class="flex-grow min-w-0">
                    <h4 class="font-bold text-xs text-slate-900 truncate">${row.name}</h4>
                    <p class="text-xs font-black text-orange-600 mt-0.5">Rs. ${row.price * row.quantity}</p>
                </div>
                <div class="flex items-center border border-orange-200 rounded-lg overflow-hidden bg-white shadow-xs">
                    <button onclick="adjustQuantity(${row.id}, -1)" class="px-2.5 py-1 text-gray-500 hover:bg-orange-50 transition"><i class="fa-solid fa-minus text-[10px]"></i></button>
                    <span class="px-2 text-xs font-bold text-slate-800">${row.quantity}</span>
                    <button onclick="adjustQuantity(${row.id}, 1)" class="px-2.5 py-1 text-gray-500 hover:bg-orange-50 transition"><i class="fa-solid fa-plus text-[10px]"></i></button>
                </div>
            </div>`).join('');
        }
    const subtotalValuation = cart.reduce((accum, row) => accum + (row.price * row.quantity), 0);
    totalCashCounter.innerText = `Rs. ${subtotalValuation}`;
}

function openCheckoutModal() {
    if (cart.length === 0) { return; }
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() { document.getElementById('checkout-modal').classList.add('hidden'); }

function showToast(messageText) {
    const toast = document.getElementById('toast-notification');
    document.getElementById('toast-main-msg').innerText = messageText;
    toast.classList.add('show-toast');
    setTimeout(() => {
        toast.classList.remove('show-toast');
    }, 3000);
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    cart = [];
    refreshBasketDOMState();
    closeCheckoutModal();
    toggleCart();
    event.target.reset();
    showToast("Your order has been confirmed successfully!");
}

function handleContactSubmit(event) {
    event.preventDefault();
    event.target.reset();
    showToast("Message sent successfully!");
}

window.onload = function() {
    renderCatalog();
    refreshBasketDOMState();
};