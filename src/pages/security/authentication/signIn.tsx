import React, { ReactElement, FC, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  useTheme,
  Grid
} from "@mui/material";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Circle, Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from '@tanstack/react-query';
import { postApiLogin } from "../../../api/services/auth";
import { setItemToStroage } from "../../../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from '@mui/lab/LoadingButton';
import { RootState } from "../../../redux/store/store";
import { useNavigate } from "react-router";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { AllowAll } from "../../../utils/roleAccess";
import { useSidebarSelectedMenuTitleContext } from "@/hooks";
import { useSidebarParentMenuContext } from "@/hooks/useSidebarSelectedMenuTitleContext";

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
const SignIn: FC = (): any => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.auth);
  const [isLoading, setLoading] = useState(false);

  const mutateLogin = useMutation(postApiLogin);
  const { menuItem, setMenuItem } = useSidebarSelectedMenuTitleContext();
  const { parentMenu, setParentMenu } = useSidebarParentMenuContext();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    setLoading(!isLoading);
    formData.append('Login_id', data.username);
    formData.append('Password', data.password);
    formData.append('Service_id', import.meta.env.VITE_APP_SERVICE_ID);

    mutateLogin.mutateAsync(formData).then(res => {
      if (res?.status === 200) {
        setParentMenu(import.meta.env.VITE_APP_DEFAULT_PARENT_ID)
        setMenuItem({
          key: import.meta.env.VITE_APP_DEFAULT_MENUITEM,
          title: import.meta.env.VITE_APP_DEFAULT_MENUTITLE,
          path: '/',
          enabled: true,
          icon: <Circle style={{ fontSize: '10px !important' }} />
        })
        var authData = dispatch({
          type: 'LOG_IN', payload: {
            auth: {
              ...auth,
              accessToken: res?.data?.Data?.access_token,
              name: res?.data?.Data?.Name,
              LoginId: res?.data?.Data?.Login_Id,
              Role: res?.data?.Data?.Role,
              branchCode: res?.data?.Data?.BranchCode,
              AllowAll: AllowAll(res?.data?.Data?.Role),
            }
          }
        });
        setItemToStroage("auth", JSON.stringify(authData.payload.auth));
        navigate('/');
        setLoading(false);
      }
      else {
        setLoading(false);
        dispatch({
          type: 'OPEN_TOAST_ALERT', payload: {
            isOpen: true,
            message: res?.data?.Error?.Details[0]?.ErrorDescription || "Login Failed! Please Try Again.",
            status: 'error'
          }
        });
      }
    })
  };
  const theme = useTheme();
  return (
    <Box sx={{
      background: '#FFF',
      padding: '3em 3em 1.5em 3em',
      borderRadius: '20px',
      boxShadow: '0 0 10px #9fa8b9'
    }}>
      <Box
        component='div'
        marginLeft={'33%'}
        marginBottom={'2em'}
      >
        <div className="circleBubble">
          <CreditCardIcon fontSize="medium" color="primary" />
          <div className="circleBubble2">
            <AccountBalanceIcon fontSize="medium" color="primary" />
          </div>
        </div>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth variant="outlined" size='small' sx={{ fontSize: { xs: '9pt', sm: '9pt', md: '10pt' } }}>
          <TextField
            size="small"
            id="outlined-adornment-username"
            label="Username"
            {...register('username')}
          />
        </FormControl>
        {errors.username?.message && <FormHelperText style={{ color: '#ef1620' }}>Login Id is required</FormHelperText>}
        <Stack><br /></Stack>
        <FormControl fullWidth variant="outlined" size='small' sx={{ fontSize: { xs: '9pt', sm: '9pt', md: '10pt' } }}>
          <TextField
            size="small"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff color="primary" /> : <Visibility color="primary" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            label="Password"
            {...register('password')}
          />
        </FormControl>
        {errors.password?.message && <FormHelperText style={{ color: '#ef1620' }}>Password is required</FormHelperText>}

        <Stack style={{ marginTop: '20px' }}>
          <LoadingButton
            type="submit"
            loading={isLoading}
            endIcon={<></>}
            loadingPosition="end"
            variant="contained"
            size="large"
            style={{
              background: isLoading ? theme.palette.common.white : theme.palette.primary.main,
              border: isLoading ? `1px solid ${theme.palette.primary.main}` : 'none',
              color: isLoading ? theme.palette.primary.main : theme.palette.common.white
            }}
          >
            Login
          </LoadingButton>
        </Stack>
        <Stack style={{ marginTop: '20px' }}>
          <Typography variant='subtitle1' fontSize={13} sx={{
            padding: '3px 5px',
            background: '#efefef',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <span style={{ fontWeight: 600 }}>
              If you forgot your AD password, <br/>please contact the Tech Service Desk <br/>(email: kbz.itsd@kbzbank.com)
            </span>
          </Typography>
        </Stack>
      </form>
    </Box>
  );
};

export default SignIn;

