import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AlzaSyCodEnbbEo07vz75IPWcbxqaFEoThgfxLI",
  authDomain: "trinetra-d32ca.firebaseapp.com",
  projectId: "trinetra-d32ca",
  storageBucket: "trinetra-d32ca.appspot.com",
  messagingSenderId: "116227232258",
  appId: "1:116227232258:web:502d3cb9825b10564acd1b",
  measurementId: "G-X251NZV905"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load incidents on page load
document.addEventListener("DOMContentLoaded", () => {
  loadIncidents();
});

async function loadIncidents(filters = {}) {
  const tbody = document.getElementById("incidentTable");
  tbody.innerHTML = "";

  let q = collection(db, "incidents");

  // Build query with filters
  const queries = [];
  if (filters.state) {
    queries.push(where("state", "==", filters.state));
  }
  if (filters.status) {
    queries.push(where("status", "==", filters.status));
  }

  let qRef = q;
  if (queries.length > 0) {
    qRef = query(q, ...queries);
  }

  const snapshot = await getDocs(qRef);
  let total = 0, resolved = 0, pending = 0;

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${docSnap.id}</td>
      <td>${data.location || 'Unknown'}</td>
      <td>
        <select class="status-dropdown" onchange="updateStatus('${docSnap.id}', this.value)">
          <option value="Resolved" ${data.status === "Resolved" ? "selected" : ""}>Resolved</option>
          <option value="Pending" ${data.status === "Pending" ? "selected" : ""}>Pending</option>
        </select>
      </td>
      <td><button onclick="deleteIncident('${docSnap.id}')">Delete</button></td>
    `;

    tbody.appendChild(tr);

    total++;
    if (data.status === "Resolved") resolved++;
    if (data.status === "Pending") pending++;
  });

  document.getElementById("totalIncidents").textContent = total;
  document.getElementById("resolvedIncidents").textContent = resolved;
  document.getElementById("pendingIncidents").textContent = pending;
}

window.applyFilters = () => {
  const state = document.getElementById("stateFilter").value;
  const status = document.getElementById("statusFilter").value;
  loadIncidents({ state, status });
};

window.updateStatus = async (id, newStatus) => {
  const docRef = doc(db, "incidents", id);
  await updateDoc(docRef, { status: newStatus });
  loadIncidents();
};

window.deleteIncident = async (id) => {
  if (confirm("Are you sure to delete this incident?")) {
    await deleteDoc(doc(db, "incidents", id));
    loadIncidents();
  }
};
