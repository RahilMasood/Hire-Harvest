import React, { useState } from "react";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
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

const Login = ({ handleAuthentication }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    let new_email = email.split("@")[0];
    const userRef = ref(db, "users/" + new_email + "/details");

    onValue(userRef, (snapshot) => {
      if (!snapshot.exists() || !snapshot.val().name || !snapshot.val().password) {
        toast("Entered email and password are incorrect");
        return;
      }

      let fireemail = snapshot.val().email;
      let fireuser = snapshot.val().name;
      let firepass = snapshot.val().password;

      if (new_email !== fireemail || firepass !== password) {
        toast.warning("Entered email or password are incorrect");
      } else {
        localStorage.setItem("RLog", "yes");
        localStorage.setItem("RName", fireuser);
        localStorage.setItem("email", email);
        localStorage.setItem("logged", true);
        window.location.replace("http://localhost:5173/");
        setEmail("");
        setPassword("");
        handleAuthentication(true);
      }
    });
  };

  return (
    <div className="pt-32 pb-20 bg-[#feffeb]">
      <div className="py-6 px-10 xl:w-4/12 lg:w-6/12 md:w-7/12 w-10/12 mx-auto border-2 border-[#1a4d2d] rounded-md gap-4 flex flex-col bg-gradient-to-b from-[#AFF1DA] to-[#F9EA8F]">
        <h2 className="text-center text-xl font-semibold">Login</h2>

        <div>
          <label>Email: </label>
          <input
            type="email"
            className="border rounded-md w-full px-2 py-1 bg-[#feffeb] border-[#1a4d2d]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            className="border rounded-md w-full px-2 py-1 bg-[#feffeb] border-[#1a4d2d]"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="hover:scale-100 hover:bg-gradient-to-r hover:from-[#fa3c16] hover:to-[#ed8f07] py-2"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center">Or</p>
        <button
          className="hover:scale-100 hover:bg-gradient-to-r hover:from-[#fa3c16] hover:to-[#ed8f07] py-2"
          onClick={() => navigate("/signup")}
        >
          Create new account
        </button>
        {handleAuthentication && <ToastContainer transition={Slide} />}
      </div>
    </div>
  );
};

export default Login;
