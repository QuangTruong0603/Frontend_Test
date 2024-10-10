"use client";
import "./page.scss";
import { useRef, ChangeEvent, useState, useEffect } from "react";
import { MultiInputTimeRangeField } from "@mui/x-date-pickers-pro/MultiInputTimeRangeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import * as XLSX from "xlsx";
import dayjs, { Dayjs } from "dayjs";

export default function UploadFilePage() {
  const [timeRange, setTimeRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTimeRangeChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    setTimeRange(newValue);
    console.log("Selected Time Range:", newValue);
    // console.log(file);
    // if (file) {
    //   readExcelFile(file);
    // }
  };

  useEffect(() => {
    if (file && timeRange[0] && timeRange[1]) {
      readExcelFile(file);
    }
  }, [file, timeRange]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //   console.log("Selected file:", file);
      //   console.log(timeRange);
      //   readExcelFile(file);
      setFile(file);
    }
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      let total = 0;
      console.log(timeRange);
      rows.forEach((row, index) => {
        if (index > 7) {
          const [, dateString, timeString, , , , , , amountString] = row;
          const rowTime = dayjs(timeString, "HH:mm:ss");
          const amount = parseFloat(amountString.toString().replace(/,/g, ""));
            
          if (
            timeRange &&
            rowTime.isAfter(timeRange[0]) &&
            rowTime.isBefore(timeRange[1])
          ) {
            total += amount;
          }
        }
      });

      setTotalAmount(total);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="upload-file-page-container">
        <div className="upload-file" >
          <span onClick={handleFileClick}>Borrow File:</span>
          <span>{file?.name}</span>
        </div>
        <div className="time-piker">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MultiInputTimeRangeField
              disabled = {!file}
              ampm={false}
              value={timeRange}
              onChange={handleTimeRangeChange}
            />
          </LocalizationProvider>
        </div>
        <div className="data-table">
            <p>Total: {totalAmount}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}
