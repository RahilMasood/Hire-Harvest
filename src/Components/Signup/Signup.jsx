import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  // Add your Firebase configuration here
  databaseURL: "https://hireharvest-default-rtdb.firebaseio.com/",
  apiKey: "AIzaSyBnTqP_TpVQJEaTwkZPPk4nRuQuiGYChn8",
  authDomain: "hireharvest.firebaseapp.com",
  projectId: "hireharvest",
  storageBucket: "hireharvest.appspot.com",
  messagingSenderId: "1095355415030",
  appId: "1:1095355415030:web:763fd3668fc06ac027efd7",
  measurementId: "G-EPR14D8SSD"
};

// Initialize Firebase if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getDatabase(app);

const Signup = ({ handleAuthentication }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password && confirmPassword && password === confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);

        let new_email = email.split("@")[0];
        let flag = 0;

        const userRef = ref(db, "users/" + new_email);
        onValue(userRef, async (snapshot) => {
          if (!flag && snapshot.exists()) {
            toast.warning("Username already exists");
            return;
          } else {
            flag = 1;
            let hpass = password;
            await set(ref(db, "users/" + new_email + "/details/"), {
              "email": new_email,
              "name": name,
              "password": hpass,
            });
            localStorage.setItem("RLog", "yes");
            localStorage.setItem("RName", name);
            localStorage.setItem("email", email);
            localStorage.setItem("signed", true);
            setEmail("");
            setPassword("");
            setName("");
            handleAuthentication(true);
            toast.success("Sign Up successful");
            navigate("/");
          }
        });
      } catch (error) {
        console.error(error.code, error.message);
        toast.error("Error: " + error.message);
      }
    } else {
      toast("Enter valid credentials");
    }
  };

  return (
    <div className="pt-32 pb-20 bg-[#feffeb]">
      <div className="py-6 px-10 xl:w-4/12 lg:w-6/12 md:w-7/12 w-10/12 mx-auto border-2 border-[#1a4d2d] rounded-md gap-4 flex flex-col bg-gradient-to-b from-[#AFF1DA] to-[#F9EA8F]">
        <h2 className="text-center text-xl font-semibold">Signup</h2>
        {handleAuthentication && <ToastContainer />}
        <div>
          <label>Full name:</label>
          <input
            type="text"
            className="border rounded-md w-full px-2 py-1 bg-[#feffeb] border-[#1a4d2d]"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Email:</label>
          <input
            type="email"
            className="border rounded-md w-full px-2 py-1 bg-[#feffeb] border-[#1a4d2d]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Create Password:</label>
          <input
            type="password"
            className="border rounded-md w-full px-2 py-1 bg-[#feffeb] border-[#1a4d2d]"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="py-2"></div>
          <input
            type="password"
            className="border rounded-md w-full px-2 py-1 bg-[#feffeb] border-[#1a4d2d]"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="hover:scale-100 hover:bg-gradient-to-r hover:from-[#fa3c16] hover:to-[#ed8f07] py-2"
          onClick={handleSubmit}
        >
          Create account
        </button>
        <p className="text-center">Or</p>
        <button
          className="hover:scale-100 hover:bg-gradient-to-r hover:from-[#fa3c16] hover:to-[#ed8f07] py-2"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
