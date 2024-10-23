import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button, Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import React, { useEffect } from "react";
import TextFieldBox from '../../components/TextFieldBox';
import { FormSelectBox } from '../../components/SelectBox';
import { AdjustmentIn, AdjustmentReasonList, CardTypeList } from '@/utils/commonData';
import { RestartAlt, Cancel, AddCircle } from '@mui/icons-material';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoaderWithBackdrop } from '@/components/Loader';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { getItemFromStorage } from '@/utils/auth';
import { LuhnCheckValidation, WordCountValidation, isFieldRequired, removeTabIndex } from '@/utils/common';
import { theme } from '@/styles/GlobalStyle';
import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';
import { getValue } from '@mui/system';

type Props = {
    setOpenDrawer: (val: boolean) => void;
    setLoading: (val: boolean) => void;
    refetchAPI: (val: boolean) => void;
}
const MySwal = withReactContent(Swal);
const schema = yup
    .object()
    .shape({
        AdjustmentReason: yup.string().required(),
        BranchCode: yup.string().required(),
        EmailSubject: yup.string()
            .test('len', val => WordCountValidation(val, 0, 300).message, val => WordCountValidation(val, 0, 300).valid),
        TicketNumber: yup.string(),
        CardNo: yup.string()
            .when('AdjustmentReason', {
                is: 'Issued Card by Card OPS',
                then: () => yup.string().required('This field is required')
                    .test('len', val => LuhnCheckValidation(val).message, val => LuhnCheckValidation(val).valid),
            })
            .when('AdjustmentReason', {
                is: 'System Error (+)',
                then: () => yup.string().required('This field is required')
                    .test('len', val => LuhnCheckValidation(val).message, val => LuhnCheckValidation(val).valid),
            })
            .when('AdjustmentReason', {
                is: 'System Error (-)',
                then: () => yup.string().required('This field is required')
                    .test('len', val => LuhnCheckValidation(val).message, val => LuhnCheckValidation(val).valid),
            }),
        CardTotal: yup.string().required(),
        CardBin: yup.string().required()
            .test('len', val => WordCountValidation(val, 8, 8).message, val => WordCountValidation(val, 8, 8).valid),
        AppID: yup.string()
            .test('len', val => WordCountValidation(val, 7, 7).message, val => WordCountValidation(val, 7, 7).valid),
        CardType: yup.string().required(),
        CardTypeDesc: yup.string()
            .test('len', val => WordCountValidation(val, 0, 100).message, val => WordCountValidation(val, 0, 100).valid),
        Remark: yup.string()
            .test('len', val => WordCountValidation(val, 0, 300).message, val => WordCountValidation(val, 0, 300).valid),
    })
    .required();
