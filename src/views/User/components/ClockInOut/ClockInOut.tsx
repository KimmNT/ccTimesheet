import Navbar from "@/components/Navbar/Navbar";
import style from "./ClockInOut.module.scss";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import { Check, CupSodaIcon, LogIn, LogOut } from "lucide-react";
import BreakTime from "./BreakTime";

export default function ClockInOut() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState(0);
  const [clockOutTime, setClockOutTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [breakTimeDialog, setBreakTimeDialog] = useState(false);
  const [isBreakTimeSubmited, setIsBreakTimeSubmited] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now.getTime());
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now.getTime());
    setBreakTimeDialog(true);
  };

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

  const handleCalculateTotalHours = useCallback(() => {
    if (clockInTime > 0 && clockOutTime > 0) {
      const totalMilliseconds = clockOutTime - clockInTime;
      const totalMinutes = totalMilliseconds / (1000 * 60) - breakTime;
      const totalHoursInMilliseconds = totalMinutes * 60 * 1000;
      setTotalHours(totalHoursInMilliseconds);
    }
  }, [clockInTime, clockOutTime, breakTime]);

  const formatToTimeString = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (isBreakTimeSubmited) {
      handleCalculateTotalHours();
    }
  }, [isBreakTimeSubmited, handleCalculateTotalHours]);

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
          </div>
          <div className={clsx(style.ItemContainer, style.History)}>
            <div className={style.ItemHeader}>
              <div className={style.ItemHeading}>Today's Activitiy Log</div>
            </div>
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
                {clockOutTime > 0 && isBreakTimeSubmited ? (
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
                    className={clsx(style.LogIconContainer, style.LogTotalIcon)}
                  >
                    <Check className={clsx(style.LogIcon, style.TotalIcon)} />
                  </div>
                  <div className={style.LogTitle}>Total hours</div>
                </div>
                {clockOutTime > 0 && clockInTime > 0 && isBreakTimeSubmited ? (
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
          </div>
        </div>
        {breakTimeDialog && (
          <BreakTime
            isOpen={breakTimeDialog}
            onClose={() => setBreakTimeDialog(false)}
            isSubmited={setIsBreakTimeSubmited}
            breakTime={setBreakTime}
            clockInTime={clockInTime}
            clockOutTime={clockOutTime}
          />
        )}
      </main>
    </>
  );
}
