import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import TextFieldBox from '../../components/TextFieldBox';
import { AddCircle, RestartAlt, Delete, Update, CancelOutlined, Publish, Beenhere } from '@mui/icons-material';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoaderWithBackdrop } from '@/components/Loader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { getItemFromStorage } from '@/utils/auth';
import { theme } from '@/styles/GlobalStyle';
import { isFieldRequired, removeTabIndex } from '@/utils/common';
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
        TOTALCASHWITHDRAWAMOUNT: yup.string(),
        IBSDRSERIAL: yup.string(),
        IBSCRSERIAL: yup.string(),
        buttonType: yup.string(),
    })
    .required();
const CreateReplinshment: React.FC<Props> = ({ setOpenDrawer, mode = 'create', refetchAPI }) => {
    let PhysicalBillingValues = {
        PhysicalBill_1: '10000',
        PhysicalRejectBill_1: '',
        PhysicalRetractBill_1: '',
        PhysicalRemainingBill_1: '',
        PhysicalTotal_1: 0,
        PhysicalBill_2: '5000',
        PhysicalRejectBill_2: '',
        PhysicalRetractBill_2: '',
        PhysicalRemainingBill_2: '',
        PhysicalTotal_2: 0,
        PhysicalBill_3: '1000',
        PhysicalRejectBill_3: '',
        PhysicalRetractBill_3: '',
        PhysicalRemainingBill_3: '',
        PhysicalTotal_3: 0,
        PhysicalTotalAmount: '',
    }
    let LogicalBillingValues = {
        LogicalBill_1: '10000',
        LogicalRejectBill_1: '',
        LogicalRetractBill_1: '',
        LogicalRemainingBill_1: '',
        LogicalTotal_1: 0,
        LogicalBill_2: '5000',
        LogicalRejectBill_2: '',
        LogicalRetractBill_2: '',
        LogicalRemainingBill_2: '',
        LogicalTotal_2: 0,
        LogicalBill_3: '1000',
        LogicalRejectBill_3: '',
        LogicalRetractBill_3: '',
        LogicalRemainingBill_3: '',
        LogicalTotal_3: 0,
        LogicalTotalAmount: '',
    }
    let ReplinshmentValues = {
        ReplishBill_1: '',
        ReplishCountBill_1: '',
        ReplishTotal_1: 0,
        ReplishBill_2: '',
        ReplishCountBill_2: '',
        ReplishTotal_2: 0,
        ReplishBill_3: '',
        ReplishCountBill_3: '',
        ReplishTotal_3: 0,
        ReplishBill_4: '',
        ReplishCountBill_4: '',
        ReplishTotal_4: 0,
        ReplishTotalAmount: '',
    }
    const [PhysicalbillingInitialValues, setPhysicalbillingInitialValues] = useState(PhysicalBillingValues);

    const [LogicalBillingInitialValues, setLogicalBillingInitialValues] = useState(LogicalBillingValues)

    const [ReplishInitialValues, setReplishInitialValues] = useState(ReplinshmentValues)

    const isMaker = getItemFromStorage("auth")?.Role?.toUpperCase() === "MAKER";
    const isChecker = getItemFromStorage("auth")?.Role?.toUpperCase() === "CHECKER";
    const [searchParams, setSearchParams] = useSearchParams();
    const Replishid = searchParams.get('Id');
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const { setStillLoading } = useCommonDataContext();
    const { data, isLoading } = useQueryListData({
        queryKey: "fetchReplinshByID",
        url: `${endpoint.getReplinshmentById}`,
        replishid: Replishid,
        config: {
            enabled: !!Replishid,
        },
    });
    const formFields = data?.data?.Data?.ReplishInfo;
    const checkStatus = () => {
        return mode === 'edit'
    }

    const onSubmit = (data: any) => {
        let url = "";
        let title = "Do you agree to create?";
        let confrimBtnText = "YES";
        let cancelBtnText = "NO";
        let successMessage = "Record is successfully created";
        let payload = {};
        if (watch('buttonType') === "create") {
            url = endpoint.createReplenish;
            payload = {
                TID: data.TID,
                ATMDESC: data.ATMDESC,
                SORT_ORDER: null,
                CREATED_USER_ID: getItemFromStorage('auth').LoginId,
                LAST_UPDATED_USER_ID: getItemFromStorage('auth').LoginId,
                BRANCH: getItemFromStorage('auth').branchCode,
                PHYSICAL_REJECT_BILL_1: PhysicalbillingInitialValues?.PhysicalRejectBill_1?.toString(),
                PHYSICAL_RETRACT_BILL_1: PhysicalbillingInitialValues?.PhysicalRetractBill_1?.toString(),
                PHYSICAL_REMAINING_BILL_1: PhysicalbillingInitialValues?.PhysicalRemainingBill_1?.toString(),
                PHYSICAL_TOTAL_AMOUNT_1: PhysicalbillingInitialValues?.PhysicalTotal_1?.toString(),
                PHYSICAL_BILL_1: PhysicalbillingInitialValues?.PhysicalBill_1?.toString(),
                PHYSICAL_REJECT_BILL_2: PhysicalbillingInitialValues?.PhysicalRejectBill_2?.toString(),
                PHYSICAL_RETRACT_BILL_2: PhysicalbillingInitialValues?.PhysicalRetractBill_2?.toString(),
                PHYSICAL_REMAINING_BILL_2: PhysicalbillingInitialValues?.PhysicalRemainingBill_2?.toString(),
                PHYSICAL_TOTAL_AMOUNT_2: PhysicalbillingInitialValues?.PhysicalTotal_2?.toString(),
                PHYSICAL_BILL_2: PhysicalbillingInitialValues?.PhysicalBill_2?.toString(),
                PHYSICAL_REJECT_BILL_3: PhysicalbillingInitialValues?.PhysicalRejectBill_3?.toString(),
                PHYSICAL_RETRACT_BILL_3: PhysicalbillingInitialValues?.PhysicalRetractBill_3?.toString(),
                PHYSICAL_REMAINING_BILL_3: PhysicalbillingInitialValues?.PhysicalRemainingBill_3?.toString(),
                PHYSICAL_TOTAL_AMOUNT_3: PhysicalbillingInitialValues?.PhysicalTotal_3?.toString(),
                PHYSICAL_BILL_3: PhysicalbillingInitialValues?.PhysicalBill_3?.toString(),
                LOGICAL_REJECT_BILL_1: LogicalBillingInitialValues?.LogicalRejectBill_1?.toString(),
                LOGICAL_RETRACT_BILL_1: LogicalBillingInitialValues?.LogicalRetractBill_1?.toString(),
                LOGICAL_REMAINING_BILL_1: LogicalBillingInitialValues?.LogicalRemainingBill_1?.toString(),
                LOGICAL_TOTAL_AMOUNT_1: LogicalBillingInitialValues?.LogicalTotal_1?.toString(),
                LOGICAL_BILL_1: LogicalBillingInitialValues?.LogicalBill_1?.toString(),
                LOGICAL_REJECT_BILL_2: LogicalBillingInitialValues?.LogicalRejectBill_2?.toString(),
                LOGICAL_RETRACT_BILL_2: LogicalBillingInitialValues?.LogicalRetractBill_2?.toString(),
                LOGICAL_REMAINING_BILL_2: LogicalBillingInitialValues?.LogicalRemainingBill_2?.toString(),
                LOGICAL_TOTAL_AMOUNT_2: LogicalBillingInitialValues?.LogicalTotal_2?.toString(),
                LOGICAL_BILL_2: LogicalBillingInitialValues?.LogicalBill_2?.toString(),
                LOGICAL_REJECT_BILL_3: LogicalBillingInitialValues?.LogicalRetractBill_3?.toString(),
                LOGICAL_RETRACT_BILL_3: LogicalBillingInitialValues?.LogicalRetractBill_3?.toString(),
                LOGICAL_REMAINING_BILL_3: LogicalBillingInitialValues?.LogicalRemainingBill_3?.toString(),
                LOGICAL_TOTAL_AMOUNT_3: LogicalBillingInitialValues?.LogicalTotal_3?.toString(),
                LOGICAL_BILL_3: LogicalBillingInitialValues?.LogicalBill_3?.toString(),
                REPLISH_BILL_1: ReplishInitialValues?.ReplishBill_1?.toString(),
                REPLISH_COUNT_BILL_1: ReplishInitialValues?.ReplishCountBill_1?.toString(),
                REPLISH_BILL_2: ReplishInitialValues?.ReplishBill_2?.toString(),
                REPLISH_COUNT_BILL_2: ReplishInitialValues?.ReplishCountBill_2?.toString(),
                REPLISH_BILL_3: ReplishInitialValues?.ReplishBill_3?.toString(),
                REPLISH_COUNT_BILL_3: ReplishInitialValues?.ReplishCountBill_3?.toString(),
                REPLISH_BILL_4: ReplishInitialValues?.ReplishBill_4?.toString(),
                REPLISH_COUNT_BILL_4: ReplishInitialValues?.ReplishCountBill_4?.toString(),
                IBSDRSERIAL: data?.IBSDRSERIAL,
                IBSCRSERIAL: data?.IBSCRSERIAL,
                TOTALCASHWITHDRAWAMOUNT: data?.TOTALCASHWITHDRAWAMOUNT?.toString(),
                ENTRYBY: getItemFromStorage('auth').name,
                AUTHORISEDBY: getItemFromStorage('auth').Role
            }
        }
        else if (watch('buttonType') === "update") {
            url = endpoint.updateReplenish;
            title = "Are you sure to update?"
            successMessage = "Record is successfully updated"
            payload = {
                CS_REPLINSHMODEL_ID: formFields?.CS_REPLINSHMODEL_ID,
                TID: data.TID,
                SORT_ORDER: null,
                IS_ACTIVE: "1",
                TOTALCASHWITHDRAWAMOUNT: data?.TOTALCASHWITHDRAWAMOUNT?.toString(),
                AUTHORISEDBY: getItemFromStorage('auth').Role
            }

        }
        else {
            url = endpoint.deleteReplenish;
            title = "Are you sure, you want to delete?"
            successMessage = "Record is successfully deleted."
            payload = {
                "ReplenishID": formFields?.CS_REPLINSHMODEL_ID,
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
        TOTALCASHWITHDRAWAMOUNT: '',
        IBSDRSERIAL: '',
        IBSCRSERIAL: '',
        buttonType: ''
    }

    const { register, handleSubmit, control, formState: { errors }, setValue, reset, watch } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });

    const formatValue = (value: any) => {
        return value == 0 ? ' ' : value
    }

    const handlePhysicalBillingOnChange = useCallback((name: string, value: number) => {
        setPhysicalbillingInitialValues((old) => ({ ...old, [name]: value }));
        setPhysicalbillingInitialValues((old) => ({
            ...old,
            PhysicalTotal_1: Number(old.PhysicalBill_1) * (Number(old.PhysicalRejectBill_1) + Number(old.PhysicalRetractBill_1) + Number(old.PhysicalRemainingBill_1)),
            PhysicalTotal_2: Number(old.PhysicalBill_2) * (Number(old.PhysicalRejectBill_2) + Number(old.PhysicalRetractBill_2) + Number(old.PhysicalRemainingBill_2)),
            PhysicalTotal_3: Number(old.PhysicalBill_3) * (Number(old.PhysicalRejectBill_3) + Number(old.PhysicalRetractBill_3) + Number(old.PhysicalRemainingBill_3)),
        }));
        setPhysicalbillingInitialValues((old) => ({ ...old, PhysicalTotalAmount: (Number(old.PhysicalTotal_1) + Number(old.PhysicalTotal_2) + Number(old.PhysicalTotal_3)).toString() }));
    }, [PhysicalbillingInitialValues])

    const handleLogicalBillingOnChange = useCallback((name: string, value: number) => {
        setLogicalBillingInitialValues((old) => ({ ...old, [name]: value }));
        setLogicalBillingInitialValues((old) => ({
            ...old,
            LogicalTotal_1: Number(old.LogicalBill_1) * (Number(old.LogicalRejectBill_1) + Number(old.LogicalRetractBill_1) + Number(old.LogicalRemainingBill_1)),
            LogicalTotal_2: Number(old.LogicalBill_2) * (Number(old.LogicalRejectBill_2) + Number(old.LogicalRetractBill_2) + Number(old.LogicalRemainingBill_2)),
            LogicalTotal_3: Number(old.LogicalBill_3) * (Number(old.LogicalRejectBill_3) + Number(old.LogicalRemainingBill_3) + Number(old.LogicalRemainingBill_3)),
        }));
        setLogicalBillingInitialValues((old) => ({ ...old, LogicalTotalAmount: (Number(old.LogicalTotal_1) + Number(old.LogicalTotal_2) + Number(old.LogicalTotal_3)).toString() }));
    }, [LogicalBillingInitialValues]);

    const handleReplishAmountOnChange = useCallback((name: string, value: number) => {
        setReplishInitialValues((old) => ({ ...old, [name]: value }));
        setReplishInitialValues((old) => ({
            ...old,
            ReplishTotal_1: Number(old.ReplishBill_1) * Number(old.ReplishCountBill_1),
            ReplishTotal_2: Number(old.ReplishBill_2) * Number(old.ReplishCountBill_2),
            ReplishTotal_3: Number(old.ReplishBill_3) * Number(old.ReplishCountBill_3),
            ReplishTotal_4: Number(old.ReplishBill_4) * Number(old.ReplishCountBill_4)
        }));
        setReplishInitialValues((old) => ({ ...old, ReplishTotalAmount: (Number(old.ReplishTotal_1) + Number(old.ReplishTotal_2) + Number(old.ReplishTotal_3) + Number(old.ReplishTotal_4)).toString() }));
    }, [ReplishInitialValues]);

    const resetBillingData = () => {
        setPhysicalbillingInitialValues(PhysicalBillingValues);
        setLogicalBillingInitialValues(LogicalBillingValues);
        setReplishInitialValues(ReplinshmentValues);
    }

    // Bind data to form fields
    useEffect(() => {
        if (mode === 'edit' && formFields) {
            for (const field in initialFormValues) {
                if (initialFormValues.hasOwnProperty(field)) {
                    setValue(field as keyof typeof initialFormValues, formFields[field]);
                }
            }
            setPhysicalbillingInitialValues((old) => ({
                ...old,
                PhysicalBill_1: formFields?.PHYSICAL_BILL_1,
                PhysicalRejectBill_1: formFields?.PHYSICAL_REJECT_BILL_1,
                PhysicalRetractBill_1: formFields?.PHYSICAL_RETRACT_BILL_1,
                PhysicalRemainingBill_1: formFields?.PHYSICAL_REMAINING_BILL_1,
                PhysicalTotal_1: Number(formFields?.PHYSICAL_BILL_1) * (Number(formFields?.PHYSICAL_REJECT_BILL_1) + Number(formFields?.PHYSICAL_RETRACT_BILL_1) + Number(formFields?.PHYSICAL_REMAINING_BILL_1)),
                PhysicalBill_2: formFields?.PHYSICAL_BILL_2,
                PhysicalRejectBill_2: formFields?.PHYSICAL_REJECT_BILL_2,
                PhysicalRetractBill_2: formFields?.PHYSICAL_RETRACT_BILL_2,
                PhysicalRemainingBill_2: formFields?.PHYSICAL_REMAINING_BILL_2,
                PhysicalTotal_2: Number(formFields?.PHYSICAL_BILL_2) * (Number(formFields?.PHYSICAL_REJECT_BILL_2) + Number(formFields?.PHYSICAL_RETRACT_BILL_2) + Number(formFields?.PHYSICAL_REMAINING_BILL_2)),
                PhysicalBill_3: formFields?.PHYSICAL_BILL_3,
                PhysicalRejectBill_3: formFields?.PHYSICAL_REJECT_BILL_3,
                PhysicalRetractBill_3: formFields?.PHYSICAL_RETRACT_BILL_3,
                PhysicalRemainingBill_3: formFields?.PHYSICAL_REMAINING_BILL_3,
                PhysicalTotal_3: Number(formFields?.PHYSICAL_BILL_3) * (Number(formFields?.PHYSICAL_REJECT_BILL_3) + Number(formFields?.PHYSICAL_RETRACT_BILL_3) + Number(formFields?.PHYSICAL_REMAINING_BILL_3))
            }))
            setPhysicalbillingInitialValues((old) => ({
                ...old,
                PhysicalTotalAmount: (Number(old.PhysicalTotal_1) + Number(old.PhysicalTotal_2) + Number(old.PhysicalTotal_3)).toString()
            }))

            setLogicalBillingInitialValues((old) => ({
                ...old,
                LogicalBill_1: formFields?.LOGICAL_BILL_1,
                LogicalRejectBill_1: formFields?.LOGICAL_REJECT_BILL_1,
                LogicalRetractBill_1: formFields?.LOGICAL_RETRACT_BILL_1,
                LogicalRemainingBill_1: formFields?.LOGICAL_REMAINING_BILL_1,
                LogicalTotal_1: Number(formFields?.LOGICAL_BILL_1) * (Number(formFields?.LOGICAL_REJECT_BILL_1) + Number(formFields?.LOGICAL_RETRACT_BILL_1) + Number(formFields?.LOGICAL_REMAINING_BILL_1)),
                LogicalBill_2: formFields?.LOGICAL_BILL_2,
                LogicalRejectBill_2: formFields?.LOGICAL_REJECT_BILL_2,
                LogicalRetractBill_2: formFields?.LOGICAL_RETRACT_BILL_2,
                LogicalRemainingBill_2: formFields?.LOGICAL_REMAINING_BILL_2,
                LogicalTotal_2: Number(formFields?.LOGICAL_BILL_2) * (Number(formFields?.LOGICAL_REJECT_BILL_2) + Number(formFields?.LOGICAL_RETRACT_BILL_2) + Number(formFields?.LOGICAL_REMAINING_BILL_2)),
                LogicalBill_3: formFields?.LOGICAL_BILL_3,
                LogicalRejectBill_3: formFields?.LOGICAL_REJECT_BILL_3,
                LogicalRetractBill_3: formFields?.LOGICAL_RETRACT_BILL_3,
                LogicalRemainingBill_3: formFields?.LOGICAL_REMAINING_BILL_3,
                LogicalTotal_3: Number(formFields?.LOGICAL_BILL_3) * (Number(formFields?.LOGICAL_REJECT_BILL_3) + Number(formFields?.LOGICAL_RETRACT_BILL_3) + Number(formFields?.LOGICAL_REMAINING_BILL_3))
            }))
            setLogicalBillingInitialValues((old) => ({
                ...old,
                LogicalTotalAmount: (Number(old.LogicalTotal_1) + Number(old.LogicalTotal_2) + Number(old.LogicalTotal_3)).toString()
            }))

            setReplishInitialValues((old) => ({
                ...old,
                ReplishBill_1: formFields?.REPLISH_BILL_1,
                ReplishCountBill_1: formFields?.REPLISH_COUNT_BILL_1,
                ReplishTotal_1: Number(formFields?.REPLISH_BILL_1) * Number(formFields?.REPLISH_COUNT_BILL_1),
                ReplishBill_2: formFields?.REPLISH_BILL_2,
                ReplishCountBill_2: formFields?.REPLISH_COUNT_BILL_2,
                ReplishTotal_2: Number(formFields?.REPLISH_BILL_2) * Number(formFields?.REPLISH_COUNT_BILL_2),
                ReplishBill_3: formFields?.REPLISH_BILL_3,
                ReplishCountBill_3: formFields?.REPLISH_COUNT_BILL_3,
                ReplishTotal_3: Number(formFields?.REPLISH_BILL_3) * Number(formFields?.REPLISH_COUNT_BILL_3),
                ReplishBill_4: formFields?.REPLISH_BILL_4,
                ReplishCountBill_4: formFields?.REPLISH_COUNT_BILL_4,
                ReplishTotal_4: Number(formFields?.REPLISH_BILL_4) * Number(formFields?.REPLISH_COUNT_BILL_4)
            }))
            setReplishInitialValues((old) => ({
                ...old,
                ReplishTotalAmount: (Number(old.ReplishTotal_1) + Number(old.ReplishTotal_2) + Number(old.ReplishTotal_3) + Number(old.ReplishTotal_4)).toString()
            }))
        }
        else {
            reset(initialFormValues);
            resetBillingData()
        }
    }, [mode, formFields, setValue]);

    const checkLoading = () => {
        if ((mode === 'edit' && Replishid && isLoading) || isProcessing) {
            return true;
        }
        return false;
    }

    return (
        <Box sx={{
            padding: '15px 20px',
            position: 'relative'
        }}>
            <LoaderWithBackdrop open={checkLoading()} />
            <Typography variant='subtitle1' fontSize={14} sx={{
                padding: '3px 5px',
                background: '#d9d2ff',
                borderRadius: '5px'
            }}>
                ATM Replenishment

            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#'>
                <Grid container columnSpacing={2} alignItems={'center'} padding={'15px'}>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >ATM ID <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'TID')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <TextFieldBox
                            disabled={mode === 'edit'}
                            error={errors.TID?.message && true}
                            helperText={errors.TID?.message && errors.TID?.message.toString()}
                            {...register('TID')}
                        />
                    </Grid>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >ATM Description</Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <TextFieldBox
                            disabled={mode === 'edit'}
                            error={errors.ATMDESC?.message && true}
                            helperText={errors.ATMDESC?.message && errors.ATMDESC?.message.toString()}
                            {...register('ATMDESC')}
                        />
                    </Grid>
                </Grid>
                {/* Physical Block */}
                <Box component="fieldset" sx={{
                    borderColor: '#d9d2ff',
                    borderRadius: '3px',
                    padding: '15px',
                    marginTop: '15px',
                    borderWidth: '1px',
                }}>
                    <legend>Physical</legend>
                    <Grid container columnSpacing={2} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Billing Amount </Typography>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Reject Count</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Retract Count</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Remaining Count</Typography>
                        </Grid>
                        <Grid item xs={3} md={3} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Total Amount</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                value={formatValue(PhysicalbillingInitialValues.PhysicalBill_1)}
                                disabled={true}
                                type='number'
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRejectBill_1)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRejectBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRetractBill_1)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRetractBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRemainingBill_1)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRemainingBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalTotal_1)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                value={formatValue(PhysicalbillingInitialValues.PhysicalBill_2)}
                                disabled={true}
                                type='number'
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRejectBill_2)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRejectBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRetractBill_2)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRetractBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRemainingBill_2)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRemainingBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalTotal_2)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                value={formatValue(PhysicalbillingInitialValues.PhysicalBill_3)}
                                disabled={true}
                                type='number'
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRejectBill_3)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRejectBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRetractBill_3)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRetractBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalRemainingBill_3)}
                                onChange={(e) => handlePhysicalBillingOnChange("PhysicalRemainingBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalTotal_3)}
                            />
                        </Grid>

                        {/* Empty Space Taking */}
                        <Grid item xs={9}></Grid>

                        <Grid item xs={3} md={3} mt={2}>
                            <Typography variant='subtitle1' fontSize={14} >TOTAL AMOUNT</Typography>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(PhysicalbillingInitialValues.PhysicalTotalAmount)}
                            />
                        </Grid>
                    </Grid>
                </Box>
                {/* Logical Block */}
                <Box component="fieldset" sx={{
                    borderColor: '#d9d2ff',
                    borderRadius: '3px',
                    padding: '15px',
                    marginTop: '25px',
                    borderWidth: '1px',
                }}>
                    <legend>Logical</legend>
                    <Grid container columnSpacing={2} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Billing Amount</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Reject Count</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Retract Count</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Remaining Count</Typography>
                        </Grid>
                        <Grid item xs={3} md={3} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Total Amount</Typography>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                value={formatValue(LogicalBillingInitialValues.LogicalBill_1)}
                                disabled={true}
                                type='number'
                                onChange={(e) => handleLogicalBillingOnChange("LogicalBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRejectBill_1)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRejectBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRetractBill_1)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRetractBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRemainingBill_1)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRemainingBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalTotal_1)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                value={formatValue(LogicalBillingInitialValues.LogicalBill_2)}
                                disabled={true}
                                type='number'
                                onChange={(e) => handleLogicalBillingOnChange("LogicalBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRejectBill_2)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRejectBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRetractBill_2)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRetractBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRemainingBill_2)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRemainingBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalTotal_2)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                value={formatValue(LogicalBillingInitialValues.LogicalBill_3)}
                                disabled={true}
                                type='number'
                                onChange={(e) => handleLogicalBillingOnChange("LogicalBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRejectBill_3)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRejectBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRetractBill_3)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRetractBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalRemainingBill_3)}
                                onChange={(e) => handleLogicalBillingOnChange("LogicalRemainingBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalTotal_3)}
                            />
                        </Grid>

                        {/* Empty Space Taking */}
                        <Grid item xs={9}></Grid>

                        <Grid item xs={3} md={3} mt={2}>
                            <Typography variant='subtitle1' fontSize={14} >TOTAL AMOUNT</Typography>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(LogicalBillingInitialValues.LogicalTotalAmount)}
                            />
                        </Grid>

                    </Grid>
                </Box>
                <Box component="div" sx={{
                    borderColor: '#d9d2ff',
                    borderRadius: '3px',
                    padding: '0px',
                    marginTop: '25px',
                    borderWidth: '1px',
                }}>
                    <Grid container columnSpacing={2} alignItems={'center'} padding={'10px'}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Total Withdraw</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <TextFieldBox
                                error={errors.TOTALCASHWITHDRAWAMOUNT?.message && true}
                                helperText={errors.TOTALCASHWITHDRAWAMOUNT?.message && errors.TOTALCASHWITHDRAWAMOUNT?.message.toString()}
                                {...register('TOTALCASHWITHDRAWAMOUNT')}
                            />
                        </Grid>
                        {/* Empty Space Taking */}
                        <Grid item xs={7}></Grid>
                    </Grid>

                    <Grid container columnSpacing={2} alignItems={'center'} padding={'10px'}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Cassette 1 : </Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishBill_1)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishCountBill_1)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishCountBill_1", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishTotal_1)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} mt={3}>Cassette 2 : </Typography>
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishBill_2)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishCountBill_2)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishCountBill_2", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishTotal_2)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} mt={3}>Cassette 3 : </Typography>
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishBill_3)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishCountBill_3)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishCountBill_3", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishTotal_3)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} mt={3}>Cassette 4 : </Typography>
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishBill_4)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishBill_4", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishCountBill_4)}
                                onChange={(e) => handleReplishAmountOnChange("ReplishCountBill_4", Number(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishTotal_4)}
                            />
                        </Grid>
                        {/* Empty Space Taking */}
                        <Grid item xs={8}></Grid>
                        <Grid item xs={3} md={3} mt={2}>
                            <Typography variant='subtitle1' fontSize={14} >TOTAL AMOUNT</Typography>
                            <TextFieldBox
                                disabled={true}
                                type='number'
                                value={formatValue(ReplishInitialValues.ReplishTotalAmount)}
                            />
                        </Grid>
                        {/* Serial Numbers */}
                        <Grid item xs={3} md={3} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Debit IBS Serial Number</Typography>
                            <TextFieldBox
                                disabled={checkStatus()}
                                error={errors.IBSDRSERIAL?.message && true}
                                type='text'
                                helperText={errors.IBSDRSERIAL?.message && errors.IBSDRSERIAL?.message.toString()}
                                {...register('IBSDRSERIAL')}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Credit IBS Serial Number </Typography>
                            <TextFieldBox
                                disabled={checkStatus()}
                                error={errors.IBSCRSERIAL?.message && true}
                                type='text'
                                helperText={errors.IBSCRSERIAL?.message && errors.IBSCRSERIAL?.message.toString()}
                                {...register('IBSCRSERIAL')}
                            />
                        </Grid>
                    </Grid>
                </Box>
                
                <Box display={'flex'} justifyContent={'flex-end'} margin={'10px 0'} gap={1}>
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
                    <Button type="button" variant='contained' color='info'
                        onClick={() => {
                            reset();
                            resetBillingData();
                            setSearchParams(new URLSearchParams());
                            setOpenDrawer(false)
                        }}>Reset <RestartAlt />
                    </Button>
                </Box>
            </form >
        </Box >
    );
}
export default CreateReplinshment;