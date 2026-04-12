import { auth, db, onAuthStateChanged, signOut, ref, onValue, push, set } from './firebase.js';

let currentUser = null;

// Auth Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadUserData();
        loadServices();
    } else {
        window.location.href = 'login.html';
    }
});

// Logout Logic
document.querySelector('button:contains("Logout")')?.addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = 'login.html');
});

// Load User Data (Balance)
function loadUserData() {
    const balanceRef = ref(db, 'users/' + currentUser.uid + '/balance');
    onValue(balanceRef, (snapshot) => {
        const balance = snapshot.val() || 0;
        // Update all balance displays in UI
        document.querySelectorAll('.text-gray-200').forEach(el => {
            if(el.textContent.includes('₹')) el.textContent = `₹${balance.toFixed(2)}`;
        });
        document.querySelector('#addFundsModal .text-blue-400').textContent = `₹${balance.toFixed(2)}`;
    });
}

// Telegram Links Integration
document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.querySelector('.ph-headset').closest('.glass').querySelector('button');
    const joinBtn = document.querySelector('.ph-megaphone').closest('.glass').querySelector('button');
    
    contactBtn.addEventListener('click', () => window.open('https://t.me/Vip3rxyt', '_blank'));
    joinBtn.addEventListener('click', () => window.open('https://t.me/Instagramfreefollowersrx', '_blank'));
});

// Auto Deposit System (UPI QR)
const payBtn = document.getElementById('payBtn');
const amountInput = document.getElementById('amountInput');
const addFundsModal = document.getElementById('addFundsModal');

payBtn.addEventListener('click', () => {
    const amountStr = amountInput.value;
    const baseAmt = parseFloat(amountStr);
    if(isNaN(baseAmt) || baseAmt < 20) {
        alert("Minimum deposit is ₹20");
        return;
    }

    const fee = baseAmt * 0.05;
    const total = (baseAmt + fee).toFixed(2);
    const utr = 'TXN' + Math.floor(Math.random() * 1000000000000);
    
    // Generate UPI String
    const upiString = `upi://pay?pa=Paytmqr6i3w0w@ptys&pn=SACHIN%20SAYSING%20RAUT&am=${total}&cu=INR&tr=${utr}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiString)}&size=300x300`;

    // Inject QR Code UI into Modal (Maintaining UI structure)
    const modalContent = addFundsModal.querySelector('.relative');
    modalContent.innerHTML = `
        <button onclick="document.getElementById('addFundsModal').classList.add('hidden')" class="absolute top-4 right-4 text-gray-400">
            <i class="ph-bold ph-x text-xl"></i>
        </button>
        <div class="text-center">
            <h2 class="text-2xl font-black mb-4 text-purple-400">Scan to Pay</h2>
            <div class="bg-white p-4 rounded-xl inline-block mb-4">
                <img src="${qrUrl}" alt="UPI QR" class="w-48 h-48">
            </div>
            <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6">
                <p class="text-sm font-bold">Amount to Pay: <span class="text-blue-400">₹${total}</span></p>
                <p class="text-[10px] text-gray-400 mt-1">Ref ID: ${utr}</p>
            </div>
            <button id="confirmPaidBtn" class="w-full bg-green-500 text-white font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all">
                I Have Paid
            </button>
        </div>
    `;

    document.getElementById('confirmPaidBtn').addEventListener('click', () => {
        // Save deposit to Firebase
        const newDepositRef = push(ref(db, `deposits/${currentUser.uid}`));
        set(newDepositRef, {
            amount: parseFloat(total),
            utr: utr,
            status: 'pending',
            time: Date.now()
        }).then(() => {
            alert('Payment request submitted! Admin will verify soon.');
            window.location.reload(); // Quick reset of modal state
        });
    });
});

// Service Loading (Realtime)
function loadServices() {
    const servicesRef = ref(db, 'services');
    onValue(servicesRef, (snapshot) => {
        const data = snapshot.val();
        if(data) {
            window.mockServicesData = data; // Bind to existing UI logic
        }
    });
}
