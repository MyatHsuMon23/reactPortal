import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button, FormHelperText, FormControl } from '@mui/material';
import React, { useEffect } from "react";
import TextFieldBox from '../../components/TextFieldBox';
import { FormSelectBox } from '../../components/SelectBox';
import { AddCircle, RestartAlt, CancelOutlined, Update, Delete } from '@mui/icons-material';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { useSearchParams } from 'react-router-dom';
import { LoaderWithBackdrop } from '@/components/Loader';
import { isFieldRequired, removeTabIndex } from '@/utils/common';
import { theme } from '@/styles/GlobalStyle';
import { getItemFromStorage } from '@/utils/auth';
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
        TID: yup.string().required(),
        ATMDESC: yup.string(),
        GLACCOUNT: yup.string().required(),
        BRANCH_CODE: yup.string().required(),
        // SERVICEDBY: yup.string().required(),
        buttonType: yup.string()
    })
    .required();
const CreateNewATM: React.FC<Props> = ({ setOpenDrawer, mode, refetchAPI }) => {
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const { setStillLoading } = useCommonDataContext();
    const ATMID = searchParams.get('ATMID');
    const isMaker = getItemFromStorage("auth")?.Role?.toUpperCase() === "MAKER";
    const isChecker = getItemFromStorage("auth")?.Role?.toUpperCase() === "CHECKER";
    const { data, isLoading } = useQueryListData({
        queryKey: "fetchATMById",
        url: `${endpoint.getATMById}`,
        atamId: ATMID,
        config: {
            enabled: !!ATMID,
        },
    });
    const formFields = data?.data?.Data?.ATMInfo;
    const { data: BranchList } = useQueryListData({
        queryKey: "fetchBranchList",
        url: `${endpoint.getBranchList}`,
    });
    const BRANCHList = BranchList?.data?.Data?.BranchInfo?.map((x: any) => ({
        name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
        value: x.BRANCH_CODE
    }));

    const onSubmit = (data: any) => {
        let url = "";
        let filterBranch = BRANCHList?.filter((x: any) => x.value === data.BRANCH_CODE);
        let branchName = "";
        if (filterBranch) {
            branchName = filterBranch[0]?.name?.split(' | ')[1];
        }
        let title = "Do you agree to create?";
        let confrimBtnText = "YES";
        let cancelBtnText = "NO";
        let successMessage = "New ATM is successfully created";
        let payload = {};
        if (watch('buttonType') === "create") {
            url = endpoint.createATM;
            payload = {
                TID: data.TID,
                ATMDESC: data.ATMDESC,
                CREATED_USER_ID: getItemFromStorage('auth').LoginId,
                LAST_UPDATED_USER_ID: getItemFromStorage('auth').LoginId,
                GLACCOUNT: data.GLACCOUNT,
                BRANCH: branchName,
                SERVICEDBY: data.BRANCH_CODE,
                SORT_ORDER: null,
                BRANCH_CODE: data.BRANCH_CODE,
            }
        }
        else if (watch('buttonType') === "update") {
            url = endpoint.updateATM;
            title = "Are you sure to update?"
            successMessage = "Record is successfully updated"
            payload = {
                CDMS_CS_ATM_ID: formFields?.CDMS_CS_ATM_ID,
                TID: data.TID,
                ATMDESC: data.ATMDESC,
                IS_ACTIVE: formFields?.IS_ACTIVE,
                IS_DELETE: formFields?.IS_DELETE,
                CREATED_USER_ID: getItemFromStorage('auth').LoginId,
                CREATED_DATE: formFields?.CREATED_DATE,
                LAST_UPDATED_USER_ID: getItemFromStorage('auth').LoginId,
                LAST_UPDATED_DATE: formFields?.LAST_UPDATED_DATE,
                TS: formFields?.TS,
                GLACCOUNT: data.GLACCOUNT,
                BRANCH: branchName,
                SERVICEDBY: data.BRANCH_CODE,
                BRANCH_CODE: data.BRANCH_CODE,
            }
        }
        else {
            url = endpoint.deleteATM;
            title = "Are you sure, you want to delete?"
            successMessage = "Record is successfully deleted."
            payload = {
                "ATMID": formFields?.CDMS_CS_ATM_ID,
            }
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
            didOpen: removeTabIndex,
        }).then((result) => {
            if (result.isConfirmed) {
                setStillLoading(true);
                mutate(
                    {
                        url: url,
                        body: payload,
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
                                })
                            }
                            setStillLoading(false);
                        }
                    }
                )
            }
        });
    };
    const initialFormValues = {
        TID: '',
        ATMDESC: '',
        GLACCOUNT: '',
        BRANCH_CODE: '',
        buttonType: ''
        // SERVICEDBY: '',
    }

    const { register, handleSubmit, control, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });

    const checkLoading = () => {
        if ((mode === 'edit' && ATMID && isLoading) || isProcessing) {
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
            padding: '15px 30px',
            position: 'relative',
            height: '100vh',
        }}>
            <LoaderWithBackdrop open={checkLoading()} />
            <Typography variant='subtitle1' fontSize={14} sx={{
                padding: '3px 5px',
                background: '#d9d2ff',
                borderRadius: '5px'
            }}>
                CREATE NEW ATM
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#'>
                <Grid container columnSpacing={2} mt={3} alignItems={'center'} justifyContent={'space-between'}>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Terminal ID <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'TID')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5}>
                        <TextFieldBox
                            type='number'
                            disabled={mode === 'edit'}
                            error={errors.TID?.message && true}
                            helperText={errors.TID?.message && errors.TID?.message.toString()}
                            {...register('TID')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >ATM Descritption <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'ATMDESC')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            error={errors.ATMDESC?.message && true}
                            helperText={errors.ATMDESC?.message && errors.ATMDESC?.message.toString()}
                            {...register('ATMDESC')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2} >
                        <Typography variant='subtitle1' fontSize={14} >GL Account <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'GLACCOUNT')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            disabled={mode === 'edit'}
                            error={errors.GLACCOUNT?.message && true}
                            helperText={errors.GLACCOUNT?.message && errors.GLACCOUNT?.message.toString()}
                            {...register('GLACCOUNT')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Branch Code <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'BRANCH_CODE')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.BRANCH_CODE?.message ? true : false}>
                            <Controller
                                name="BRANCH_CODE"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormSelectBox
                                        disabled={mode === 'edit'}
                                        field={field}
                                        error={errors.BRANCH_CODE?.message ? true : false}
                                        {...register('BRANCH_CODE')}
                                        items={BRANCHList}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.BRANCH_CODE?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Service By</Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            error={errors.SERVICEDBY?.message && true}
                            helperText={errors.SERVICEDBY?.message && errors.SERVICEDBY?.message.toString()}
                            {...register('SERVICEDBY')}
                        />
                    </Grid> */}
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                </Grid>


                <Grid container columnSpacing={2} mt={3} alignItems={'center'} justifyContent={'space-between'}>
                    {/* Empty Space Taking */}
                    <Grid item xs={5}></Grid>
                    <Grid item xs={5}>
                        <Box display={'flex'} justifyContent={'flex-start'} margin={'10px 0'} gap={1}>
                            {mode === 'create' && (
                                <>
                                    <LoadingButtonComponent
                                        isLoading={isProcessing}
                                        type="submit"
                                        btnText={'Create'}
                                        disabled={!isMaker}
                                        endIcon={<AddCircle />}
                                        style={{
                                            width: '90px',
                                            lineHeight: 0.7,
                                            fontSize: '14px',
                                        }}
                                        handleOnclick={() => setValue("buttonType", 'create')}
                                    />
                                    <Button type="button" disabled={!isMaker} variant='contained' color='info' onClick={() => { reset() }}>Reset <RestartAlt /></Button>
                                </>
                            )}
                            {mode === 'edit' && (
                                <>
                                    <LoadingButtonComponent
                                        isLoading={isProcessing}
                                        type="submit"
                                        btnText={'Update'}
                                        disabled={!isChecker}
                                        endIcon={<Update />}
                                        color='secondary'
                                        style={{
                                            width: '90px',
                                            lineHeight: 0.7,
                                            fontSize: '14px',
                                        }}
                                        handleOnclick={() => setValue("buttonType", 'update')}
                                    />
                                    <LoadingButtonComponent
                                        isLoading={isProcessing}
                                        type="submit"
                                        btnText={'Delete'}
                                        disabled={!isChecker}
                                        endIcon={<Delete />}
                                        color='error'
                                        style={{
                                            width: '90px',
                                            lineHeight: 0.7,
                                            fontSize: '14px',
                                        }}
                                        handleOnclick={() => setValue("buttonType", 'delete')}
                                    />
                                </>
                            )}
                            <Button type="button" variant='contained' color='info' onClick={() => {
                                reset();
                                setSearchParams(new URLSearchParams());
                                setOpenDrawer(false)
                            }}>Cancel <CancelOutlined /></Button>
                        </Box>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                </Grid>
            </form >
        </Box >
    );
}
export default CreateNewATM;