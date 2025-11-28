import Navbar from "@/components/Navbar/Navbar";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import style from "./Attendances.module.scss";
import "react-calendar/dist/Calendar.css";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDaysIcon,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import Calendar from "react-calendar";
import { getCurrentDateTime } from "@/utils/hooks/DateTimeHelper/getCurrentDateTime";
import { useGetAllAttendances } from "@/utils/hooks/Attendance/useGetAllAttendances";
import Loading from "@/components/Loading/Loading";
import { convertToReadableFormatHoursAndMinutes } from "@/utils/hooks/DateTimeHelper/convertToReadableFormatHoursAndMinutes";
import { convertMillisecondsToTimeString } from "@/utils/hooks/DateTimeHelper/convertMillisecondsToTimeString";
import clsx from "clsx";
import type { ClockInOut } from "@/lib/attendance/modal";
import AttendanceDialog from "./AttendanceDialog";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const DEFAULT_ATTENDANCE: ClockInOut = {
  id: "",
  date: "",
  userId: "",
  userName: "",
  clockInTime: 0,
  clockOutTime: 0,
  breakTime: 0,
  totalHours: 0,
};

export default function Attendances() {
  useDocumentTitle("Attendances");

  const { getCurrentFormattedDate } = getCurrentDateTime();

  const { attendanceRecords, loading, error, refetch } = useGetAllAttendances();

  const [selectedDate, setSelectedDate] = useState<string>(
    getCurrentFormattedDate()
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [calendarDate, setCalendarDate] = useState<Value>(new Date());

  const handleDateChange = (value: Value) => {
    const date = value as Date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
    setCalendarDate(date);
    setShowCalendar(false);
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    handleDateChange(date);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    handleDateChange(date);
  };

  const attendancesFiltered = attendanceRecords.filter((record) => {
    const result = record.date === selectedDate;
    return result;
  });

  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] =
    useState<boolean>(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<ClockInOut | null>(null);

  const openAttendanceDialog = (
    isCreate: boolean,
    isEdit: boolean,
    isDelete: boolean,
    attendance?: ClockInOut
  ) => {
    setIsCreate(isCreate);
    setIsEdit(isEdit);
    setIsDelete(isDelete);
    setIsAttendanceDialogOpen(true);
    setSelectedAttendance(attendance || DEFAULT_ATTENDANCE);
  };

  const handleCloseDialog = () => {
    setIsAttendanceDialogOpen(false);
    refetch();
  };

  return (
    <>
      <Navbar />
      <main className={style.PageContainer}>
        <div className={style.Content}>
          <div className={style.Header}>
            <h1 className={style.Heading}>Attendances Management</h1>
            <button
              type="button"
              className={style.ActionButton}
              onClick={() =>
                openAttendanceDialog(true, false, false, DEFAULT_ATTENDANCE)
              }
            >
              <Plus className={style.ActionIcon} />
              <div className={style.ActionHeading}>Add Attendance</div>
            </button>
          </div>
          <div className={style.FilterContainer}>
            <div className={style.FilterGroupContainer}>
              <button
                type="button"
                className={style.DateNavigationButton}
                onClick={handlePreviousDay}
              >
                <ArrowLeft className={style.Icon} />
                <div className={style.Title}>Previous Day</div>
              </button>
              <div className={style.DatePicker}>
                <div className={style.DateValue}>{selectedDate}</div>
                <button
                  type="button"
                  className={style.DatePickerButton}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarDaysIcon className={style.DatePickerIcon} />
                </button>
              </div>
              <button
                type="button"
                className={style.DateNavigationButton}
                onClick={handleNextDay}
              >
                <div className={style.Title}>Next Day</div>
                <ArrowRight className={style.Icon} />
              </button>
            </div>
            {showCalendar && (
              <div className={style.CalendarContainer}>
                <Calendar
                  onChange={handleDateChange}
                  value={calendarDate}
                  className={style.Calendar}
                />
              </div>
            )}
          </div>
          {loading && <Loading color="#000" />}
          {error && <p className={style.Error}>Error: {error}</p>}
          {!loading && !error && (
            <>
              {attendancesFiltered.length === 0 ? (
                <p className={style.NotFound}>
                  No attendance records for this date.
                </p>
              ) : (
                <div className={style.TableContainer}>
                  <table className={style.Table}>
                    <thead className={style.TableHeader}>
                      <tr className={style.Row}>
                        <th className={style.HeaderCell}>staff name</th>
                        <th className={style.HeaderCell}>date</th>
                        <th className={style.HeaderCell}>clock in</th>
                        <th className={style.HeaderCell}>clock out</th>
                        <th className={style.HeaderCell}>break time</th>
                        <th className={style.HeaderCell}>total hours</th>
                        <th className={style.HeaderCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={style.TableBody}>
                      {attendancesFiltered.map((attendance) => (
                        <tr key={attendance.id} className={style.Row}>
                          <td className={style.Value}>{attendance.userName}</td>
                          <td className={style.Value}>{attendance.date}</td>
                          <td className={style.Value}>
                            {convertToReadableFormatHoursAndMinutes(
                              attendance.clockInTime
                            )}
                          </td>
                          <td className={style.Value}>
                            {attendance.clockOutTime === 0
                              ? "Not yet"
                              : convertToReadableFormatHoursAndMinutes(
                                  attendance.clockOutTime
                                )}
                          </td>
                          <td className={style.Value}>
                            {attendance.breakTime} m
                          </td>
                          <td className={style.Value}>
                            {convertMillisecondsToTimeString(
                              attendance.totalHours
                            )}
                          </td>
                          <td className={style.Value}>
                            <button
                              className={clsx(style.Button)}
                              onClick={() =>
                                openAttendanceDialog(
                                  false,
                                  true,
                                  false,
                                  attendance
                                )
                              }
                            >
                              <Pen className={style.EditIcon} />
                            </button>
                            <button
                              className={clsx(style.Button)}
                              onClick={() =>
                                openAttendanceDialog(
                                  false,
                                  false,
                                  true,
                                  attendance
                                )
                              }
                            >
                              <Trash2 className={style.DeleteIcon} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
        {isAttendanceDialogOpen && (
          <AttendanceDialog
            isCreate={isCreate}
            isEdit={isEdit}
            isDelete={isDelete}
            onClose={handleCloseDialog}
            selectedAttendance={selectedAttendance}
          />
        )}
      </main>
    </>
  );
}
