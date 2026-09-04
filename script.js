// script.js

import {

  auth,
  db,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  serverTimestamp

} from "./firebase-config.js";


// ===============================
// CONFIGURATION
// ===============================

const CONFIG = {

  productName: "Canva Premium Access",

  price: 99,

  paymentMethod: "bkash",

  bkashNumber: "01869194019",

  whatsapp: "01766269848",

  facebook: "https://www.facebook.com/share/1D4vaUgp6V/"

};


// ===============================
// ELEMENTS
// ===============================

const paymentModal = document.getElementById("paymentModal");

const loginModal = document.getElementById("loginModal");

const buyBtn = document.getElementById("buyBtn");

const priceBuyBtn = document.getElementById("priceBuyBtn");

const closeModal = document.getElementById("closeModal");

const closeLogin = document.getElementById("closeLogin");

const loginBtn = document.getElementById("loginBtn");

const googleLogin = document.getElementById("googleLogin");

const orderForm = document.getElementById("orderForm");

const copyNumber = document.getElementById("copyNumber");

const themeBtn = document.getElementById("themeBtn");

const toast = document.getElementById("toast");

const userInfo = document.getElementById("userInfo");


// ===============================
// TOAST MESSAGE
// ===============================

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 3500);

}


// ===============================
// OPEN / CLOSE MODAL
// ===============================

function openPayment() {

  paymentModal.classList.add("active");

  document.body.style.overflow = "hidden";

}

function closePayment() {

  paymentModal.classList.remove("active");

  document.body.style.overflow = "";

}

function openLogin() {

  loginModal.classList.add("active");

  document.body.style.overflow = "hidden";

}

function closeLoginModal() {

  loginModal.classList.remove("active");

  document.body.style.overflow = "";

}


buyBtn.addEventListener("click", openPayment);

priceBuyBtn.addEventListener("click", openPayment);

closeModal.addEventListener("click", closePayment);

closeLogin.addEventListener("click", closeLoginModal);


// বাইরে ক্লিক করলে Modal বন্ধ
paymentModal.addEventListener("click", (e) => {

  if (e.target === paymentModal) closePayment();

});

loginModal.addEventListener("click", (e) => {

  if (e.target === loginModal) closeLoginModal();

});


// ===============================
// COPY BKASH NUMBER
// ===============================

copyNumber.addEventListener("click", async () => {

  try {

    await navigator.clipboard.writeText(CONFIG.bkashNumber);

    copyNumber.textContent = "Copied!";

    showToast("bKash number copied!");

    setTimeout(() => {

      copyNumber.textContent = "Copy";

    }, 2000);

  } catch {

    showToast("Number: " + CONFIG.bkashNumber);

  }

});


// ===============================
// PAYMENT METHOD
// ===============================

document.querySelectorAll(".payment-method").forEach(btn => {

  btn.addEventListener("click", () => {

    if (btn.classList.contains("disabled")) {

      showToast("This payment method is coming soon.");

      return;

    }

    document.querySelectorAll(".payment-method")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

  });

});


// ===============================
// SUBMIT ORDER
// ===============================

orderForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const name = document.getElementById("customerName").value.trim();

  const phone = document.getElementById("customerPhone").value.trim();

  const email = document.getElementById("customerEmail").value.trim();

  const transactionId = document.getElementById("transactionId").value.trim();


  if (!name || !phone || !email || !transactionId) {

    showToast("Please fill in all fields.");

    return;

  }


  const submitBtn = orderForm.querySelector(".submit-payment");

  submitBtn.disabled = true;

  submitBtn.textContent = "Submitting...";


  try {

    await addDoc(collection(db, "orders"), {

      product: CONFIG.productName,

      amount: CONFIG.price,

      paymentMethod: "bkash",

      paymentNumber: CONFIG.bkashNumber,

      name: name,

      phone: phone,

      email: email,

      transactionId: transactionId,

      status: "pending",

      createdAt: serverTimestamp()

    });


    showToast("Payment submitted successfully!");


    orderForm.reset();

    closePayment();


    setTimeout(() => {

      alert(
        "আপনার অর্ডার জমা হয়েছে।\n\n" +
        "পেমেন্ট যাচাই করার পর আপনাকে অ্যাক্সেস দেওয়া হবে।\n\n" +
        "WhatsApp: " + CONFIG.whatsapp
      );

    }, 500);


  } catch (error) {

    console.error(error);

    showToast("Something went wrong. Please try again.");

  }


  submitBtn.disabled = false;

  submitBtn.innerHTML = "Submit Payment <span>↗</span>";

});


// ===============================
// GOOGLE LOGIN
// ===============================

loginBtn.addEventListener("click", openLogin);

googleLogin.addEventListener("click", async () => {

  try {

    await signInWithPopup(auth, provider);

    showToast("Login successful!");

    closeLoginModal();

  } catch (error) {

    console.error(error);

    showToast("Login failed. Please try again.");

  }

});


// ===============================
// AUTH STATE
// ===============================

onAuthStateChanged(auth, (user) => {

  if (user) {

    loginBtn.textContent = "Account";

    userInfo.innerHTML = `

      <div style="padding:15px;background:rgba(255,255,255,.05);border-radius:12px">

        <strong>${user.displayName || "User"}</strong>

        <p style="margin-top:8px">${user.email}</p>

        <button id="logoutBtn"
          style="margin-top:15px;padding:10px 15px;border-radius:8px;background:#e2136e;color:white">

          Logout

        </button>

      </div>

    `;


    document.getElementById("logoutBtn").addEventListener("click", async () => {

      await signOut(auth);

      showToast("Logged out successfully.");

      closeLoginModal();

    });


  } else {

    loginBtn.textContent = "Login";

    userInfo.innerHTML = "";

  }

});


// ===============================
// DARK / LIGHT MODE
// ===============================

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light");

  themeBtn.textContent = document.body.classList.contains("light")
    ? "🌙"
    : "☀️";

});


// ===============================
// FAQ
// ===============================

document.querySelectorAll(".faq-question").forEach(btn => {

  btn.addEventListener("click", () => {

    const item = btn.parentElement;

    item.classList.toggle("active");

  });

});


// ===============================
// ESCAPE KEY
// ===============================

document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {

    closePayment();

    closeLoginModal();

  }

});
