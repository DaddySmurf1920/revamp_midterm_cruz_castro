const catalogProducts = [
    { 
        id: 'RV-001', 
        name: 'Reworked Graphic Tee', 
        subtitle: 'REWORKED DECONSTRUCTED TEE',
        taglineHeader: 'REWORKED TEE IDENTITY.',
        numericPrice: 850,
        price: '₱850', 
        category: 'Tops', 
        image: 'images/SHIRT.png',
        details: 'Reworked vintage graphic t-shirt with cut-and-sew panels',
        materials: 'Recycled cotton + blend fabrics',
        sizes: ['S', 'M', 'L']
    },
    { 
        id: 'RV-002', 
        name: 'Reworked Denim Jacket', 
        subtitle: 'REWORKED DENIM JACKET',
        taglineHeader: 'REWORKED DENIM IDENTITY.',
        numericPrice: 1850,
        price: '₱1,850', 
        category: 'Outerwear', 
        image: 'images/JACKET.png',
        details: 'Reworked vintage denim',
        materials: 'Recycled denim + fabric',
        sizes: ['S', 'M', 'L']
    },
    { 
        id: 'RV-003', 
        name: 'Patchwork Pants', 
        subtitle: 'REWORKED PATCHWORK PANTS',
        taglineHeader: 'REWORKED PANTS IDENTITY.',
        numericPrice: 1200,
        price: '₱1,200', 
        category: 'Bottoms', 
        image: 'images/PANTS.png',
        details: 'Multi-panel spliced cargo trousers',
        materials: 'Heavyweight cotton canvas + denim',
        sizes: ['S', 'M', 'L']
    },
    { 
        id: 'RV-004', 
        name: 'One-of-One Hoodie', 
        subtitle: 'REWORKED SPLIT HOODIE',
        taglineHeader: 'REWORKED HOODIE IDENTITY.',
        numericPrice: 1500,
        price: '₱1,500', 
        category: 'Outerwear', 
        image: 'images/HOODIE.png',
        details: 'Asymmetrical dual-tone custom hoodie',
        materials: 'Upcycled fleece cotton',
        sizes: ['S', 'M', 'L']
    }
];

function getCart() {
    const cartData = localStorage.getItem('revamp_cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('revamp_cart', JSON.stringify(cart));
    updateCartCountNav();
}

function updateCartCountNav() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartNavs = document.querySelectorAll('.nav-links a');
    cartNavs.forEach(nav => {
        if (nav.textContent.toLowerCase().includes('cart')) {
            nav.textContent = `Cart (${totalQty})`;
            nav.href = 'cart.html';
        }
    });
}

function addToCart(productId, selectedSize) {
    const product = catalogProducts.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.numericPrice,
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
}

function updateQuantity(productId, size, delta) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
        renderCartPage();
    }
}

function renderProducts(productsToRender, targetElementId) {
    const grid = document.getElementById(targetElementId);
    if (!grid) return;

    if (productsToRender.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-family: var(--font-heading);">No products found in this category.</p>`;
        return;
    }

    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="navigateToProduct('${product.id}')">
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3 class="card-title">${product.name}</h3>
            <div class="card-price">${product.price}</div>
        </div>
    `).join('');
}

function navigateToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function initProductPage() {
    const detailContainer = document.getElementById('productDetailContainer');
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'RV-001';

    const product = catalogProducts.find(p => p.id === productId) || catalogProducts[0];
    let selectedSize = product.sizes[0];

    detailContainer.innerHTML = `
        <div class="pdp-wrapper">
            <div class="pdp-image-card">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="pdp-info-column">
                <h1 class="pdp-hero-heading">${product.taglineHeader}</h1>
                <h2 class="pdp-subtitle">${product.subtitle}</h2>

                <div class="pdp-tag">ONE-OF-ONE</div>
                <div class="pdp-price">${product.price}</div>

                <div class="pdp-section-label">SIZE</div>
                <div class="pdp-size-options">
                    ${product.sizes.map((size, index) => `
                        <button class="pdp-size-btn ${index === 0 ? 'active' : ''}" data-size="${size}">[ ${size} ]</button>
                    `).join('')}
                </div>

                <button class="pdp-add-btn" id="addToCartBtn">[ ADD TO CART ]</button>

                <div class="pdp-meta-group">
                    <div class="pdp-meta-item">
                        <strong>REVAMP ID:</strong> ${product.id}
                    </div>
                    <div class="pdp-meta-item">
                        <strong>PRODUCT DETAILS:</strong> ${product.details}
                    </div>
                    <div class="pdp-meta-item">
                        <strong>MATERIALS:</strong><br>${product.materials}
                    </div>
                </div>

                <div class="pdp-process-box">
                    <div class="pdp-process-title">THE REVAMP PROCESS</div>
                    <div class="pdp-process-flow">Original &rarr; Reworked &rarr; Finished Piece</div>
                </div>
            </div>
        </div>
    `;

    const sizeBtns = detailContainer.querySelectorAll('.pdp-size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedSize = e.target.getAttribute('data-size');
        });
    });

    document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(product.id, selectedSize);
    });
}

function renderCartPage() {
    const cartList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummary');
    if (!cartList) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartList.innerHTML = `<div class="empty-cart-msg">Your cart is currently empty.</div>`;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (cartSummary) cartSummary.style.display = 'flex';

    let subtotal = 0;

    cartList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
                    <div class="cart-quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', '${item.size}', -1)">[ - ]</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', '${item.size}', 1)">[ + ]</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) {
        subtotalEl.textContent = `SUBTOTAL: ₱${subtotal.toLocaleString()}`;
    }
}

function initCheckoutPage() {
    const summaryList = document.getElementById('checkoutSummaryList');
    const totalEl = document.getElementById('checkoutTotal');
    const form = document.getElementById('checkoutForm');
    if (!summaryList) return;

    const cart = getCart();
    const shippingFee = 100;

    if (cart.length === 0) {
        summaryList.innerHTML = `<p style="color: #888;">Your cart is empty.</p>`;
        if (totalEl) totalEl.textContent = '₱0';
        return;
    }

    let subtotal = 0;

    summaryList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="summary-row">
                <span>${item.name} (${item.size}) ${item.quantity > 1 ? 'x' + item.quantity : ''}</span>
                <span>₱${itemTotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    const grandTotal = subtotal + shippingFee;
    if (totalEl) totalEl.textContent = `₱${grandTotal.toLocaleString()}`;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Order placed successfully! Thank you for purchasing from Revamp.');
            localStorage.removeItem('revamp_cart');
            window.location.href = 'index.html';
        });
    }
}

function initShopPage() {
    const shopGrid = document.getElementById('shopGrid');
    if (!shopGrid) return;

    renderProducts(catalogProducts, 'shopGrid');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const selectedCategory = e.target.getAttribute('data-category');
            if (selectedCategory === 'All') {
                renderProducts(catalogProducts, 'shopGrid');
            } else {
                const filtered = catalogProducts.filter(p => p.category === selectedCategory);
                renderProducts(filtered, 'shopGrid');
            }
        });
    });
}

function initHomePage() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;

    renderProducts(catalogProducts, 'featuredGrid');
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCountNav();
    initHomePage();
    initShopPage();
    initProductPage();
    renderCartPage();
    initCheckoutPage();
});