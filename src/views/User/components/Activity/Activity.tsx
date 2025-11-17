import { convertToReadableFormatHoursAndMinutes } from "@/utils/hooks/DateTimeHelper/convertToReadableFormatHoursAndMinutes";
import clsx from "clsx";
import style from "./Activity.module.scss";
import { Check, CupSodaIcon, LogIn, LogOut } from "lucide-react";
import { convertMillisecondsToTimeString } from "@/utils/hooks/DateTimeHelper/convertMillisecondsToTimeString";

type Props = {
  clockInTime: number;
  clockOutTime: number;
  breakTime: number;
  totalHours: number;
};

export default function Activity({
  clockInTime,
  clockOutTime,
  breakTime,
  totalHours,
}: Props) {
  return (
    <div className={style.ItemContent}>
      {/* CLOCK IN */}
      <div className={style.HistoryLog}>
        <div className={style.LogAction}>
          <div className={clsx(style.LogIconContainer, style.LogInIcon)}>
            <LogIn className={clsx(style.LogIcon, style.LogIn)} />
          </div>
          <div className={style.LogTitle}>Clock In</div>
        </div>
        {clockInTime > 0 ? (
          <div className={style.LogTime}>
            {convertToReadableFormatHoursAndMinutes(clockInTime)}
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
          <div className={clsx(style.LogIconContainer, style.LogOutIcon)}>
            <LogOut className={clsx(style.LogIcon, style.LogOut)} />
          </div>
          <div className={style.LogTitle}>Clock Out</div>
        </div>
        {clockOutTime > 0 ? (
          <div className={style.LogTime}>
            {convertToReadableFormatHoursAndMinutes(clockOutTime)}
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
          <div className={clsx(style.LogIconContainer, style.LogTotalIcon)}>
            <Check className={clsx(style.LogIcon, style.TotalIcon)} />
          </div>
          <div className={style.LogTitle}>Total hours</div>
        </div>
        {clockOutTime > 0 && clockInTime > 0 ? (
          <div className={style.LogTime}>
            {convertMillisecondsToTimeString(totalHours)}
          </div>
        ) : (
          <div className={clsx(style.LogTime, style.NoActivity)}>
            No Recorded
          </div>
        )}
      </div>
    </div>
  );
}
