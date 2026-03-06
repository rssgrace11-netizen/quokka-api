// pricing.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('billing-toggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');
    const prices = document.querySelectorAll('.price');
    const periods = document.querySelectorAll('.billing-period');

    let isYearly = false;

    // Toggle Logic
    toggleBtn.addEventListener('click', () => {
        isYearly = !isYearly;
        
        if(isYearly) {
            toggleBtn.classList.add('active');
            labelYearly.classList.add('active');
            labelMonthly.classList.remove('active');
        } else {
            toggleBtn.classList.remove('active');
            labelMonthly.classList.add('active');
            labelYearly.classList.remove('active');
        }

        // Animate price change
        prices.forEach(priceEl => {
            priceEl.style.opacity = '0';
            priceEl.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                // Update text
                const newPrice = isYearly ? priceEl.getAttribute('data-yearly') : priceEl.getAttribute('data-monthly');
                const periodText = isYearly ? ' / year' : ' / month';
                
                // Keep the span structure
                priceEl.innerHTML = `${newPrice}<span class="billing-period">${periodText}</span>`;
                
                priceEl.style.opacity = '1';
                priceEl.style.transform = 'translateY(0)';
            }, 200);
        });
    });
});

// Modal Logic (Global functions so they can be called from inline onclick handlers)
const checkoutModal = document.getElementById('checkout-modal');
const modalTierName = document.getElementById('modal-tier-name');
const modalTierDisplay = document.getElementById('modal-tier-display');
const modalPriceDisplay = document.getElementById('modal-price-display');

window.openModal = function(tierName, priceElementId) {
    const priceEl = document.getElementById(priceElementId);
    if(!priceEl || !checkoutModal) return;

    // Get current price text (removing the span part)
    const clone = priceEl.cloneNode(true);
    const spanInfo = clone.querySelector('span');
    if(spanInfo) spanInfo.remove();
    const currentPrice = clone.textContent.trim();
    
    const isYearly = document.getElementById('billing-toggle').classList.contains('active');
    const periodString = isYearly ? 'Yearly' : 'Monthly';

    modalTierName.textContent = tierName;
    modalTierDisplay.textContent = `${tierName} (${periodString})`;
    modalPriceDisplay.textContent = currentPrice;

    // Show modal
    checkoutModal.classList.add('active');
};

window.closeModal = function() {
    if(checkoutModal) {
        checkoutModal.classList.remove('active');
        // Reset form to default state
        const payBtnText = document.querySelector('.pay-text');
        const loaderIcon = document.querySelector('.loader-icon');
        const form = document.querySelector('.payment-form');
        if(payBtnText && loaderIcon && form) {
            payBtnText.textContent = 'Pay Now';
            loaderIcon.style.display = 'none';
            form.reset();
        }
    }
};

window.simulatePayment = function() {
    const payBtnText = document.querySelector('.pay-text');
    const loaderIcon = document.querySelector('.loader-icon');
    const payBtn = document.getElementById('pay-btn');

    payBtnText.textContent = 'Processing...';
    loaderIcon.style.display = 'inline-block';
    payBtn.disabled = true;
    payBtn.style.opacity = '0.7';

    // Simulate network request
    setTimeout(() => {
        payBtnText.textContent = 'Success! 🎉';
        loaderIcon.style.display = 'none';
        payBtn.style.background = '#8bc34a'; /* Match success green */
        
        setTimeout(() => {
            closeModal();
            payBtn.disabled = false;
            payBtn.style.opacity = '1';
            payBtn.style.background = '';
        }, 1500);
    }, 2000);
};

// Close modal when clicking on overlay background
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        closeModal();
    }
});
