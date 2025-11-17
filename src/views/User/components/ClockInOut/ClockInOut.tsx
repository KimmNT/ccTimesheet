import Navbar from "@/components/Navbar/Navbar";
import style from "./ClockInOut.module.scss";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import { Check, CupSodaIcon, LogIn, LogOut } from "lucide-react";
import BreakTime from "./BreakTime";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/../firebase";
import { useUserStore } from "@/store/useUserStore";
import type { ClockInOut } from "@/lib/attendance/modal";
import { useGetSpecificAttendance } from "@/utils/hooks/Attendance/useGetSpecificAttendance";
import Loading from "@/components/Loading/Loading";

export default function ClockInOut() {
  const user = useUserStore((state) => state.user);
  const { getSpecificAttendance } = useGetSpecificAttendance();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState(0);
  const [clockOutTime, setClockOutTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [attendanceId, setAttendanceId] = useState("");
  const [breakTimeDialog, setBreakTimeDialog] = useState(false);
  const [isBreakTimeSubmited, setIsBreakTimeSubmited] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleConvertToReadableFormat = (time: number) => {
    const convertedTime = new Date(time);
    const hours = convertedTime.getHours().toString().padStart(2, "0");
    const minutes = convertedTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  };

  const getCurrentFormattedDate = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const getAttendanceStatus = useCallback(async () => {
    setLoading(true);
    if (!user?.userId) return null;
    const result = await getSpecificAttendance(
      user.userId,
      getCurrentFormattedDate()
    );
    setLoading(false);
    setClockInTime(result?.clockInTime || 0);
    setClockOutTime(result?.clockOutTime || 0);
    setBreakTime(result?.breakTime || 0);
    setTotalHours(result?.totalHours || 0);
    setAttendanceId(result?.id || "");
  }, [user?.userId, getCurrentFormattedDate, getSpecificAttendance]);

  const handleClockIn = async () => {
    const now = new Date();
    await addDoc(collection(db, "attendances"), {
      date: getCurrentFormattedDate(),
      userId: user?.userId,
      userName: user?.userName,
      clockInTime: now.getTime(),
      clockOutTime,
      totalHours,
      breakTime,
    });
    await getAttendanceStatus();
  };

  useEffect(() => {
    getAttendanceStatus();
  }, [getAttendanceStatus, isBreakTimeSubmited]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockOut = async () => {
    const now = new Date();
    setClockOutTime(now.getTime());
    setBreakTimeDialog(true);
  };

  const formatToTimeString = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Navbar />
      <main className={style.PageContainer}>
        <div className={style.Content}>
          <div className={clsx(style.ItemContainer, style.ClockInOut)}>
            <div className={style.ItemHeader}>
              <div className={style.ItemHeading}>Clock In/Out</div>
              <div
                className={clsx(
                  style.ItemStatus,
                  clockInTime > 0 && style.Active
                )}
              >
                <div className={clsx(style.StatusIcon)}></div>
                <div className={clsx(style.StatusTitle)}>
                  {clockInTime > 0 && clockOutTime === 0
                    ? "Clocked In"
                    : clockOutTime > 0
                      ? "Clocked Out"
                      : "Not yet"}
                </div>
              </div>
            </div>
            {loading ? (
              <Loading size={40} color="#000" thickness={3} />
            ) : (
              <div className={style.ItemContent}>
                <div className={style.TimeDisplay}>
                  <div className={style.Clock}>{formatTime(currentTime)}</div>
                  <div className={style.Date}>{getCurrentDate()}</div>
                </div>
                <div className={style.ButtonContainer}>
                  <button
                    onClick={handleClockIn}
                    disabled={clockInTime > 0}
                    className={clsx(
                      style.Button,
                      clockInTime > 0 && style.Disable
                    )}
                  >
                    Clock In
                  </button>
                  <button
                    onClick={handleClockOut}
                    disabled={clockInTime === 0 || clockOutTime > 0}
                    className={clsx(
                      style.Button,
                      (clockInTime === 0 || clockOutTime > 0) && style.Disable
                    )}
                  >
                    Clock Out
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={clsx(style.ItemContainer, style.History)}>
            <div className={style.ItemHeader}>
              <div className={style.ItemHeading}>Today's Activitiy Log</div>
            </div>
            {loading ? (
              <Loading size={40} color="#000" thickness={3} />
            ) : (
              <div className={style.ItemContent}>
                {/* CLOCK IN */}
                <div className={style.HistoryLog}>
                  <div className={style.LogAction}>
                    <div
                      className={clsx(style.LogIconContainer, style.LogInIcon)}
                    >
                      <LogIn className={clsx(style.LogIcon, style.LogIn)} />
                    </div>
                    <div className={style.LogTitle}>Clock In</div>
                  </div>
                  {clockInTime > 0 ? (
                    <div className={style.LogTime}>
                      {handleConvertToReadableFormat(clockInTime)}
                    </div>
                  ) : (
                    <div className={clsx(style.LogTime, style.NoActivity)}>
                      No Recorded
                    </div>
                  )}
                </div>
                <div className={style.BreakLine}></div>
                {/* CLOCK OUT */}
                <div className={style.HistoryLog}>
                  <div className={style.LogAction}>
                    <div
                      className={clsx(style.LogIconContainer, style.LogOutIcon)}
                    >
                      <LogOut className={clsx(style.LogIcon, style.LogOut)} />
                    </div>
                    <div className={style.LogTitle}>Clock Out</div>
                  </div>
                  {clockOutTime > 0 ? (
                    <div className={style.LogTime}>
                      {handleConvertToReadableFormat(clockOutTime)}
                    </div>
                  ) : (
                    <div className={clsx(style.LogTime, style.NoActivity)}>
                      No Recorded
                    </div>
                  )}
                </div>
                <div className={style.BreakLine}></div>
                {/* BREAK TIME */}
                <div className={style.HistoryLog}>
                  <div className={style.LogAction}>
                    <div className={clsx(style.LogIconContainer)}>
                      <CupSodaIcon className={clsx(style.LogIcon)} />
                    </div>
                    <div className={style.LogTitle}>Break time</div>
                  </div>
                  {clockOutTime > 0 ? (
                    <div className={style.LogTime}>{breakTime} minutes</div>
                  ) : (
                    <div className={clsx(style.LogTime, style.NoActivity)}>
                      No Recorded
                    </div>
                  )}
                </div>
                <div className={style.BreakLine}></div>
                {/* TOTAL HOURS */}
                <div className={style.HistoryLog}>
                  <div className={style.LogAction}>
                    <div
                      className={clsx(
                        style.LogIconContainer,
                        style.LogTotalIcon
                      )}
                    >
                      <Check className={clsx(style.LogIcon, style.TotalIcon)} />
                    </div>
                    <div className={style.LogTitle}>Total hours</div>
                  </div>
                  {clockOutTime > 0 && clockInTime > 0 ? (
                    <div className={style.LogTime}>
                      {formatToTimeString(totalHours)}
                    </div>
                  ) : (
                    <div className={clsx(style.LogTime, style.NoActivity)}>
                      No Recorded
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {breakTimeDialog && (
          <BreakTime
            isOpen={breakTimeDialog}
            onClose={() => setBreakTimeDialog(false)}
            isSubmited={setIsBreakTimeSubmited}
            clockInTime={clockInTime}
            clockOutTime={clockOutTime}
            attendanceId={attendanceId}
          />
        )}
      </main>
    </>
  );
}
