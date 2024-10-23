import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button, FormHelperText, FormControl, Checkbox, FormControlLabel, Switch } from '@mui/material';
import TextFieldBox from '../../components/TextFieldBox';
import { AddCircle, RestartAlt, Beenhere, CancelOutlined, BookmarkBorder, Bookmark as BookmarkIcon, CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoaderWithBackdrop } from '@/components/Loader';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { getItemFromStorage } from '@/utils/auth';
import { AmountValidation, LuhnCheckValidation, isFieldRequired, removeTabIndex } from '@/utils/common';
import { theme } from '@/styles/GlobalStyle';
import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';
import { FormSelectBox } from '@/components/SelectBox';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Props = {
    setOpenDrawer: (val: boolean) => void;
    refetchAPI: (val: boolean) => void;
    mode?: string;
}
const MySwal = withReactContent(Swal);
const schema = yup
    .object()
    .shape({
        CardNumber: yup.string()
            .required()
            .test('len', val => LuhnCheckValidation(val).message, val => LuhnCheckValidation(val).valid),
        BranchCode: yup.string().required(),
        EmbossName: yup.string(),
        TopupAmount: yup.string().required(),
        verifyCard: yup.boolean().oneOf([true], 'Verify Card To Check Maximum Topup Amount'),
        buttonType: yup.string()
    })
    .required();
