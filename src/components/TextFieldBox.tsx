import { Search } from '@mui/icons-material';
import { TextField, InputAdornment, useTheme, Button } from '@mui/material';
import { forwardRef, InputHTMLAttributes, ForwardedRef } from "react";

type CustomProps = {
    cleanData?: boolean;
    error?: any;
    helperText?: string | undefined;
    inputProps?: any;
    InputProps?: any;
    btnDisabled?: any;
    onSearch?: (val: any) => void;
    multiline?: boolean;
    rows?: number;
}
type Props = InputHTMLAttributes<HTMLInputElement> & CustomProps;

const TextFieldBox = forwardRef((props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const theme = useTheme()

    return (<TextField
        inputRef={ref}
        sx={{
            width: '100%',
            '& .MuiFormLabel-root': {
                overflow: 'unset',
                '&[data-shrink=false]': {
                    lineHeight: '.5em',
                    fontSize: '14px'
                }
            },
            '& .MuiInputBase-root': {
                height: props.multiline ? 'auto' : '40px',
                borderRadius: '5px',
                paddingRight: '0px',
                padding: '5px 0 !important',
                '& .MuiInputBase-input': {
                    padding: '10px 15px',
                    fontSize: '14px',
                },
                '& .MuiInputBase-input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: "none",
                },
                '& ::placeholder': {
                    // color: "#4c0fb2",
                    opacity: 0.7
                }
            },
            '& .MuiOutlinedInput-root.Mui-disabled': {
                background: '#e9e9e9'
            },
            '& .MuiFormHelperText-root': {
                marginLeft: '0px !important'
            }
        }}
        onKeyDown={props.onKeyDown}
        // placeholder={props.placeholder}
        disabled={props.disabled}
        name={props.name}
        label={props.placeholder}
        value={props.value}
        type={props.type}
        error={props.error}
        helperText={props.helperText}
        required={props.required}
        onChange={props.onChange}
        multiline={props.multiline}
        rows={props.rows}
        inputProps={props.inputProps}
        InputProps={{
            endAdornment: (
                props.InputProps &&
                <InputAdornment
                    disableTypography={false}
                    sx={{
                        borderTopRightRadius: '5px',
                        borderBottomRightRadius: '5px',
                    }}
                    position="end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.onSearch}
                        sx={{
                            backgroundColor: '#adadfb',
                            color: theme.palette.primary.main,
                            height: '40px !important',
                            '&:hover': {
                                background: '#adadfc',
                            }
                        }}
                        disabled={props.btnDisabled}
                    >
                        <Search fontSize='small'
                            style={{ cursor: 'pointer', color: theme.palette.primary.main }} />
                    </Button>
                </InputAdornment>
            ),
        }}
    >
    </TextField>
    );
});
export default TextFieldBox;