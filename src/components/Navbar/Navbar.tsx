import userNavbar from "@/json/userNavbar.json";
import adminNavbar from "@/json/adminNavbar.json";
import { Link, useNavigate } from "@tanstack/react-router";
import { clearSession, getUserRole } from "@/utils/auth/sessionManager";
import style from "./Navbar.module.scss";
import { useUserStore } from "@/store/useUserStore";
import {
  LogOut,
  User,
  Users,
  ClipboardList,
  FileText,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

// Map titles to icons
const navIcons: Record<string, LucideIcon> = {
  Staff: Users,
  Attendance: ClipboardList,
  Reports: FileText,
  "Clock In/Out": Clock,
  "My Attendance": ClipboardList,
};

export default function Navbar() {
  const role = getUserRole();
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);
  const currentPath = window.location.pathname;

  const navbar = role === "admin" ? adminNavbar : userNavbar;

  const handleLogout = () => {
    clearSession();
    clearUser();
    navigate({ to: "/login" });
  };

  return (
    <div className={style.NavbarContainer}>
      <div className={style.NavLinks}>
        {navbar.map((nav, index) => {
          const IconComponent = navIcons[nav.title];
          return (
            <>
              <Link
                to={nav.path}
                key={index}
                className={clsx(
                  style.NavLink,
                  currentPath === nav.path && style.ActiveNavLink
                )}
              >
                <IconComponent className={style.NavIcon} />
                <span className={style.NavText}>{nav.title}</span>
              </Link>
              <div className={style.LineBreaker}></div>
            </>
          );
        })}
        <div className={style.UserSection}>
          <div className={style.UserInfo}>
            <User className={style.UserIcon} />
            <p className={style.UserName}>{user?.userName}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={style.LogoutButton}
          >
            <LogOut className={style.Icon} />
          </button>
        </div>
      </div>
    </div>
  );
}
