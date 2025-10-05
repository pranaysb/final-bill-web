document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const submitBtn = document.getElementById('submit-btn');
    const manageAddressBtn = document.getElementById('manage-address-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addressModal = document.getElementById('address-modal');
    const saveAddressBtn = document.getElementById('save-address-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const addressListDiv = document.getElementById('address-list');

    // Form Inputs
    const billnoInput = document.getElementById('billno');
    const buyerInput = document.getElementById('buyer');
    const dateInput = document.getElementById('date');
    const vehicleInput = document.getElementById('vehicle');
    const quantityInput = document.getElementById('quantity');
    const amountInput = document.getElementById('amount');

    // Address Modal Inputs
    const addressIdInput = document.getElementById('address-id');
    const newAddressNameInput = document.getElementById('new-address-name');
    const newAddressTextInput = document.getElementById('new-address-text');
    const newAddressGstInput = document.getElementById('new-address-gst');

    // --- Address Management ---

    const fetchAddresses = async () => {
        try {
            const response = await fetch('/api/addresses');
            if (!response.ok) throw new Error('Network response was not ok');
            const addresses = await response.json();
            renderAddressList(addresses);
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
            addressListDiv.innerHTML = `<p class="text-red-500">Could not load addresses. Please check your connection.</p>`;
        }
    };

    const renderAddressList = (addresses) => {
        addressListDiv.innerHTML = '';
        if (addresses.length === 0) {
            addressListDiv.innerHTML = `<p class="text-slate-500">No saved addresses.</p>`;
            return;
        }
        addresses.forEach(addr => {
            const addressDiv = document.createElement('div');
            addressDiv.className = 'p-2 border rounded-md flex justify-between items-center';
            addressDiv.innerHTML = `
                <div>
                    <p class="font-semibold">${addr.name}</p>
                    <p class="text-sm text-slate-600">${addr.address_text.split('\n')[0]}</p>
                </div>
                <div class="space-x-2">
                    <button class="select-btn text-blue-600 hover:text-blue-800 text-sm" data-address="${addr.address_text}">Select</button>
                    <button class="delete-btn text-red-600 hover:text-red-800 text-sm" data-id="${addr.id}">Delete</button>
                </div>
            `;
            addressListDiv.appendChild(addressDiv);
        });
    };

    const saveAddress = async () => {
        const addressData = {
            name: newAddressNameInput.value.trim(),
            address_text: newAddressTextInput.value.trim(),
            gst_number: newAddressGstInput.value.trim()
        };

        if (!addressData.name || !addressData.address_text) {
            alert('Please enter a name and address.');
            return;
        }

        try {
            const response = await fetch('/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData),
            });
            if (!response.ok) throw new Error('Failed to save address');
            clearAddressForm();
            fetchAddresses();
        } catch (error) {
            console.error("Error saving address:", error);
            alert('Could not save address. Please try again.');
        }
    };

    const deleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const response = await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete address');
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
            alert('Could not delete address. Please try again.');
        }
    };

    const clearAddressForm = () => {
        addressIdInput.value = '';
        newAddressNameInput.value = '';
        newAddressTextInput.value = '';
        newAddressGstInput.value = '';
    };

    // --- Modal Controls ---
    manageAddressBtn.addEventListener('click', () => {
        addressModal.classList.remove('hidden');
        addressModal.classList.add('flex');
        fetchAddresses();
    });

    closeModalBtn.addEventListener('click', () => {
        addressModal.classList.add('hidden');
        addressModal.classList.remove('flex');
    });

    // --- Event Delegation for Address List ---
    addressListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-btn')) {
            buyerInput.value = e.target.dataset.address;
            addressModal.classList.add('hidden');
            addressModal.classList.remove('flex');
        }
        if (e.target.classList.contains('delete-btn')) {
            deleteAddress(e.target.dataset.id);
        }
    });

    saveAddressBtn.addEventListener('click', saveAddress);
    clearFormBtn.addEventListener('click', clearAddressForm);

    // --- Main Form Submission ---
    const storeData = async () => {
        // 1. Get and validate form data
        const billno = billnoInput.value;
        const buyer = buyerInput.value;
        const date = dateInput.value;
        const vehicle = vehicleInput.value;
        const quantity = parseInt(quantityInput.value);
        const amount = parseFloat(amountInput.value);

        if (!date || !billno || !buyer) {
            alert("Please fill in Invoice No, Buyer Address, and a valid date.");
            return;
        }
        if (isNaN(quantity) || isNaN(amount) || quantity <= 0 || amount <= 0) {
            alert("Please enter valid positive values for Quantity and Amount.");
            return;
        }

        // 2. Perform calculations
        const rate = (amount / quantity);
        const taxless = amount / 1.28;
        const taxAmount = taxless * 0.14; // This is CGST or SGST

        // 3. Prepare data payload
        const invoiceData = {
            invoice_no: billno,
            buyer_address: buyer,
            invoice_date: date,
            vehicle_no: vehicle,
            quantity: quantity,
            total_amount: amount,
            rate: rate,
            taxable_value: taxless,
            cgst_amount: taxAmount,
            sgst_amount: taxAmount,
        };

        // 4. API First Approach
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData)
            });
            if (!response.ok) throw new Error('API submission failed');

            const result = await response.json();
            // Redirect to bill page with the new invoice ID from DB
            window.location.href = `bill.html?id=${result.id}`;

        } catch (error) {
            console.warn("API submission failed, falling back to localStorage.", error);
            // 5. Fallback to localStorage
            const buyerForLocalStorage = buyer.replace(/\n/g, "<br>");
            localStorage.setItem('billno', billno);
            localStorage.setItem('buyer', buyerForLocalStorage);
            localStorage.setItem('date', date);
            localStorage.setItem('vehicle', vehicle);
            localStorage.setItem('quantity', quantity);
            localStorage.setItem('amount', amount.toFixed(2));
            localStorage.setItem('rate', rate.toFixed(2));
            localStorage.setItem('taxless', taxless.toFixed(2));
            localStorage.setItem('taxAmount', taxAmount.toFixed(2));

            // Redirect to bill page without an ID
            window.location.href = 'bill.html';
        }
    };

    submitBtn.addEventListener('click', storeData);
});