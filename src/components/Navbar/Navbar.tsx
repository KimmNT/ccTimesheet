import userNavbar from "@/json/userNavbar.json";
import adminNavbar from "@/json/adminNavbar.json";
import { Link } from "@tanstack/react-router";
import { getUserRole } from "@/utils/auth/sessionManager";
import style from "./Navbar.module.scss";
import { useUserStore } from "@/store/useUserStore";
import {
  LogOut,
  Users,
  ClipboardList,
  Clock,
  Download,
  User2Icon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import LogOutDialog from "../LogOut/LogOutDialog";
import { useState } from "react";

// Map titles to icons
const navIcons: Record<string, LucideIcon> = {
  Staffs: Users,
  Attendance: ClipboardList,
  Reports: Download,
  "Clock In/Out": Clock,
  "My Attendance": ClipboardList,
  Account: User2Icon,
};

export default function Navbar() {
  const role = getUserRole();
  const user = useUserStore((state) => state.user);
  const currentPath = window.location.pathname;

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navbar = role === "admin" ? adminNavbar : userNavbar;

  return (
    <div className={style.NavbarContainer}>
      <div className={style.NavLinks}>
        {navbar.map((nav, index) => {
          const IconComponent = navIcons[nav.title];
          return (
            <div key={index} className={style.NavItem}>
              <Link
                to={nav.path}
                className={clsx(
                  style.NavLink,
                  currentPath === nav.path && style.ActiveNavLink
                )}
              >
                <div className={style.NavIconContainer}>
                  <IconComponent className={style.NavIcon} />
                </div>
                <span className={style.NavText}>{nav.title}</span>
              </Link>
              <div className={style.Divider} />
            </div>
          );
        })}
        <div className={style.NavItem}>
          <button
            type="button"
            className={style.NavLink}
            onClick={() => setIsLogoutOpen(true)}
          >
            <span className={style.NavText}>{user?.userName}</span>
            <div className={clsx(style.NavIconContainer, style.Logout)}>
              <LogOut className={clsx(style.NavIcon, style.LogoutIcon)} />
            </div>
          </button>
        </div>
      </div>

      {isLogoutOpen && (
        <LogOutDialog
          onClose={() => setIsLogoutOpen(false)}
          userName={user?.userName || "User"}
        />
      )}
    </div>
  );
}
