import { db, collection, getDocs, doc, updateDoc, query, orderBy } from "./firebase-config.js";

const ordersList = document.getElementById("ordersList");
const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");
let allOrdersData = [];

// অর্ডার ডাটাবেস থেকে ফেচ করা
async function fetchOrders() {
    try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        ordersList.innerHTML = "";
        let totalRev = 0;
        let count = 0;
        allOrdersData = [];

        querySnapshot.forEach((document) => {
            const data = document.data();
            const id = document.id;
            count++;
            if(data.status === "approved") totalRev += Number(data.amount || 0);

            // এক্সেল এক্সপোর্টের জন্য ডাটা সেভ রাখা
            allOrdersData.push({
                Date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "N/A",
                Name: data.name,
                Phone: data.phone,
                Email: data.email,
                TrxID: data.transactionId,
                Amount: data.amount,
                Status: data.status
            });

            // টেবিলে ডাটা দেখানো
            const row = `
                <tr class="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td class="p-4">${data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "N/A"}</td>
                    <td class="p-4 font-semibold">${data.name}</td>
                    <td class="p-4">${data.phone}</td>
                    <td class="p-4 font-mono text-[#00D4FF]">${data.transactionId}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${data.status === 'approved' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}">
                            ${data.status.toUpperCase()}
                        </span>
                    </td>
                    <td class="p-4">
                        ${data.status === 'pending' ? 
                            `<button onclick="approveOrder('${id}')" class="bg-[#00D4FF] text-[#020024] px-3 py-1 rounded text-xs font-bold hover:bg-white transition">Approve</button>` 
                            : '<span class="text-gray-500 text-xs">Done</span>'}
                    </td>
                </tr>
            `;
            ordersList.innerHTML += row;
        });

        totalOrdersEl.innerText = count;
        totalRevenueEl.innerText = `৳${totalRev}`;

    } catch (error) {
        console.error("Error fetching orders: ", error);
        ordersList.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">Failed to load data.</td></tr>`;
    }
}

// অর্ডার অ্যাপ্রুভ করা (গ্লোবাল ফাংশন হিসেবে উইন্ডোতে অ্যাড করা)
window.approveOrder = async (orderId) => {
    if(confirm("Are you sure you want to approve this order?")) {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: "approved" });
            alert("Order Approved!");
            fetchOrders(); // টেবিল রিফ্রেশ
        } catch (error) {
            console.error("Error approving:", error);
        }
    }
}

// এক্সেলে ডাটা এক্সপোর্ট
document.getElementById("exportBtn").addEventListener("click", () => {
    if(allOrdersData.length === 0) return alert("No data to export!");
    const ws = XLSX.utils.json_to_sheet(allOrdersData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "Canva_Orders.xlsx");
});

// পেইজ লোড হলে ডাটা আনবে
fetchOrders();

