// --- Data Population and Rendering ---
const populateBillData = (data) => {
    // Helper to set text content
    const setText = (id, value) => { document.getElementById(id).textContent = value; };
    const setHtml = (id, value) => { document.getElementById(id).innerHTML = value; };

    // Unpack data
    const {
        billno, buyer, date, vehicle, quantity, amount, rate, taxless, taxAmount
    } = data;
    const totalTax = parseFloat(taxAmount) * 2;

    // Populate fields
    setText('billno', billno);
    setHtml('buyer', buyer); // Use innerHTML for <br> tags
    setText('date', date);
    setText('vehicle', vehicle);

    setText('quantity', quantity);
    setText('quantity2', quantity);

    setText('amount', parseFloat(amount).toFixed(2));
    setText('rate', parseFloat(rate).toFixed(2));
    setText('taxless', parseFloat(taxless).toFixed(2));
    setText('taxless2', parseFloat(taxless).toFixed(2));
    setText('taxless3', parseFloat(taxless).toFixed(2));

    setText('taxAmount', parseFloat(taxAmount).toFixed(2));
    setText('taxAmount2', parseFloat(taxAmount).toFixed(2));
    setText('taxAmount3', parseFloat(taxAmount).toFixed(2));
    setText('taxAmount4', parseFloat(taxAmount).toFixed(2));
    setText('taxAmount5', parseFloat(taxAmount).toFixed(2));
    setText('taxAmount6', parseFloat(taxAmount).toFixed(2));

    setText('totalTax1', totalTax.toFixed(2));
    setText('totalTax2', totalTax.toFixed(2));

    // Convert numbers to words
    setText('totalAmountWords', convertAmountToWords(amount));
    setText('totalTaxWords', convertAmountToWords(totalTax));
};


// --- Number to Words Conversion Utility ---
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    function convert(n) {
        if (n < 20) return ones[n];
        let word = tens[Math.floor(n / 10)];
        if (n % 10 > 0) word += ' ' + ones[n % 10];
        return word;
    }

    let word = '';
    let tempNum = num;
    if (tempNum === 0) return 'Zero';

    const handleCrores = Math.floor(tempNum / 10000000);
    if (handleCrores > 0) {
        word += convert(handleCrores) + ' Crore ';
        tempNum %= 10000000;
    }

    const handleLakhs = Math.floor(tempNum / 100000);
    if (handleLakhs > 0) {
        word += convert(handleLakhs) + ' Lakh ';
        tempNum %= 100000;
    }

    const handleThousands = Math.floor(tempNum / 1000);
    if (handleThousands > 0) {
        word += convert(handleThousands) + ' Thousand ';
        tempNum %= 1000;
    }

    const handleHundreds = Math.floor(tempNum / 100);
    if (handleHundreds > 0) {
        word += convert(handleHundreds) + ' Hundred ';
        tempNum %= 100;
    }

    if (tempNum > 0) {
        word += convert(tempNum);
    }

    return word.trim();
}

function convertAmountToWords(amount) {
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let words = numberToWords(rupees) + ' Rupees';
    if (paise > 0) {
        words += ' and ' + numberToWords(paise) + ' Paise';
    }
    return words + ' only.';
}

// --- PDF Download Functionality ---
document.getElementById('download-pdf').addEventListener('click', function () {
    const element = document.getElementById('invoice-content');
    const opt = {
        margin: [5, 5, 5, 5],
        filename: `Invoice-${document.getElementById('billno').textContent || 'INV'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});


// --- On Page Load Logic ---
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');

    // API First Approach
    if (invoiceId) {
        try {
            const response = await fetch(`/api/invoices?id=${invoiceId}`);
            if (!response.ok) throw new Error('Invoice not found or server error');
            const data = await response.json();

            const billData = {
                billno: data.invoice_no,
                buyer: data.buyer_address.replace(/\n/g, "<br>"),
                date: new Date(data.invoice_date).toLocaleDateString('en-CA'), // YYYY-MM-DD
                vehicle: data.vehicle_no,
                quantity: data.quantity,
                amount: data.total_amount,
                rate: data.rate,
                taxless: data.taxable_value,
                taxAmount: data.cgst_amount, // Assuming cgst equals sgst
            };
            populateBillData(billData);
            return;

        } catch (error) {
            console.error("Failed to fetch from API, falling back to localStorage.", error);
            document.body.insertAdjacentHTML('afterbegin', '<div class="bg-red-500 text-white text-center p-2 print:hidden">Could not load from database. Showing fallback data.</div>');
        }
    }

    // Fallback to localStorage
    try {
        const billData = {
            billno: localStorage.getItem('billno'),
            buyer: localStorage.getItem('buyer'),
            date: localStorage.getItem('date'),
            vehicle: localStorage.getItem('vehicle'),
            quantity: localStorage.getItem('quantity'),
            amount: localStorage.getItem('amount'),
            rate: localStorage.getItem('rate'),
            taxless: localStorage.getItem('taxless'),
            taxAmount: localStorage.getItem('taxAmount')
        };
        // Check if essential data exists
        if (!billData.billno || !billData.amount) {
            throw new Error('No data available in localStorage.');
        }
        populateBillData(billData);
    } catch (error) {
        console.error("No data available to display.", error);
        document.querySelector('.main').innerHTML = `<h1 class="text-center text-2xl font-bold">No Invoice Data Found</h1><p class="text-center mt-4">Please <a href="bill-maker.html" class="text-blue-600">create a new bill</a>.</p>`;
    }
};