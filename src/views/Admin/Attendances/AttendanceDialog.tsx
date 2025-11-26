import style from "./AttendanceDialog.module.scss";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { ClockInOut } from "@/lib/attendance/modal";
import { useCreateAttendance } from "@/utils/hooks/Attendance/useCreateAttendance";
import hours from "@/json/hours.json";
import minutes from "@/json/minutes.json";
import breakTimeList from "@/json/breakTime.json";
import { useGetAllStaff } from "@/utils/hooks/User/useGetAllStaff";
import Calendar from "react-calendar";
import { getCurrentDateTime } from "@/utils/hooks/DateTimeHelper/getCurrentDateTime";
import { useDeleteAttendance } from "@/utils/hooks/Attendance/useDeleteAttendance";
import { useEditAttendance } from "@/utils/hooks/Attendance/useEditAttendance";

type Props = {
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  onClose: () => void;
  selectedAttendance?: ClockInOut | null;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AttendanceDialog(props: Props) {
  const { isCreate, isEdit, isDelete, onClose, selectedAttendance } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const { getCurrentFormattedDate } = getCurrentDateTime();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { staff } = useGetAllStaff();

  const convertDateStringToDate = (dateString?: string): Date => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const [selectedDate, setSelectedDate] = useState<string>(
    selectedAttendance?.date || getCurrentFormattedDate()
  );
  const [calendarDate, setCalendarDate] = useState<Value>(
    convertDateStringToDate(selectedAttendance?.date)
  );

  const handleDateChange = (value: Value) => {
    const date = value as Date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
    setCalendarDate(date);
  };

  const {
    createAttendance,
    loading: createLoading,
    error: createError,
  } = useCreateAttendance();

  const {
    editAttendance,
    loading: editLoading,
    error: editError,
  } = useEditAttendance();

  const {
    deleteAttendance,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteAttendance();

  const [userName, setUserName] = useState(selectedAttendance?.userName || "");

  const convertToHour = (value: number): number => {
    if (value === 0) return 8;
    const convertedTime = new Date(value);
    return convertedTime.getHours();
  };

  const convertToMinute = (value: number): number => {
    if (value === 0) return 0;
    const convertedTime = new Date(value);
    return convertedTime.getMinutes();
  };

  const [clockInTimeHour, setClockInTimeHour] = useState<number>(
    selectedAttendance?.clockInTime
      ? convertToHour(selectedAttendance.clockInTime)
      : 0
  );
  const [clockInTimeMinute, setClockInTimeMinute] = useState<number>(
    selectedAttendance?.clockInTime
      ? convertToMinute(selectedAttendance.clockInTime)
      : 0
  );
  const [clockOutTimeHour, setClockOutTimeHour] = useState<number>(
    selectedAttendance?.clockOutTime
      ? convertToHour(selectedAttendance.clockOutTime)
      : 0
  );
  const [clockOutTimeMinute, setClockOutTimeMinute] = useState<number>(
    selectedAttendance?.clockOutTime
      ? convertToMinute(selectedAttendance.clockOutTime)
      : 0
  );
  const [breakTime, setBreakTime] = useState(
    selectedAttendance?.breakTime || 0
  );

  const timeInMilliSeconds = (hour: number, minute: number) => {
    const [year, month, day] = selectedDate.split("-");
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour,
      minute,
      0
    );
    return date.getTime();
  };

  const findStaffIdByName = (name: string) => {
    const staffMember = staff.find((member) => member.userName === name);
    return staffMember ? staffMember.id : "";
  };

  const totalHours = () => {
    const totalMilliseconds =
      timeInMilliSeconds(clockOutTimeHour, clockOutTimeMinute) -
      timeInMilliSeconds(clockInTimeHour, clockInTimeMinute);
    const totalMinutes = totalMilliseconds / (1000 * 60) - breakTime;

    const totalHoursInMilliseconds = totalMinutes * 60 * 1000;

    return totalHoursInMilliseconds;
  };

  const handleCreate = async () => {
    const attendanceData = {
      date: selectedDate,
      userId: findStaffIdByName(userName),
      userName,
      clockInTime: timeInMilliSeconds(clockInTimeHour, clockInTimeMinute),
      clockOutTime: timeInMilliSeconds(clockOutTimeHour, clockOutTimeMinute),
      breakTime,
      totalHours: totalHours(),
    };

    const newAttendanceId = await createAttendance(attendanceData);
    if (newAttendanceId) {
      onClose();
    }
  };

  const handleEdit = () => {
    if (selectedAttendance?.id) {
      const attendanceData = {
        date: selectedDate,
        userId: findStaffIdByName(userName),
        userName,
        clockInTime: timeInMilliSeconds(clockInTimeHour, clockInTimeMinute),
        clockOutTime: timeInMilliSeconds(clockOutTimeHour, clockOutTimeMinute),
        breakTime,
        totalHours: totalHours(),
      };

      editAttendance(selectedAttendance.id, attendanceData).then((success) => {
        if (success) {
          onClose();
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedAttendance?.id) {
      deleteAttendance(selectedAttendance.id).then((success) => {
        if (success) {
          onClose();
        }
      });
    }
  };

  const hourAfterInTimSelected = () => {
    const filtedHours = hours.filter((hour) => hour.value > clockInTimeHour);
    return filtedHours;
  };

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (isCreate || isEdit) {
      if (
        userName &&
        selectedDate &&
        clockInTimeHour !== 0 &&
        clockOutTimeHour !== 0
      ) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [
    userName,
    selectedDate,
    isCreate,
    isEdit,
    clockInTimeHour,
    clockOutTimeHour,
  ]);

  return (
    <div className={style.PageContainer}>
      <div className={style.Content}>
        <div className={style.Header}>
          {isCreate && <h2 className={style.Heading}>Add New Staff Member</h2>}
          {isEdit && <h2 className={style.Heading}>Edit Staff Member</h2>}
          {isDelete && <h2 className={style.Heading}>Delete Staff Member</h2>}
          <button type="button" className={style.CloseButton} onClick={onClose}>
            <X className={style.CloseIcon} />
          </button>
        </div>
        <div className={style.Body}>
          {(isCreate || isEdit) && (
            <>
              <div className={style.LabelContainer}>
                <div className={style.Label}>
                  Staff Name:
                  <select
                    className={style.Input}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Staff
                    </option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.userName}>
                        {member.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={style.BreakLine}></div>
              <div className={style.LabelContainer}>
                <div className={style.Label}>
                  Date: {selectedDate}
                  <Calendar
                    onChange={handleDateChange}
                    value={calendarDate}
                    className={style.Calendar}
                  />
                </div>
              </div>
              <div className={style.BreakLine}></div>
              <div className={style.LabelContainer}>
                <div className={style.Label}>
                  Clock In Time:
                  <div className={style.TimeSelectContainer}>
                    <select
                      className={clsx(style.Input, style.TimeSelect)}
                      value={clockInTimeHour}
                      onChange={(e) =>
                        setClockInTimeHour(Number(e.target.value))
                      }
                    >
                      {hours.map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                    :
                    <select
                      className={clsx(style.Input, style.TimeSelect)}
                      value={clockInTimeMinute}
                      onChange={(e) =>
                        setClockInTimeMinute(Number(e.target.value))
                      }
                    >
                      {minutes.map((minute) => (
                        <option key={minute.value} value={minute.value}>
                          {minute.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={style.Label}>
                  Clock Out Time:
                  <div className={style.TimeSelectContainer}>
                    <select
                      className={clsx(style.Input, style.TimeSelect)}
                      value={clockOutTimeHour}
                      onChange={(e) =>
                        setClockOutTimeHour(Number(e.target.value))
                      }
                    >
                      {hourAfterInTimSelected().map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                    :
                    <select
                      className={clsx(style.Input, style.TimeSelect)}
                      value={clockOutTimeMinute}
                      onChange={(e) =>
                        setClockOutTimeMinute(Number(e.target.value))
                      }
                    >
                      {minutes.map((minute) => (
                        <option key={minute.value} value={minute.value}>
                          {minute.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className={style.BreakLine}></div>
              <div className={style.LabelContainer}>
                <div className={style.Label}>
                  Break Time (minutes):
                  <div className={style.List}>
                    {breakTimeList.map((time) => (
                      <button
                        type="button"
                        key={time.value}
                        className={clsx(
                          style.ListItem,
                          breakTime === time.value && style.ActiveListItem
                        )}
                        onClick={() => setBreakTime(time.value)}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className={style.BreakLine}></div>
            </>
          )}
          {isDelete && (
            <p>
              Are you sure you want to delete attendance record for{" "}
              {selectedAttendance?.userName} on {selectedAttendance?.date}?
            </p>
          )}
        </div>
        <div className={style.Actions}>
          <button type="button" onClick={onClose} className={style.CloseAction}>
            Cancel
          </button>
          <button
            type="button"
            className={clsx(
              style.ConfirmAction,
              isDisabled && style.DisabledButton
            )}
            onClick={
              isCreate ? handleCreate : isEdit ? handleEdit : handleDelete
            }
            disabled={
              createLoading || deleteLoading || editLoading || isDisabled
            }
          >
            {createLoading || deleteLoading || editLoading
              ? "Loading..."
              : isCreate
                ? "Add"
                : isEdit
                  ? "Update"
                  : "Delete"}
          </button>
        </div>
        {createError && deleteError && editError && (
          <p className={style.Error}>{createError}</p>
        )}
      </div>
    </div>
  );
}
