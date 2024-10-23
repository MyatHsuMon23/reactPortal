import React, { forwardRef } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

type Props = {
    name: string;
    value: any;
    items: any;
    onChange: (val: any) => void;
    cleanData?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    field?: any;
}
const SelectBox: React.FC<Props> = ({
    name,
    value = '',
    items = [],
    onChange,
    cleanData,
    disabled,
    error,
    helperText,
    placeholder
}) => {

    return (
        <FormControl size="small" sx={{ width: '100%' }} disabled={disabled} error={error}>
            <InputLabel id="demo-select-small-label" sx={{ opacity: 0.7, color: '#4c0fb2' }}>{placeholder}</InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label={placeholder}
                value={value}
                onChange={(e) => {
                    // setSelectedValue(e.target.value);
                    onChange(e.target.value)
                }}
                style={{ width: '100%', borderRadius: '5px' }}
                error={error}
                sx={{
                    fontSize: '14px!important',
                    '& .MuiSelect-select':{
                        minHeight: '24px !important',
                    },
                    '& .Mui-disabled': {
                        background: '#e9e9e9',
                        borderRadius: '10px'
                    }
                }}
            >
                {items.map((x: any) => (
                    <MenuItem
                        sx={{
                            fontSize: '14px !important'
                        }}
                        value={x.value}
                        key={x.name}>
                        {x.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText sx={{ marginLeft: '0px' }}>{helperText}</FormHelperText>
        </FormControl>
    );
}

export default SelectBox;


type FormProps = {
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    field?: any;
    items: any;
}
export const FormSelectBox = forwardRef((props: FormProps, ref) => {
    return (
        <FormControl size="small" sx={{ width: '100%' }} disabled={props.disabled} error={props.error}>
            <Select
                {...props.field}
                labelId="demo-select-small-label"
                id="demo-select-small"
                label={props.placeholder}
                style={{ width: '100%' }}
                error={props.error}
                sx={{
                    fontSize: '14px!important',
                    '& .Mui-disabled': {
                        background: '#e9e9e9',
                        borderRadius: '10px'
                    }
                }}
                ref={ref}
            >
                {props?.items?.map((x: any) => (
                    <MenuItem
                        sx={{
                            fontSize: '14px !important'
                        }}
                        value={x.value}
                        key={x.name}>
                        {x.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText sx={{ marginLeft: '0px', color: 'red' }}>{props.helperText}</FormHelperText>
        </FormControl>
    )
})