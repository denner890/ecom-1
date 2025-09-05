import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDHGGwOtJPpVqWwFfG549CeQcjqVaSdwQ",
  authDomain: "ecom-1-c61d2.firebaseapp.com",
  projectId: "ecom-1-c61d2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function main() {
  try {
    let userCred;
    try {
      // Try to sign in
      userCred = await signInWithEmailAndPassword(auth, "yourtestuser@gmail.com", "testpassword");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // If user doesn't exist, create it
        console.log("👤 User not found. Creating test user...");
        userCred = await createUserWithEmailAndPassword(auth, "yourtestuser@gmail.com", "testpassword");
      } else {
        throw err; // If it's a different error, rethrow
      }
    }

    const idToken = await userCred.user.getIdToken();
    console.log("🔥 Firebase ID Token:", idToken);
  } catch (err) {
    console.error("❌ Error:", err.code, err.message);
  }
}

main();
