import { useEffect, useRef, useState } from "react";
import style from "./PasswordUpdateDialog.module.scss";
import clsx from "clsx";
import { Eye, EyeClosed } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/../firebase";

type Props = {
  userId: string;
  password: string;
  onClose: () => void;
};

export default function PasswordUpdateDialog({
  userId,
  password,
  onClose,
}: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [isOldPasswordVisible, setOldIsPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordVisible, setNewIsPasswordVisible] =
    useState<boolean>(false);
  const [isNewAgainPasswordVisible, setNewAgainIsPasswordVisible] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [error, setError] = useState("");

  const handleUpdatePassword = async () => {
    setIsSubmitting(true);
    setError("");
    if (!oldPassword || !newPassword || !newPasswordAgain) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      inputRef.current?.focus();
      return;
    }
    if (oldPassword !== password) {
      setError("Old password is incorrect");
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== newPasswordAgain) {
      setError("New password do not match");
      setIsSubmitting(false);
      return;
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      userPassword: newPassword,
    });
    setIsSubmitting(false);
    setError("");
    onClose();
  };
  return (
    <div className={style.Container}>
      <div className={style.Content}>
        <div className={style.Header}>Update Password</div>
        <div className={style.Body}>
          <div className={style.Input}>
            <label className={style.Label} htmlFor="oldPassword">
              Enter Your Old Password
            </label>
            <div className={style.InputGroup}>
              <input
                ref={inputRef}
                type={isOldPasswordVisible ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className={style.IconButton}
                onClick={() => setOldIsPasswordVisible((prev) => !prev)}
              >
                {isOldPasswordVisible ? (
                  <Eye className={style.Icon} />
                ) : (
                  <EyeClosed className={style.Icon} />
                )}
              </button>
            </div>
          </div>
          <div className={style.BreakLine}></div>
          <div className={style.Input}>
            <label className={style.Label} htmlFor="newPassword">
              Enter Your New Password
            </label>
            <div className={style.InputGroup}>
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className={style.IconButton}
                onClick={() => setNewIsPasswordVisible((prev) => !prev)}
              >
                {isNewPasswordVisible ? (
                  <Eye className={style.Icon} />
                ) : (
                  <EyeClosed className={style.Icon} />
                )}
              </button>
            </div>
          </div>
          <div className={style.BreakLine}></div>
          <div className={style.Input}>
            <label className={style.Label} htmlFor="newPasswordAgain">
              Enter Your New Password Again
            </label>
            <div className={style.InputGroup}>
              <input
                type={isNewAgainPasswordVisible ? "text" : "password"}
                id="newPasswordAgain"
                value={newPasswordAgain}
                onChange={(e) => setNewPasswordAgain(e.target.value)}
              />
              <button
                type="button"
                className={style.IconButton}
                onClick={() => setNewAgainIsPasswordVisible((prev) => !prev)}
              >
                {isNewAgainPasswordVisible ? (
                  <Eye className={style.Icon} />
                ) : (
                  <EyeClosed className={style.Icon} />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className={style.Error}>{error}</div>
        <div className={style.Actions}>
          <button
            type="button"
            className={clsx(style.Button, style.Cancel)}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={clsx(
              style.Button,
              style.Submit,
              isSubmitting && style.Disabled
            )}
            onClick={handleUpdatePassword}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
