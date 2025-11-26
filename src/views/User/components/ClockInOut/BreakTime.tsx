import { memo, useState } from "react";
import style from "./BreakTime.module.scss";
import clsx from "clsx";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import breakTimeList from "@/json/breakTime.json";

interface BreakTimeProps {
  isOpen?: boolean;
  onClose?: () => void;
  isSubmited?: (submitted: boolean) => void;
  clockOutTime?: number;
  clockInTime?: number;
  attendanceId?: string;
}

export default memo(function BreakTime({
  onClose,
  isSubmited,
  clockInTime,
  clockOutTime,
  attendanceId,
}: BreakTimeProps) {
  const [breakTimeValue, setBreakTimeValue] = useState("");
  const [error, setError] = useState("");

  const filterdBreakTimeList = breakTimeList.filter((option) => {
    const breakDuration =
      clockOutTime && clockInTime
        ? (clockOutTime - clockInTime) / (1000 * 60)
        : 0;
    return option.value < breakDuration;
  });

  const handleSelectedBreakTime = async () => {
    if (breakTimeValue === "") {
      setError("Please select or enter your break time.");
      return;
    }
    const totalMilliseconds = (clockOutTime ?? 0) - (clockInTime ?? 0);
    const totalMinutes =
      totalMilliseconds / (1000 * 60) - (parseInt(breakTimeValue) || 0);
    const totalHoursInMilliseconds = totalMinutes * 60 * 1000;

    const wrokingTimeRef = doc(db, "attendances", attendanceId || "");
    await updateDoc(wrokingTimeRef, {
      clockOutTime,
      totalHours: totalHoursInMilliseconds,
      breakTime: breakTimeValue ? parseInt(breakTimeValue) : 0,
    });
    isSubmited?.(true);
    void onClose?.();
  };

  return (
    <div className={style.BreakTimeContainer}>
      <div className={style.BreakTimeContent}>
        <div className={style.BreakTimeTitle}>Select Break Time (minutes)</div>
        <div className={style.BreakTimeOptions}>
          {filterdBreakTimeList.map((option, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setBreakTimeValue(option.value.toString())}
              className={clsx(
                style.BreakTimeButton,
                parseInt(breakTimeValue) === option.value && style.Active
              )}
            >
              <div className={style.Label}>{option.label}</div>
            </button>
          ))}
        </div>
        <div className={style.OtherBreakTime}>
          <div className={style.Heading}>Other (enter your break time):</div>
          <input
            type="number"
            placeholder="Please enter your break time"
            value={breakTimeValue}
            onChange={(e) => setBreakTimeValue(e.target.value)}
          />
          {error !== "" && <div className={style.Error}>{error}</div>}
        </div>
        <div className={style.SubmitButtonContainer}>
          <button
            type="button"
            className={style.SubmitButton}
            onClick={handleSelectedBreakTime}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
});
