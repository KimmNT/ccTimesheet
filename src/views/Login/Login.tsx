import { useEffect, useRef, useState } from "react";
import style from "./Login.module.scss";

import attendanceBackground from "@/assets/images/attendance-image.jpeg";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { saveSession, isAuthenticated } from "@/utils/auth/sessionManager";
import { useNavigate } from "@tanstack/react-router";
import { useUserStore } from "@/store/useUserStore";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState(
    "Invalid username or password. Please try again."
  );
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      navigate({ to: "/" });
      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigate]);

  const handleLogin = async () => {
    // Input validation
    if (!userName.trim() || !password) {
      setIsErrorMsg("Please enter both username and password.");
      inputRef.current?.focus();
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const userRef = collection(db, "users");
      const roleQuery = query(
        userRef,
        where("userEmail", "==", userName.trim()),
        where("userPassword", "==", password)
      );

      const querySnapshot = await getDocs(roleQuery);

      // Check if any user was found
      if (querySnapshot.empty) {
        console.log("No user found with these credentials");
        setIsErrorMsg("Invalid username or password. Please try again.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log("User found:", userData);

        // Save to JWT session
        saveSession({
          userId: doc.id,
          userEmail: userData.userEmail,
          role: userData.role,
        });

        // Save complete user data to global store
        setUser({
          userId: doc.id,
          userEmail: userData.userEmail,
          role: userData.role,
          userName: userData.userName,
          // Add any other fields from your Firestore user document
        });

        // Navigate based on role
        if (userData.role === "admin") {
          console.log("Admin login successful");
          navigate({ to: "/admin" });
        } else {
          console.log("User login successful");
          navigate({ to: "/user/clock-in-out" });
        }
      });
    } catch (error) {
      console.error("Error during login: ", error);
      setIsErrorMsg("Login failed. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={style.PageContainer}>
      <div className={style.TitleContainerMobile}>
        <p className={style.Subtitle}>ccTimesheet</p>
      </div>
      <div className={style.Content}>
        <div className={style.FormContainer}>
          <img src={attendanceBackground} alt="" />
          <div className={style.Form}>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
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
              disabled={isLoading}
            >
              <p className={style.Title}>
                {isLoading ? "Signing In..." : "Sign In"}
              </p>
              {!isLoading && <ArrowRight className={style.Icon} />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
