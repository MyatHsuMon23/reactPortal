import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button, FormHelperText, FormControl } from '@mui/material';
import React, { useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import TextFieldBox from '../../components/TextFieldBox';
import { FormSelectBox } from '../../components/SelectBox';
import { roleList } from '@/utils/commonData';
import { AddCircle, RestartAlt, Update, Cancel } from '@mui/icons-material';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoaderWithBackdrop } from '@/components/Loader';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { isFieldRequired, removeTabIndex } from '@/utils/common';
import { theme } from '@/styles/GlobalStyle';
import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';

type Props = {
    setOpenDrawer: (val: boolean) => void;
    refetchAPI: (val: boolean) => void;
    mode?: string;
}
const MySwal = withReactContent(Swal);
const schema = yup
    .object()
    .shape({
        EmployeeId: yup.string().required(),
        Name: yup.string().required(),
        RoleID: yup.string().required(),
        BranchCode: yup.string().required(),
        buttonType: yup.string()
    })
    .required();
const UserForm: React.FC<Props> = ({ setOpenDrawer, mode = 'create', refetchAPI }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const { mutate: mutateByStaffId, isLoading: isFetchigEmployee } = useMutateQuery();
    const { isStillLoading, setStillLoading } = useCommonDataContext();
    const { data, isLoading } = useQueryListData({
        queryKey: "fetchUserById",
        url: `${endpoint.getAllADList}`,
        payload: {
            service_id: import.meta.env.VITE_APP_SERVICE_ID,
            staff_id: employeeId,
            PageIndex: 1,
            PageLimit: 10
        },
        baseURL: import.meta.env.VITE_APP_AUTH_API_URL,
        config: {
            enabled: !!employeeId,
        },
    });
    
    const formFields = data?.data?.Data?.ADUserList? data?.data?.Data?.ADUserList[0] : null;
    
    const { data: BranchList } = useQueryListData({
        queryKey: "fetchBranchList",
        url: `${endpoint.getBranchList}`,
    });
    const BranchCodes = BranchList?.data?.Data?.BranchInfo?.map((x: any) => ({
        name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
        value: x.BRANCH_CODE
    }));

    const initialFormValues = {
        EmployeeId: '',
        Name: '',
        RoleID: '',
        BranchCode: '',
        buttonType: ''
    }

    const { register, handleSubmit, control, formState: { errors }, getValues, setValue, reset, watch } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: any) => {
        let url = "";
        let title = "Do you agree to create?";
        let confrimBtnText = "YES";
        let cancelBtnText = "NO";
        let successMessage = "Record is successfully created";
        var payload = {
            staff_id: data?.EmployeeId,
            name: data?.Name,
            roleId: data?.RoleID,
            branchCode: data?.BranchCode,
            service_id: import.meta.env.VITE_APP_SERVICE_ID,
        }
        if (watch('buttonType') === "create") {
            url = endpoint.createOrKillUserSession;
            confrimBtnText = "Agree";
            cancelBtnText = "Not Agree";
        }
        MySwal.fire({
            html: title,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: confrimBtnText,
            cancelButtonText: cancelBtnText,
            confirmButtonColor: theme.palette.primary.main,
            cancelButtonColor: theme.palette.error.main,
            iconColor: theme.palette.warning.main,
        }).then((result) => {
            if (result.isConfirmed) {
                setStillLoading(true);
                mutate(
                    {
                        url: url,
                        body: payload,
                        baseURL: import.meta.env.VITE_APP_AUTH_API_URL
                    },
                    {
                        onSuccess: (data) => {
                            if (data?.status == 200 || data?.status == 201 || data?.status == 202) {
                                MySwal.fire({
                                    html: successMessage,
                                    icon: 'success',
                                    width: 400,
                                    didOpen: removeTabIndex,
                                }).then(() => {
                                    setOpenDrawer(false);
                                    refetchAPI(true);
                                    reset();
                                })
                            }
                            else {
                                MySwal.fire({
                                    html: data?.data?.Data?.ErrorMessage ?
                                        data?.data?.Data?.ErrorMessage : data?.data?.Error?.Message || "Backend Service Failed",
                                    icon: 'error',
                                    width: 400,
                                    didOpen: removeTabIndex,
                                }).then(() => {
                                    setOpenDrawer(false);
                                    refetchAPI(true);
                                    reset();
                                })
                            }
                            setStillLoading(false);
                        }
                    }
                )
            }
        });
    };

    const checkLoading = () => {
        if(isStillLoading){
            return true;
        }
        if ((mode === 'edit' && employeeId && isLoading) || isProcessing) {
            return true;
        }
        if (mode === 'create' && !employeeId && isFetchigEmployee) {
            return true;
        }
        return false;
    }

    // Bind data to form fields
    useEffect(() => {
        if (mode === 'edit' && formFields) {
            for (const field in initialFormValues) {
                if (initialFormValues.hasOwnProperty(field)) {
                    setValue(field as keyof typeof initialFormValues, formFields[field]);
                }
            }
        }
        else {
            reset(initialFormValues);
        }
    }, [mode, formFields, setValue]);

    return (
        <Box sx={{
            padding: '15px 20px',
            position: 'relative',
            height: '100vh',
        }}>
            <LoaderWithBackdrop open={checkLoading()} />
            <Typography variant='subtitle1' fontSize={14} sx={{
                padding: '3px 5px',
                background: '#d9d2ff',
                borderRadius: '5px'
            }}>
                User Form
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#'>
                <Grid container columnSpacing={2} mt={3} alignItems={'center'} justifyContent={'space-between'}>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Employee Id <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'EmployeeId') }} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5}>
                        <TextFieldBox
                            disabled={mode != 'create'}
                            InputProps={true}
                            onSearch={() => {
                                mutateByStaffId(
                                    {
                                        url: endpoint.querybystaffid,
                                        body: {
                                            staff_id: getValues("EmployeeId")
                                        },
                                        baseURL: import.meta.env.VITE_API_BCPMS_API
                                    },
                                    {
                                        onSuccess: (data: any) => {
                                            if (data?.status == 200) {
                                                var info = data?.data?.Data;
                                                setValue('Name',info?.user_name);
                                                setValue('BranchCode',info?.department_code);
                                            }
                                            else {
                                                MySwal.fire({
                                                    html: data?.data?.Data?.ErrorMessage ?
                                                        data?.data?.Data?.ErrorMessage : data?.data?.Error?.Message || "Backend Service Failed",
                                                    icon: 'error',
                                                    width: 400,
                                                    didOpen: removeTabIndex,
                                                })
                                            }
                                        }
                                    })
                            }
                            }

                            error={errors.EmployeeId?.message && true}
                            type='number'
                            helperText={errors.EmployeeId?.message && errors.EmployeeId?.message.toString()}
                            {...register('EmployeeId')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Name <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Name') }} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            type='text'
                            disabled={true}
                            error={errors.Name?.message && true}
                            helperText={errors.Name?.message && errors.Name?.message.toString()}
                            {...register('Name')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2} >
                        <Typography variant='subtitle1' fontSize={14} >Role <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'RoleID') }} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.RoleID?.message ? true : false}>
                            <Controller
                                name="RoleID"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormSelectBox
                                        field={field}
                                        error={errors.RoleID?.message ? true : false}
                                        {...register('RoleID')}
                                        items={roleList}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.RoleID?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Branch Code <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'BranchCode') }} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.BranchCode?.message ? true : false}>
                            <Controller
                                name="BranchCode"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormSelectBox
                                        field={field}
                                        error={errors.BranchCode?.message ? true : false}
                                        {...register('BranchCode')}
                                        items={BranchCodes}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.BranchCode?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                </Grid>


                <Grid container columnSpacing={2} mt={3}>
                    {/* Empty Space Taking */}
                    <Grid item xs={5}></Grid>
                    <Grid item xs={5} sx={{
                        paddingLeft: '0px'
                    }}>
                        <Box display={'flex'} justifyContent={'center'} gap={1}>
                            <LoadingButtonComponent
                                isLoading={isProcessing}
                                type="submit"
                                btnText={mode == "edit" ? 'Update': 'Create'}
                                disabled={false}
                                endIcon={mode == "edit"? <Update /> : <AddCircle />}
                                style={{
                                    width: '90px',
                                    lineHeight: 0.7,
                                    margin: '0px',
                                    fontSize: '14px',
                                }}
                                handleOnclick={() => setValue("buttonType", 'create')}
                            />
                            <Button type="button" variant='contained' color='info' onClick={() => { reset() }}>Reset <RestartAlt></RestartAlt></Button>
                            <Button type="button" variant='contained' color='info' onClick={() => {
                                reset();
                                setOpenDrawer(false)
                            }}>Cancel <Cancel></Cancel></Button>
                        </Box>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                </Grid>
            </form >
        </Box >
    );
}
export default UserForm;