const TopUpForm: React.FC<Props> = ({ setOpenDrawer, mode = 'create', refetchAPI }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const TopupId = searchParams.get('TopupId');
    const auth = getItemFromStorage('auth');
    const isMaker = auth?.Role?.toUpperCase() === "MAKER";
    const isChecker = auth?.Role?.toUpperCase() === "CHECKER";
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const { mutate: BalanceMutate, isLoading: isFetching } = useMutateQuery();
    const { setStillLoading } = useCommonDataContext();
    const [maxAmt, setMaxAmt] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [verifyCardChecked, setVerifyCardChecked] = useState(false);
    const [availableBal, setAvailableBal] = useState("");
    const { data, isLoading } = useQueryListData({
        queryKey: "fetchTopupById",
        url: `${endpoint.getToupById}`,
        payload: {
            TopupId: TopupId,
        },
        config: {
            enabled: !!TopupId,
        },
    });
    const [cardNoValidate, setCardNoValidate] = useState({
        valid: true,
        message: ""
    });
    const formFields = data?.data?.Data?.PrepaidTopup;
    const { data: BranchList } = useQueryListData({
        queryKey: "fetchAllBranches",
        url: `${endpoint.getBranchList}`,
    });
    const BRANCHList = BranchList?.data?.Data?.BranchInfo?.map((x: any) => ({
        name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
        value: x.BRANCH_CODE
    }));

    const onSubmit = (data: any) => {
        let filterBranch = BRANCHList?.filter((x: any) => x.value === data?.BranchCode);
        let branchName = "";
        if (filterBranch) {
            branchName = filterBranch[0]?.name?.split(' | ')[1];
        }
        let url = "TopupSubmitted";
        let title = "Do you agree to create?";
        let confrimBtnText = "YES";
        let cancelBtnText = "NO";
        let successMessage = "Record is successfully created";
        var payload = {}

        if (watch('buttonType') === "submit") {
            url = endpoint.topupFormSubmit;
            confrimBtnText = "Agree";
            cancelBtnText = "Not Agree";
            payload = {
                CardNumber: data?.CardNumber,
                BranchCode: data?.BranchCode,
                BranchName: branchName,
                TopupAmount: data?.TopupAmount ? Number(data?.TopupAmount) : 0,
                CreatedUserId: auth?.LoginId,
                TopupStatus: ""
            }
        }
        else {
            url = endpoint.topupFormApprove
            title = "Are you sure to approve?"
            successMessage = "Record is successfully approved"
            payload = {
                CardNumber: data?.CardNumber,
                BranchCode: data?.BranchCode,
                BranchName: branchName,
                TopupAmount: data?.TopupAmount ? Number(data?.TopupAmount) : 0,
                CreatedUserId: auth?.LoginId,
                TopupId: formFields?.TopupId,
                UpdatedUserId: auth?.LoginId,
                UpdatedUserName: auth?.name,
                CreatedUserName: auth?.name,
                TopupStatus: ""
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
        }).then((result) => {
            if (result.isConfirmed) {
                setStillLoading(true);
                mutate(
                    {
                        url: url,
                        body: payload,
                        baseURL: import.meta.env.VITE_APP_ISSUE_API_URL
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
                                    setVerifyCardChecked(false);
                                    setAlertMsg("");
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
        CardNumber: '',
        BranchCode: auth?.branchCode as string,
        EmbossName: '',
        TopupAmount: '',
        verifyCard: false,
        buttonType: ''
    }

    const { register, handleSubmit, control, formState: { errors }, setValue, reset, watch, clearErrors } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });

    const checkLoading = () => {
        if ((mode === 'edit' && TopupId && isLoading) || isProcessing || isFetching) {
            return true;
        }
        return false;
    }

    const checkMaxAmount = (value: number) => {
        if (value <= 0) {
            setMaxAmt(import.meta.env.VITE_APP_MAX_TOPUP_AMT);
            setAlertMsg(`Maximum topup amount should be ${import.meta.env.VITE_APP_MAX_TOPUP_AMT}`);
        }
        else {
            const maxAvailableAmt = import.meta.env.VITE_APP_MAX_TOPUP_AMT - value;
            if (maxAvailableAmt <= 0) {
                setMaxAmt(import.meta.env.VITE_APP_MAX_TOPUP_AMT);
                setAlertMsg(`Maximum topup amount should be ${import.meta.env.VITE_APP_MAX_TOPUP_AMT}`);
            }
            else {
                setAlertMsg(`Maximum topup amount should be ${maxAvailableAmt}`);
                setMaxAmt(maxAvailableAmt);
            }
        }
    }

    const onSearch = (cardNo: any) => {
        BalanceMutate(
            {
                url: endpoint.getBalanceEnquiry,
                body: {
                    CardNo: cardNo,
                },
                baseURL: import.meta.env.VITE_APP_ISSUE_API_URL
            },
            {
                onSuccess: (data) => {
                    if (data?.status == 200) {
                        var CustBalanceEnquiry = data?.data?.Data?.CustBalanceEnquiry;
                        setValue('EmbossName', data?.data?.Data?.CustBalanceEnquiry?.CardHolderName);
                        setAvailableBal(CustBalanceEnquiry?.AvailableBalance);
                        checkMaxAmount(CustBalanceEnquiry?.AvailableBalance);
                        setValue("verifyCard", true);
                    } else {
                        setCardNoValidate(LuhnCheckValidation(watch("CardNumber")));
                        setValue("verifyCard", false);
                        // setVerifyCardChecked(false);
                        MySwal.fire({
                            html: data?.data?.Data?.ErrorMessage ?
                                data?.data?.Data?.ErrorMessage : data?.data?.Error?.Message || "Backend Service Failed",
                            icon: 'error',
                            width: 400,
                            didOpen: removeTabIndex,
                        })
                    }
                },
            }
        );
    }
    // Bind data to form fields
    useEffect(() => {
        setAlertMsg("");
        setVerifyCardChecked(false);
        setAvailableBal("");
        if (mode === 'edit' && formFields) {
            for (const field in initialFormValues) {
                if (initialFormValues.hasOwnProperty(field)) {
                    setValue(field as keyof typeof initialFormValues, formFields[field]);
                }
                if (field == "verifyCard") {
                    setValue('verifyCard', true);
                }
            }
        }
        else if(mode === 'edit' && isChecker){
            setVerifyCardChecked(true);
            setValue('verifyCard', true);
        }
        else {
            reset(initialFormValues);
        }
    }, [mode, formFields, setValue, isChecker]);

    useEffect(() => {
        if (watch("CardNumber") != '' && watch("CardNumber") && isMaker) {
            setCardNoValidate(LuhnCheckValidation(watch("CardNumber")));
            setVerifyCardChecked(false);
            setValue("verifyCard", false);
        }
    }, [watch("CardNumber"), isMaker])

     // Clear verifyCard error once it is checked true
     useEffect(() => {
        if (watch('verifyCard')) {
            clearErrors('verifyCard');
        }
    }, [watch('verifyCard'), clearErrors]);

    return (
        <Box sx={{
            padding: '15px 20px',
        }}>
            <LoaderWithBackdrop open={checkLoading()} />
            <Typography variant='subtitle1' fontSize={14} sx={{
                padding: '3px 5px',
                background: '#d9d2ff',
                borderRadius: '5px'
            }}>
                PREPAID CARD TOPUP

            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#' style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Box component={'fieldset'} sx={{
                    // background: '#eef0ff',
                    padding: '2em 1em',
                    borderRadius: '10px',
                    // border: '1px solid #c7c2c2',
                    marginTop: '2em',
                    width: '70%',
                }}>
                    <legend>TopUp Form</legend>
                    {/* <Typography variant='subtitle1' fontSize={18} textAlign={'center'} marginBottom={'1em'}>TopUp Form</Typography> */}
                    <Grid container columnSpacing={0} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item xs={3} md={3} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Card Number <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardNumber') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={9} md={9}>
                            <TextFieldBox
                                disabled={!isMaker}
                                error={errors.CardNumber?.message != "" && !cardNoValidate.valid}
                                type='number'
                                helperText={cardNoValidate.message.toString()}
                                {...register('CardNumber')}
                            />
                        </Grid>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={9} md={9}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        sx={{ padding: '10px !important' }}
                                        {...register('verifyCard')}
                                        checked={verifyCardChecked}
                                        onChange={(e) => {
                                            setValue('verifyCard', e.target.checked)
                                            setVerifyCardChecked(e.target.checked);
                                            if (e.target.checked) {
                                                onSearch(watch("CardNumber"))
                                            }
                                        }}
                                        disabled={(watch("CardNumber") == "" || isChecker) || !cardNoValidate.valid}
                                    />}
                                label="Verify Card"
                            />
                            <FormHelperText style={{ color: theme.palette.error.main }}>{ errors.verifyCard?.message && errors.verifyCard?.message.toString()}</FormHelperText>
                        </Grid>
                        {availableBal && (
                            <>
                                <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                                    <Typography variant='subtitle1' fontSize={14} >Card's Available Balance</Typography>
                                </Grid>
                                <Grid item xs={9} md={9} mt={2}>
                                    <TextFieldBox
                                        disabled={true}
                                        value={availableBal}
                                        type='string'
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                            <Typography variant='subtitle1' fontSize={14} >Card Holder Name</Typography>
                        </Grid>
                        <Grid item xs={9} md={9} mt={2}>
                            <TextFieldBox
                                disabled={true}
                                error={errors.EmbossName?.message && true}
                                type='string'
                                helperText={errors.EmbossName?.message && errors.EmbossName?.message.toString()}
                                {...register('EmbossName')}
                            />
                        </Grid>
                        <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                            <Typography variant='subtitle1' fontSize={14} >Branch Code <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'BranchCode') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={9} md={9} mt={2}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.BranchCode?.message ? true : false}>
                                <Controller
                                    name="BranchCode"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormSelectBox
                                            disabled={true}
                                            field={field}
                                            error={errors.BranchCode?.message ? true : false}
                                            {...register('BranchCode')}
                                            items={BRANCHList}
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ marginLeft: '0px' }}>{errors.BranchCode?.message?.toString()}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                            <Typography variant='subtitle1' fontSize={14} >Topup Amount (USD) <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'TopupAmount') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={9} md={9} mt={2}>
                            <TextFieldBox
                                disabled={!isMaker || !cardNoValidate.valid || watch("CardNumber") == ""}
                                error={errors.TopupAmount?.message && true}
                                type='number'
                                inputProps={{ max: maxAmt, min: 1 ,step :0.01}}
                                helperText={errors.TopupAmount?.message && errors.TopupAmount?.message.toString()}
                                {...register('TopupAmount')}
                            />
                        </Grid>
                        <Grid item xs={3} md={3}></Grid>
                        <Grid item xs={9} md={9}>
                            <span style={{ fontSize: '12px', color: theme.palette.warning.main }}>{alertMsg}</span>
                        </Grid>
                    </Grid>
                    {isMaker && mode === "create" && (
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
                                handleOnclick={() => setValue("buttonType", "submit")}
                            />
                            <Button type="button" variant='contained' color='info' onClick={() => {
                                reset();
                                setVerifyCardChecked(false);
                                setAlertMsg("");
                                setAvailableBal("");
                            }}>Reset <RestartAlt></RestartAlt></Button>
                            <Button type="button" variant='contained' color='info' onClick={() => {
                                reset();
                                setVerifyCardChecked(false);
                                setAlertMsg("");
                                setAvailableBal("");
                                setSearchParams(new URLSearchParams());
                                setOpenDrawer(false)
                            }}>Cancel <CancelOutlined sx={{ marginLeft: '3px' }} /></Button>
                        </Box>
                    )}
                    {isChecker && mode === "edit" && formFields?.TopupStatus == "Submitted" && (
                        <Box display={'flex'} justifyContent={'flex-end'} margin={'10px 0'} gap={1}>
                            <LoadingButtonComponent
                                isLoading={isProcessing}
                                type="submit"
                                btnText={'Approve'}
                                disabled={false}
                                endIcon={<Beenhere />}
                                color='success'
                                style={{
                                    width: '100px',
                                    lineHeight: 0.7,
                                    fontSize: '14px',
                                    color: '#fff'
                                }}
                                handleOnclick={() => setValue("buttonType", "approve")}
                            />

                            <Button type="button" variant='contained' color='info' onClick={() => {
                                reset();
                                setVerifyCardChecked(false);
                                setAlertMsg("");
                                setAvailableBal("");
                                setSearchParams(new URLSearchParams());
                                setOpenDrawer(false)
                            }}>Cancel <CancelOutlined sx={{ marginLeft: '3px' }} /></Button>
                        </Box>
                    )}
                </Box>
            </form >
        </Box >
    );
}
export default TopUpForm;