const CreateCardAdjustment: React.FC<Props> = ({ setOpenDrawer, setLoading, refetchAPI }) => {
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const { setStillLoading } = useCommonDataContext();
    const { data: BranchList } = useQueryListData({
        queryKey: "fetchBranchList",
        url: `${endpoint.getBranchList}`,
    });
    const BranchCodes = BranchList?.data?.Data?.BranchInfo?.map((x: any) => ({
        name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
        value: x.BRANCH_CODE
    }));

    const onSubmit = (data: any) => {
        let ActionStatus = AdjustmentIn.includes(data.AdjustmentReason) ? "IN" : "OUT";
        const payload = {
            Qty: ActionStatus === "IN" ? data.CardTotal : data.CardTotal * -1,
            CardNumber: data.CardNo,
            CardBin: data.CardBin,
            CardType: data.CardType,
            CardTypeDesc: data.CardTypeDesc,
            BranchCode: data.BranchCode,
            ApplicationId: data.AppID,
            ActionUser: getItemFromStorage('auth').name, // Add current login user name
            ActionStatus: ActionStatus,
            ActionType: data.AdjustmentReason,
            StockActionType: "ADJUSTMENT",
            Remark: data.Remark,
            CreatedUserId: getItemFromStorage('auth').LoginId, // Add current login user id
            EmailSubject: data.EmailSubject,
            TicketNo: data.TicketNumber,
            Monthly: null,
            CreatedDate: new Date().toISOString(),
        }
        MySwal.fire({
            html: "Do you agree to create?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Agree",
            cancelButtonText: "Not Agree",
            confirmButtonColor: theme.palette.primary.main,
            cancelButtonColor: theme.palette.error.main,
            iconColor: theme.palette.warning.main,
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                setStillLoading(true);
                mutate(
                    {
                        url: endpoint.saveCardAdjustment,
                        body: payload
                    },
                    {
                        onSuccess: (data) => {
                            if (data?.status == 200 || data?.status == 201 || data?.status == 202) {
                                MySwal.fire({
                                    html: "Record is successfully created",
                                    icon: 'success',
                                    width: 400,
                                    didOpen: removeTabIndex,
                                }).then(() => {
                                    setLoading(false);
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
                                }).then(()=>{
                                    setLoading(false);
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
        AdjustmentReason: 'Issued Card by Card OPS',
        BranchCode: '',
        EmailSubject: '',
        TicketNumber: '',
        CardNo: '',
        CardTotal: '',
        CardBin: '',
        AppID: '',
        CardType: '',
        CardTypeDesc: '',
        Remark: '',
    }

    const { register, handleSubmit, control, formState: { errors }, watch, getValues, reset } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });
    const AdjustmentReason = watch("AdjustmentReason");
    // Bind data to form fields
    useEffect(() => {
        reset(initialFormValues);
    }, [refetchAPI]);

    return (
        <Box sx={{
            padding: '15px 30px',
            position: 'relative'
        }}>
            <Typography variant='subtitle1' fontSize={14} sx={{
                padding: '3px 5px',
                background: '#d9d2ff',
                borderRadius: '5px'
            }}>
                CREATE CARD ADJUSTMENT
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#'>
                <Grid container columnSpacing={2} mt={3} alignItems={'center'} justifyContent={'space-between'}>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Adjustment Reason <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'AdjustmentReason')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.AdjustmentReason?.message ? true : false}>
                            <Controller
                                name="AdjustmentReason"
                                control={control}
                                render={({ field }) => (
                                    <FormSelectBox
                                        field={field}
                                        error={errors.AdjustmentReason?.message ? true : false}
                                        {...register('AdjustmentReason')}
                                        items={AdjustmentReasonList}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.AdjustmentReason?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Branch Code <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'BranchCode')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
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
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2} >
                        <Typography variant='subtitle1' fontSize={14} >Ticket Number <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'TicketNumber')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4} mt={2}>
                        <TextFieldBox
                            error={errors.TicketNumber?.message && true}
                            helperText={errors.TicketNumber?.message && errors.TicketNumber?.message.toString()}
                            {...register('TicketNumber')}
                        />
                    </Grid>
                    {(AdjustmentReason === "System Error (+)" ||
                        AdjustmentReason === "System Error (-)" ||
                        AdjustmentReason === "Issued Card by Card OPS") && (
                            <>
                                <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                                    <Typography variant='subtitle1' fontSize={14} >Card Number <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardNo')}} ></span></Typography>
                                </Grid>
                                <Grid item xs={4} md={4} mt={2}>
                                    <TextFieldBox
                                        type='number'
                                        error={errors.CardNo?.message && true}
                                        helperText={errors.CardNo?.message && errors.CardNo?.message.toString()}
                                        {...register('CardNo')}
                                    />
                                </Grid>
                            </>
                        )}
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card Bin <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardBin')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4} mt={2}>
                        <TextFieldBox
                            error={errors.CardBin?.message && true}
                            helperText={errors.CardBin?.message && errors.CardBin?.message.toString()}
                            {...register('CardBin')}
                        />
                    </Grid>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card Total <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardTotal')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4} mt={2}>
                        <TextFieldBox
                            type='number'
                            error={errors.CardTotal?.message && true}
                            helperText={errors.CardTotal?.message && errors.CardTotal?.message.toString()}
                            {...register('CardTotal')}
                        />
                    </Grid>
                    {(AdjustmentReason === "System Error (+)" ||
                        AdjustmentReason === "System Error (-)" ||
                        AdjustmentReason === "Issued Card by Card OPS") && (
                            <>
                                <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                                    <Typography variant='subtitle1' fontSize={14} >Application ID <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'AppID')}} ></span></Typography>
                                </Grid>
                                <Grid item xs={4} md={4} mt={2}>
                                    <TextFieldBox
                                        type='number'
                                        error={errors.AppID?.message && true}
                                        helperText={errors.AppID?.message && errors.AppID?.message.toString()}
                                        {...register('AppID')}
                                    />
                                </Grid>
                            </>
                        )}
                    <Grid item xs={2} md={2} mt={2} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Card Type <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardType')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={4} md={4} mt={2}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.CardType?.message ? true : false}>
                            <Controller
                                name="CardType"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormSelectBox
                                        field={field}
                                        error={errors.CardType?.message ? true : false}
                                        {...register('CardType')}
                                        items={CardTypeList}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.CardType?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Email Subject <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'EmailSubject')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={8} md={8} mt={2}>
                        <TextFieldBox
                            multiline={true}
                            rows={2}
                            error={errors.EmailSubject?.message && true}
                            helperText={errors.EmailSubject?.message && errors.EmailSubject?.message.toString()}
                            {...register('EmailSubject')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card Type Description <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardTypeDesc')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={8} md={8} mt={2}>
                        <TextFieldBox
                            multiline={true}
                            rows={2}
                            error={errors.CardTypeDesc?.message && true}
                            helperText={errors.CardTypeDesc?.message && errors.CardTypeDesc?.message.toString()}
                            {...register('CardTypeDesc')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2} md={2} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Remark</Typography>
                    </Grid>
                    <Grid item xs={8} md={8} mt={2}>
                        <TextFieldBox
                            multiline={true}
                            rows={2}
                            error={errors.Remark?.message && true}
                            helperText={errors.Remark?.message && errors.Remark?.message.toString()}
                            {...register('Remark')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                </Grid>

                <Box display={'flex'} justifyContent={'flex-end'} margin={'10px 0'} gap={1}>
                    <LoadingButtonComponent
                        isLoading={isProcessing}
                        type="submit"
                        btnText={'Create'}
                        disabled={false}
                        endIcon={<AddCircle />}
                        style={{
                            width: '90px',
                            lineHeight: 0.7,
                            margin: '0 10px',
                            fontSize: '14px',
                        }}
                    />
                    <Button type="button" variant='contained' color='info' onClick={() => { reset() }}>Reset <RestartAlt></RestartAlt></Button>
                    <Button type="button" variant='contained' color='error' onClick={() => {
                        reset();
                        setOpenDrawer(false)
                    }}>Cancel <Cancel></Cancel></Button>
                </Box>
            </form >
        </Box >
    );
}
export default CreateCardAdjustment;