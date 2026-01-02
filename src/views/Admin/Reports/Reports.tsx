import Navbar from "@/components/Navbar/Navbar";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import style from "./Reports.module.scss";
import { useGetAllStaff } from "@/utils/hooks/User/useGetAllStaff";
import { useState } from "react";
import { CalendarDays, Download, Search } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useGetAllAttendances } from "@/utils/hooks/Attendance/useGetAllAttendances";
import type { Staff } from "@/lib/staff/modal";
import { convertMillisecondsToTimeString } from "@/utils/hooks/DateTimeHelper/convertMillisecondsToTimeString";
import clsx from "clsx";
import type { ClockInOut } from "@/lib/attendance/modal";
import { convertToReadableFormatHoursAndMinutes } from "@/utils/hooks/DateTimeHelper/convertToReadableFormatHoursAndMinutes";
import * as XLSX from "xlsx";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Reports() {
  useDocumentTitle("Reports");

  const { staff } = useGetAllStaff();
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const { attendanceRecords } = useGetAllAttendances();
  const [attendancesFiltered, setAttendancesFiltered] = useState<ClockInOut[]>(
    []
  );

  const [fromDate, setFromDate] = useState<Value>(new Date());
  const [toDate, setToDate] = useState<Value>(new Date());
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);

  const [generateError, setGenerateError] = useState("");

  const formatDate = (date: Value): string => {
    if (!date) return "";
    if (Array.isArray(date)) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFromDateChange = (value: Value) => {
    setFromDate(value);
    setShowFromCalendar(false);
  };

  const handleToDateChange = (value: Value) => {
    setToDate(value);
    setShowToCalendar(false);
  };

  const formatDateForComparison = (date: Date): string => {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const normalizeDateToMidnight = (date: Date): Date => {
    // Create a new date at midnight local time to ensure consistent comparison
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
  };

  const filterAttendanceRecords = () => {
    if (!selectedStaff?.id || !fromDate || !toDate) {
      return [];
    }

    // Normalize dates to midnight to avoid timezone issues
    const normalizedFromDate = normalizeDateToMidnight(fromDate as Date);
    const normalizedToDate = normalizeDateToMidnight(toDate as Date);

    const fromDateStr = formatDateForComparison(normalizedFromDate);
    const toDateStr = formatDateForComparison(normalizedToDate);

    console.log("Date range:", fromDateStr, "to", toDateStr);

    const filtered = attendanceRecords.filter((record) => {
      const matchesStaff = record.userId === selectedStaff.id;
      const matchesDateRange =
        record.date >= fromDateStr && record.date <= toDateStr;
      return matchesStaff && matchesDateRange;
    });

    return filtered.sort((a, b) => a.date.localeCompare(b.date));
  };

  const handleExportToExcel = () => {
    if (!selectedStaff || attendancesFiltered.length === 0) return;

    const hourlyRate = parseFloat(selectedStaff.userSalary || "0");

    // Prepare data rows
    const data = attendancesFiltered.map((attendance) => {
      const totalHoursInHours = attendance.totalHours / (1000 * 60 * 60);
      const salary = totalHoursInHours * hourlyRate;

      return {
        Name: selectedStaff.userName,
        Date: attendance.date,
        "Clock In": convertToReadableFormatHoursAndMinutes(
          attendance.clockInTime
        ),
        "Clock Out":
          attendance.clockOutTime === 0
            ? "Not yet"
            : convertToReadableFormatHoursAndMinutes(attendance.clockOutTime),
        "Break Time": `${attendance.breakTime} m`,
        "Total Time": convertMillisecondsToTimeString(attendance.totalHours),
        Salary: Math.round(salary),
      };
    });

    // Add summary row
    data.push({
      Name: "",
      Date: "",
      "Clock In": "",
      "Clock Out": "",
      "Break Time": "TOTAL",
      "Total Time": convertMillisecondsToTimeString(totalHours),
      Salary: totalIncomes,
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    // Generate filename
    const fileName = `${selectedStaff.userName}_${formatDate(fromDate)}_${formatDate(toDate)}.xlsx`;

    // Export file
    XLSX.writeFile(workbook, fileName);
  };

  const handleGenerateReport = () => {
    setGenerateError("");
    if (!selectedStaff) {
      setGenerateError("Please select a staff member.");
      return;
    }
    if (!fromDate || !toDate) {
      setGenerateError("Please select a valid date range.");
      return;
    }
    const filteredRecords = filterAttendanceRecords();
    setAttendancesFiltered(filteredRecords);
    const totalHours = filteredRecords.reduce(
      (sum, record) => sum + record.totalHours,
      0
    );
    setTotalHours(totalHours);

    const totalHoursInHours = totalHours / (1000 * 60 * 60);
    const hourlyRate = parseFloat(selectedStaff?.userSalary || "0");
    const totalIncome = totalHoursInHours * hourlyRate;
    setTotalIncomes(Math.round(totalIncome));
  };

  return (
    <>
      <Navbar />
      <main className={style.PageContainer}>
        <div className={style.Content}>
          <div className={style.Header}>
            <h1 className={style.Heading}>Reports</h1>
          </div>

          <div className={style.ReportContent}>
            <div className={clsx(style.Item, style.SelectionContainer)}>
              <h2 className={style.ItemTitle}>Generate Report</h2>
              <div className={style.BreakLine}></div>
              <div className={style.Selection}>
                <div className={style.SelectBoxContainer}>
                  <div className={style.SelectTitle}>Select Staff</div>
                  <select
                    className={style.SelectBox}
                    value={selectedStaff?.id || ""}
                    onChange={(e) => {
                      const selected = staff.find(
                        (member) => member.id === e.target.value
                      );
                      setSelectedStaff(selected || null);
                    }}
                  >
                    <option value="">Select Staff</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.userName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={style.SelectBoxContainer}>
                  <div className={style.SelectTitle}>Date Range</div>
                  <div className={style.DateRangeWrapper}>
                    <div className={style.DateInputGroup}>
                      <label className={style.DateLabel}>From:</label>
                      <div className={style.DatePickerContainer}>
                        <input
                          type="text"
                          value={formatDate(fromDate)}
                          readOnly
                          className={style.DateInput}
                          placeholder="Select start date"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFromCalendar(!showFromCalendar)}
                          className={style.CalendarButton}
                        >
                          <CalendarDays />
                        </button>
                        {showFromCalendar && (
                          <div className={style.CalendarDropdown}>
                            <Calendar
                              onChange={handleFromDateChange}
                              value={fromDate}
                              maxDate={toDate as Date}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={style.DateInputGroup}>
                      <label className={style.DateLabel}>To:</label>
                      <div className={style.DatePickerContainer}>
                        <input
                          type="text"
                          value={formatDate(toDate)}
                          readOnly
                          className={style.DateInput}
                          placeholder="Select end date"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToCalendar(!showToCalendar)}
                          className={style.CalendarButton}
                        >
                          <CalendarDays />
                        </button>
                        {showToCalendar && (
                          <div className={style.CalendarDropdown}>
                            <Calendar
                              onChange={handleToDateChange}
                              value={toDate}
                              minDate={fromDate as Date}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.BreakLine}></div>
              <div className={style.Error}>{generateError}</div>
              <button
                type="button"
                onClick={handleGenerateReport}
                className={style.GenerateButton}
              >
                <Search /> Generate Report
              </button>
            </div>
            {totalHours > 0 && totalIncomes > 0 ? (
              <div className={clsx(style.Item, style.Result)}>
                <div className={style.ResultContent}>
                  <h2 className={style.ItemTitle}>
                    Attendance Report: {selectedStaff?.userName}
                  </h2>
                  <button
                    type="button"
                    className={style.ExportButton}
                    onClick={handleExportToExcel}
                  >
                    <Download className={style.Icon} /> Export
                  </button>
                </div>
                <div className={style.SelectedDateRange}>
                  <div>
                    {formatDate(fromDate)} - {formatDate(toDate)}
                  </div>
                </div>
                <div className={style.BreakLine}></div>
                <div className={style.TotalSummary}>
                  <div className={style.SummaryItem}>
                    <div className={style.SummaryItemTitle}>
                      Total Working Hours
                    </div>
                    <div className={style.SummaryItemValue}>
                      {convertMillisecondsToTimeString(totalHours)}
                    </div>
                  </div>
                  <div className={style.SummaryItem}>
                    <div className={style.SummaryItemTitle}>
                      Total Incomes (at {selectedStaff?.userSalary}¥/hr)
                    </div>
                    <div className={style.SummaryItemValue}>
                      {totalIncomes.toLocaleString()}¥
                    </div>
                  </div>
                </div>
                <div className={style.BreakLine}></div>
                <div className={style.TableContainer}>
                  <table className={style.Table}>
                    <thead className={style.TableHeader}>
                      <tr className={style.Row}>
                        <th className={style.HeaderCell}>date</th>
                        <th className={style.HeaderCell}>clock in</th>
                        <th className={style.HeaderCell}>clock out</th>
                        <th className={style.HeaderCell}>break time</th>
                        <th className={style.HeaderCell}>total hours</th>
                      </tr>
                    </thead>
                    <tbody className={style.TableBody}>
                      {attendancesFiltered.map((attendance) => (
                        <tr key={attendance.id} className={style.Row}>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className={style.NoResults}>No search results to show.</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
