import { clearSession } from "@/utils/auth/sessionManager";
import style from "./LogOutDialog.module.scss";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  userName: string;
};

export default function LogOutDialog({ onClose, userName }: Props) {
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    clearUser();
    navigate({ to: "/login" });
  };

  return createPortal(
    <div className={style.DialogContainer}>
      <div className={style.Content}>
        <div className={style.Message}>Do you want to log out, {userName}?</div>
        <div className={style.Actions}>
          <button
            type="button"
            onClick={onClose}
            className={clsx(style.Button, style.Cancel)}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={clsx(style.Button, style.Submit)}
          >
            Sure
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
