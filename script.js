// Color themes
const themes = {
    olive: { bg: '#4a4230', img: 'pic1.png' },
    black: { bg: '#1a1a1a', img: 'pic2.png' },
    navy: { bg: '#2c4a52', img: 'pic3.png' },
    brown: { bg: '#6b3410', img: 'pic4.png' },
    burgundy: { bg: '#8b0000', img: 'pic5.png' },
    forest: { bg: '#2f4f4f', img: 'pic6.png' }
};

// State
let isLoggedIn = false;
let currentUser = null;
let cart = [];
let selectedSize = 'S';

// Price according to size
const sizePrices = {
    'S': 5500,
    'M': 6000,
    'L': 6500
};

// Color switching
document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', function() {
        const color = this.dataset.color;
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        this.classList.add('active');
        
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (color === 'olive') {
            addToCartBtn.style.background = 'white';
            addToCartBtn.style.color = '#4a4230';
        } else if (color === 'brown') {
            addToCartBtn.style.background = 'white';
            addToCartBtn.style.color = 'brown';
        } else if (color === 'burgundy') {
            addToCartBtn.style.background = 'white';
            addToCartBtn.style.color = 'burgundy';
        } else if (color === 'navy') {
            addToCartBtn.style.background = 'white';
            addToCartBtn.style.color = '#2c4a52';
        } else if (color === 'forest') {
            addToCartBtn.style.background = 'white';
            addToCartBtn.style.color = '#2f4f4f';
        } else {
            addToCartBtn.style.background = 'white';
            addToCartBtn.style.color = 'black';
        }

        document.body.style.background = themes[color].bg;
        document.getElementById('productImage').src = themes[color].img;
    });
});

// Size selection with price update
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedSize = this.dataset.size;
        
        // Update price according to size
        const price = sizePrices[selectedSize];
        document.getElementById('productPrice').textContent = `Rs ${price.toLocaleString()}`;
    });
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        
        if (page) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            document.getElementById(page + 'Page').classList.add('active');
        }
    });
});

// Modals
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const cartModal = document.getElementById('cartModal');

document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    if (isLoggedIn) {
        if (confirm('Are you sure you want to logout?')) {
            isLoggedIn = false;
            currentUser = null;
            this.textContent = 'Login';
            showNotification('Logged out successfully!');
        }
    } else {
        loginModal.style.display = 'flex';
    }
});

document.getElementById('closeLogin').addEventListener('click', () => {
    loginModal.style.display = 'none';
});

document.getElementById('closeSignup').addEventListener('click', () => {
    signupModal.style.display = 'none';
});

document.getElementById('closeCart').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

document.getElementById('switchToSignup').addEventListener('click', () => {
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
});

document.getElementById('switchToLogin').addEventListener('click', () => {
    signupModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Forms
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    isLoggedIn = true;
    currentUser = this.querySelector('input[type="email"]').value;
    document.getElementById('loginBtn').textContent = 'Logout';
    loginModal.style.display = 'none';
    showNotification('Login successful!');
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    isLoggedIn = true;
    currentUser = this.querySelector('input[type="email"]').value;
    document.getElementById('loginBtn').textContent = 'Logout';
    signupModal.style.display = 'none';
    showNotification('Account created successfully!');
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Message sent successfully!');
    this.reset();
});

// Add to cart
document.getElementById('addToCartBtn').addEventListener('click', () => {
    const activeColor = document.querySelector('.color-dot.active').dataset.color;
    const currentPrice = sizePrices[selectedSize];
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.color === activeColor && item.size === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: 'WeariT Jacket',
            color: activeColor,
            size: selectedSize,
            price: currentPrice,
            quantity: 1
        });
    }
    
    showNotification('Added to cart!');
    updateCart();
});

// Cart
document.getElementById('cartBtn').addEventListener('click', () => {
    updateCart();
    cartModal.style.display = 'flex';
});

// Quantity control functions - Define globally
window.increaseQuantity = function(index) {
    cart[index].quantity += 1;
    updateCart();
}

window.decreaseQuantity = function(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCart();
    } else {
        removeItem(index);
    }
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCart();
    showNotification('Item removed from cart');
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSummary = document.getElementById('cartSummary');
    const subtotal = document.getElementById('subtotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <p style="font-size: 14px; margin-top: 10px; color: #bbb;">Add some items to get started!</p>
            </div>
        `;
        cartTotal.textContent = 'Total: Rs 0';
        cartSummary.style.display = 'none';
    } else {
        let html = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <strong>${item.name}</strong>
                        <small>Color: ${item.color} | Size: ${item.size}</small>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                        </div>
                        <div class="cart-item-price">Rs ${itemTotal.toLocaleString()}</div>
                        <button class="remove-item-btn" onclick="removeItem(${index})" title="Remove item">✕</button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        subtotal.textContent = `Rs ${total.toLocaleString()}`;
        cartTotal.textContent = `Total: Rs ${total.toLocaleString()}`;
        cartSummary.style.display = 'block';
    }
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!isLoggedIn) {
        cartModal.style.display = 'none';
        loginModal.style.display = 'flex';
        showNotification('Please login to checkout');
    } else if (cart.length === 0) {
        showNotification('Your cart is empty');
    } else {
        showNotification('Order placed successfully!');
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
    }
});

// Favorite - Updated with custom message
document.getElementById('favoriteBtn').addEventListener('click', () => {
    showNotification('Thank you for like this product ❤️');
});

// Share - Working clipboard functionality
document.getElementById('shareBtn').addEventListener('click', async () => {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Link copied to clipboard!');
        } catch (err) {
            showNotification('Failed to copy link');
        }
        document.body.removeChild(textArea);
    }
});

// Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize
document.body.style.background = themes.olive.bg;