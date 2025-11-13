import { useEffect, useRef, useState } from "react";
import style from "./Login.module.scss";

import attendanceBackground from "@/assets/images/attendance-image.jpeg";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState(
    "Invalid username or password. Please try again."
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    if (!userName || !password) {
      setIsErrorMsg("Please enter both username and password.");
      inputRef.current?.focus();
      setIsError(true);
      return;
    }
    try {
      const userRef = collection(db, "users");
      const roleQuery = query(
        userRef,
        where("userEmail", "==", userName),
        where("userPassword", "==", password)
      );

      const querySnapshot = await getDocs(roleQuery);

      // Check if any user was found
      if (querySnapshot.empty) {
        console.log("No user found with these credentials");
        setIsErrorMsg("Invalid username or password. Please try again.");
        setIsError(true);
        return;
      }

      // Handle querySnapshot data here
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log("User found:", userData);
        setIsError(false);

        if (userData.role === "admin") {
          console.log("Admin login successful");
          // TODO: Navigate to admin dashboard or set admin state
        } else {
          console.log("User login successful");
          // TODO: Navigate to user dashboard or set user state
        }

        // Optional: Save credentials if needed
        // if (isSaved) {
        //   const saveInfo = {
        //     userName: userName,
        //     password: password,
        //   };
        //   localStorage.setItem("cfxo6u7xp5", JSON.stringify(saveInfo));
        // }
      });
    } catch (error) {
      console.error("Error during login: ", error);
      setIsError(true);
    }
  };

  return (
    <main className={style.PageContainer}>
      <div className={style.Content}>
        <div className={style.FormContainer}>
          <img src={attendanceBackground} alt="" />
          <div className={style.Form}>
            <div className={style.TitleContainerMobile}>
              <p className={style.Subtitle}>ccTimesheet</p>
            </div>
            <h1 className={style.Heading}>Sign In</h1>
            <div className={style.InputContainer}>
              <div className={style.FormGroup}>
                <label htmlFor="username" className={style.Label}>
                  Username:
                </label>
                <div className={style.InputWrapper}>
                  <input
                    ref={inputRef}
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>
              <div className={style.FormGroup}>
                <label htmlFor="password" className={style.Label}>
                  Password:
                </label>
                <div className={style.InputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={style.PasswordToggleButton}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </div>
            </div>
            {isError && <p className={style.ErrorMessage}>{isErrorMsg}</p>}
            <button
              type="button"
              className={style.SubmitButton}
              onClick={handleLogin}
            >
              <p className={style.Title}>Sign In</p>
              <ArrowRight className={style.Icon} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
