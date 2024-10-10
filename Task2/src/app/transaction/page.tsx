"use client"
import { useRouter } from 'next/navigation';
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ArrowBack } from "@mui/icons-material";
import {
  FormGroup,
  TextField,
  Button,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import "./page.scss";

type FormValues = {
  name: string;
  quantity: number;
  revenue: number;
  unitPrice: number;
  datetime: Dayjs | null;
  option: string;
};

export default function UploadFilePage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      datetime: null,
      option: "",
    },
  });

  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="transaction-container">
        <div className="transaction-header">
          <div className="left-side-header">
            <div className="back-button">
              <ArrowBack onClick={handleBackClick}/>
              <span>Đóng</span>
            </div>
            <div className="left-side-text">
              Nhập giao dịch
            </div>
          </div>
          <div className="right-side-header">
            <button type="submit">
              Cập nhật
            </button>
          </div>
        </div>
        <div className="form" >
          <FormGroup>
            <Controller
              name="datetime"
              control={control}
              rules={{ required: "Date and time are required" }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    ampm={false}
                    label="Thời gian"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        error: !!errors.datetime,
                        helperText: errors.datetime
                          ? errors.datetime.message
                          : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
            <Controller
              name="quantity"
              control={control}
              rules={{ required: "Quantity is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số lượng"
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity ? errors.quantity.message : ""}
                  margin="normal"
                />
              )}
            />

            <Controller
              name="option"
              control={control}
              rules={{ required: "Option is required" }}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={!!errors.option}
                  sx={{ marginTop: 2 }}
                >
                  <InputLabel id="option-label">Trụ</InputLabel>
                  <Select
                    {...field}
                    labelId="option-label"
                    value={field.value}
                    onChange={field.onChange}
                    displayEmpty
                  >
                    <MenuItem value="Option 1">Trụ 1</MenuItem>
                    <MenuItem value="Option 2">Trụ 2</MenuItem>
                    <MenuItem value="Option 3">Trụ 3</MenuItem>
                  </Select>
                  {errors.option && (
                    <FormHelperText>{errors.option.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="revenue"
              control={control}
              rules={{ required: "Revenue is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Doanh thu"
                  type="number"
                  error={!!errors.revenue}
                  helperText={errors.revenue ? errors.revenue.message : ""}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="unitPrice"
              control={control}
              rules={{ required: "Unit price is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Đơn giá"
                  type="number"
                  error={!!errors.unitPrice}
                  helperText={errors.unitPrice ? errors.unitPrice.message : ""}
                  margin="normal"
                />
              )}
            />

          </FormGroup>
        </div>
      </form>
    </>
  );
}
