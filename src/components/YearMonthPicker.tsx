import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

type FilterProps = {
  name: string;
  value: any;
  onChange: (val: any) => void;
  disabled?: boolean;
}
const YearMonthPicker: React.FC<FilterProps> = ({
  name,
  value = new Date(),
  onChange,
  disabled = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={'Year | Month'}
        views={['year', 'month']}
        openTo="month"
        format='YYYY | MMM'
        value={dayjs(value)}
        onChange={(value: any) => onChange(value)} //?.$M + 1, value?.$y
        sx={{
          '& .MuiInputLabel-root': {
            top: '-7px !important',
          },
          width: '100% ', height: '40px',
          '& .MuiInputBase-root': {
            height: '40px',
          },
          '& .MuiFormHelperText-root': {
            marginLeft: '0px !important'
          },
          '& .MuiButtonBase-root svg': {
            color: '#4c0fb2'
          }
        }}
      />
    </LocalizationProvider>
  );
}

export default YearMonthPicker;