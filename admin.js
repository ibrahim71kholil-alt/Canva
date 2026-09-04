import { db, collection, getDocs, doc, updateDoc, query, orderBy } from "./firebase-config.js";

const ordersList = document.getElementById("ordersList");
const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");

async function fetchOrders() {
    try {
        // ফায়ারবেস থেকে ডাটা আনা হচ্ছে
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        ordersList.innerHTML = "";
        let totalRev = 0;
        let count = 0;

        if (querySnapshot.empty) {
            ordersList.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-400">No orders found.</td></tr>`;
            return;
        }

        querySnapshot.forEach((document) => {
            const data = document.data();
            const id = document.id;
            count++;
            
            if(data.status === "approved") {
                totalRev += Number(data.amount || 0);
            }

            // টেবিলের রো তৈরি
            const row = `
                <tr class="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td class="p-4">${data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "N/A"}</td>
                    <td class="p-4 font-semibold">${data.name || "N/A"}</td>
                    <td class="p-4">${data.phone || "N/A"}</td>
                    <td class="p-4 font-mono text-[#00D4FF]">${data.transactionId || "N/A"}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${data.status === 'approved' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}">
                            ${data.status ? data.status.toUpperCase() : "PENDING"}
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
        console.error("Error error error: ", error);
        ordersList.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">Failed to load data! Console চেক করুন।</td></tr>`;
    }
}

// অর্ডার অ্যাপ্রুভ করা
window.approveOrder = async (orderId) => {
    if(confirm("Are you sure you want to approve this order?")) {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: "approved" });
            alert("Order Approved!");
            fetchOrders(); 
        } catch (error) {
            console.error("Error approving:", error);
            alert("Approve করতে সমস্যা হয়েছে!");
        }
    }
}

// সরাসরি ফাংশন কল
fetchOrders();
