import { FC, forwardRef } from "react";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type FilterProps = {
    name: string;
    value: any;
    onChange: (val: any) => void;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    disableDate?: (date: Date | null) => boolean;
}

const CustomDatePicker: FC<FilterProps> = ({
    name,
    value = new Date(),
    onChange,
    disabled = false,
    error,
    helperText,
    disableDate,
}) => {
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={name}
                format='DD/MM/YYYY'
                sx={{
                    width: '100% ', height: '40px',
                    '& .MuiInputBase-root': {
                        height: '40px',
                        '& .MuiInputBase-input':{
                            fontSize: '14px !important',
                        }
                    },
                    '& .MuiFormHelperText-root': {
                        marginLeft: '0px !important'
                    },
                    '& .MuiButtonBase-root svg': {
                        color: '#4c0fb2'
                    }
                }}
                value={dayjs(value)}
                shouldDisableDate={disableDate}
                onChange={(value: any) => {
                    onChange(dayjs(value));
                }}
                slotProps={{
                    textField: {
                        variant: 'outlined',
                        error: !!error,
                        helperText: helperText,
                    },
                }}
                disabled={disabled}
            />
        </LocalizationProvider>
    );
}
export default CustomDatePicker;

type Props = {
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    field?: any;
}
export const FormDatePicker = forwardRef((props: Props, ref) => {
    return (
        <DatePicker
            ref={ref}
            {...props.field}
            format='DD/MM/YYYY'
            sx={{
                width: '100% ', height: '40px',
                '& .MuiInputBase-root': {
                    height: '40px',
                    '& .MuiInputBase-input':{
                        fontSize: '14px !important',
                    }
                },
                '& .MuiFormHelperText-root': {
                    marginLeft: '0px !important'
                },
                '& .MuiButtonBase-root svg': {
                    color: '#4c0fb2'
                }
            }}
            onChange={(value: any) => {
                props.field.onChange(dayjs(value?.$d));
            }}
            value={props.field.value}
            slotProps={{
                textField: {
                    disabled: props.disabled,
                    variant: 'outlined',
                    error: !!props.error,
                    helperText: props.helperText,
                    ...{ readOnly: true }
                },
            }}
            disabled={props.disabled}
        />
    );
});