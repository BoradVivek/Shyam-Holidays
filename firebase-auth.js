// ========================================================
// SHYAM HOLIDAYS - FIREBASE MASTER INITIALIZATION & GUARD
// ========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// REPLACE THESE PLACEHOLDER STRUCTS WITH YOUR EXACT REAL FIREBASE CONSOLE APP KEYS:
const firebaseConfig = {
apiKey: "AIzaSyAegxiY8Ke_oker7jdes966X6xQf1oup_U",
  authDomain: "shyam-holidays.firebaseapp.com",
  projectId: "shyam-holidays",
  storageBucket: "shyam-holidays.firebasestorage.app",
  messagingSenderId: "928077350521",
  appId: "1:928077350521:web:3d483972d2dc11bbce76a8",
  measurementId: "G-1LLW1H95ZL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ========================================================
// 🔐 BULLETPROOF ROUTE GUARD SYSTEM: ENFORCED CLOUD BLOCKADES
// ========================================================
const currentFile = window.location.pathname.split("/").pop();

// Only allow open access to index.html and gate.html
if (currentFile !== "index.html" && currentFile !== "gate.html" && currentFile !== "") {
    // Listen for connection session properties before drawing anything
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // No session active: Instantly push the user out to the standalone gate page
            alert("🔒 Authorized Session Required!\nYou must log in or register an account to inspect this Shyam Holidays route.");
            window.location.href = "gate.html?auth_trigger=true";
        } else {
            // If the user tries to sneak into dashboard.html, perform a strict owner check
            if (currentFile === "dashboard.html" && user.email !== "owner@shyamholidays.com") {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (!userDoc.exists() || userDoc.data().role.trim().toLowerCase() !== "owner") {
                        alert("❌ Administrative Violation!\nYour credentials do not match Owner access privileges.");
                        window.location.href = "index.html";
                    }
                } catch (err) {
                    console.error("Firestore status check failure: ", err);
                    window.location.href = "index.html";
                }
            }
        }
    });
}









