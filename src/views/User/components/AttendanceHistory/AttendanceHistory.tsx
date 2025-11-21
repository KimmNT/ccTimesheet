import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "@/components/Navbar/Navbar";
import style from "./AttendanceHistory.module.scss";
import { useUserStore } from "@/store/useUserStore";
import { useGetAllAttendanceByUserId } from "@/utils/hooks/Attendance/useGetAllAttendanceByUserId";
import Loading from "@/components/Loading/Loading";
import Activity from "../Activity/Activity";
import { convertMillisecondsToTimeString } from "@/utils/hooks/DateTimeHelper/convertMillisecondsToTimeString";
import type { ClockInOut } from "@/lib/attendance/modal";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AttendanceHistory() {
  useDocumentTitle("Attendance History");
  const user = useUserStore((state) => state.user);
  const [date, setDate] = useState<Value>(new Date());

  const { attendanceRecords, loading, error } = useGetAllAttendanceByUserId(
    user?.userId || ""
  );

  const now = new Date();

  const currentMonth = () => {
    const year = now.getFullYear();
    const result = `${now.toLocaleString("en-US", { month: "short" })} ${year}`;
    return result;
  };

  const attendanceAMonth = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today); // Create separate date object
    const startDate = new Date(today); // Create separate date object

    startDate.setDate(1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return attendanceRecords.filter(
      (record) =>
        record.date >= formatDate(startDate) &&
        record.date <= formatDate(endDate)
    );
  }, [attendanceRecords]);

  const currentWeek = () => {
    const today = new Date();
    const endDate = new Date(today); // Create separate date object
    const startDate = new Date(today); // Create separate date object

    startDate.setDate(today.getDate() - 7);

    const result = `${startDate.toLocaleString("en-US", { month: "short" })} ${startDate.getDate()} - ${endDate.toLocaleString("en-US", { month: "short" })} ${endDate.getDate()}`;
    return result;
  };

  const attendanceAWeek = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today); // Create separate date object
    const startDate = new Date(today); // Create separate date object

    startDate.setDate(today.getDate() - 7);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return attendanceRecords.filter(
      (record) =>
        record.date >= formatDate(startDate) &&
        record.date <= formatDate(endDate)
    );
  }, [attendanceRecords]);

  const selectedDateAttendance = useMemo(() => {
    if (!date || Array.isArray(date)) return null;

    // Format date to YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const selectedDateString = `${year}-${month}-${day}`;

    return attendanceRecords.find(
      (record) => record.date === selectedDateString
    );
  }, [date, attendanceRecords]);

  const handleDateChange = (value: Value) => {
    setDate(value);
  };

  // Function to add dots to dates with attendance
  const tileContent = ({ date }: { date: Date }) => {
    // Format date to YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const hasAttendance = attendanceRecords.some(
      (record) => record.date === dateString
    );

    return hasAttendance ? <div className={style.AttendanceDot}></div> : null;
  };

  const totalWorkingHours = (
    dateRangeRecord: (ClockInOut & { id: string })[]
  ) => {
    let total = 0;
    dateRangeRecord.forEach((record) => {
      total += record.totalHours;
    });
    const result = convertMillisecondsToTimeString(total);
    return result;
  };

  const totalDaysWorked = (
    dateRangeRecord: (ClockInOut & { id: string })[]
  ) => {
    return dateRangeRecord.length;
  };

  return (
    <>
      <Navbar />
      <main className={style.PageContainer}>
        <div className={style.Content}>
          <div className={style.Item}>
            <h2 className={style.ItemHeading}>Summary</h2>
            <div className={style.SummaryContainer}>
              <div className={style.SummaryBox}>
                <div className={style.Heading}>
                  Monthly Summary ( {currentMonth()} )
                </div>
                <div className={style.SummaryData}>
                  <div className={style.Item}>
                    <div className={style.ItemHeading}>Total Hours</div>
                    <div className={style.ItemValue}>
                      {totalWorkingHours(attendanceAMonth)}
                    </div>
                  </div>
                  <div className={style.Item}>
                    <div className={style.ItemHeading}>Days Worked</div>
                    <div className={style.ItemValue}>
                      {totalDaysWorked(attendanceAMonth)} days
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.SummaryBox}>
                <div className={style.Heading}>
                  This Week ( {currentWeek()} )
                </div>
                <div className={style.SummaryData}>
                  <div className={style.Item}>
                    <div className={style.ItemHeading}>Total Hours</div>
                    <div className={style.ItemValue}>
                      {totalWorkingHours(attendanceAWeek)}
                    </div>
                  </div>
                  <div className={style.Item}>
                    <div className={style.ItemHeading}>Days Worked</div>
                    <div className={style.ItemValue}>
                      {totalDaysWorked(attendanceAWeek)} days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.Item}>
            <h2 className={style.ItemHeading}>History</h2>
            <div className={style.CalendarContainer}>
              <Calendar
                onChange={handleDateChange}
                value={date}
                className={style.Calendar}
                tileContent={tileContent}
              />

              {loading && <Loading />}
              {error && <p className={style.Error}>Error: {error}</p>}

              {!loading && !error && selectedDateAttendance && (
                <div className={style.AttendanceDetails}>
                  <h3>
                    Attendance for{" "}
                    {date instanceof Date ? date.toLocaleDateString() : ""}
                  </h3>
                  <div>
                    <Activity
                      clockInTime={selectedDateAttendance?.clockInTime}
                      clockOutTime={selectedDateAttendance.clockOutTime}
                      breakTime={selectedDateAttendance.breakTime}
                      totalHours={selectedDateAttendance.totalHours}
                    />
                  </div>
                </div>
              )}

              {!loading && !error && !selectedDateAttendance && date && (
                <p className={style.NoData}>
                  No attendance record for this date
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
