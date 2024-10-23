import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button, FormHelperText, FormControl } from '@mui/material';
import React, { useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import TextFieldBox from '../../components/TextFieldBox';
import { FormDatePicker } from '@/components/CustomDatePicker';
import { AddCircle, RestartAlt, Delete, Update, CancelOutlined, Beenhere, Publish } from '@mui/icons-material';
import dayjs from 'dayjs';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoaderWithBackdrop } from '@/components/Loader';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { getItemFromStorage } from '@/utils/auth';
import { AccountNumberValidation, AddressOneValidation, CIFNumberValidation, CleanPhoneNumber, EmailValidation, HouseNoValidation, LuhnCheckValidation, PhoneNoValidation, WordCountValidation, isFieldRequired, removeTabIndex } from '@/utils/common';
import { theme } from '@/styles/GlobalStyle';
import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';
import { FormSelectBox } from '@/components/SelectBox';
import { CountryList, NewgenderList, SurNameList, docType, genderList, regionList } from '@/utils/commonData';

type Props = {
    setOpenDrawer: (val: boolean) => void;
    refetchAPI: (val: boolean) => void;
    mode?: string;
}
const MySwal = withReactContent(Swal);
const schema = yup
    .object()
    .shape({
        CustomerId: yup.string().required()
            .test('len', val => CIFNumberValidation(val).message, val => CIFNumberValidation(val).valid),
        AccountNumber: yup.string()
            .test('len', val => AccountNumberValidation(val).message, val => AccountNumberValidation(val).valid),
        AccountType: yup.string(),
        DocumentType: yup.string().required(),
        NrcId: yup.string().required(),
        PersonId: yup.string(),
        FirstName: yup.string().required(),
        SurName: yup.string().required(),
        DateOfBirth: yup.string().required(),
        Gender: yup.string().required(),
        PersonNrcId: yup.string(),
        TypeOfPersonId: yup.string(),
        AddressId: yup.string(),
        AddressType: yup.string(),
        Region: yup.string().required(),
        Address: yup.string()
            .required()
            .test('len', val => AddressOneValidation(val).message, val => AddressOneValidation(val).valid),
        Country: yup.string()
            .required(),
        City: yup.string()
            .required(),
        Street: yup.string()
            .required(),
        HouseNo: yup.string()
            .required()
            .test('len', val => HouseNoValidation(val).message, val => HouseNoValidation(val).valid),
        MobilePhone: yup.string()
            .required()
            .test('format', val => PhoneNoValidation(val).message, val => PhoneNoValidation(val).valid),
        Email: yup.string().required().test('format', val => EmailValidation(val).message, val => EmailValidation(val).valid),
        CardNumber: yup.string()
            .required()
            .test('len', val => LuhnCheckValidation(val).message, val => LuhnCheckValidation(val).valid),
        EmbossName: yup.string().required(),
        buttonType: yup.string()
    })
    .required();
const PrepaidCardIssueForm: React.FC<Props> = ({ setOpenDrawer, mode = 'create', refetchAPI }) => {
    const isMaker = getItemFromStorage("auth")?.Role?.toUpperCase() === "MAKER";
    const isChecker = getItemFromStorage("auth")?.Role?.toUpperCase() === "CHECKER";
    const [searchParams, setSearchParams] = useSearchParams();
    const issuingId = searchParams.get('IssuingId');
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const { mutate: mutateByAccNo, isLoading: isFetchigCustomerData } = useMutateQuery();
    const { setStillLoading } = useCommonDataContext();
    const { data, isLoading } = useQueryListData({
        queryKey: "fetchPrepaidCardIssueById",
        url: `${endpoint.getInstantCardIssueById}`,
        IssuingId: issuingId,
        config: {
            enabled: !!issuingId,
        },
    });
    const formFields = data?.data?.Data?.CardRequestDto;
    const checkStatus = () => {
        switch (formFields?.IssuingStatus) {
            case "Submitted":
                return true;
            case "Approved":
                return true;
            case "Rejected":
                return true;
            default:
                return false;
        }
    }

    const onSubmit = (data: any) => {
        let url = "";
        let title = "Do you agree to create?";
        let confrimBtnText = "YES";
        let cancelBtnText = "NO";
        let successMessage = "Record is successfully created";
        var payload = {
            IssuingDto: {
                InstantCardId: null,
                BranchCode: getItemFromStorage("auth")?.branchCode,
                DocumentType: data?.DocumentType,
                NrcId: data?.NrcId,
                CustomerId: data?.CustomerId,
                FristName: data?.FirstName,
                SurName: data?.SurName,
                DateOfBirth: data?.DateOfBirth ? dayjs(data?.DateOfBirth).format('YYYY-MM-DD') : null,
                Gender: data?.Gender,
                TypeOfPersonId: data?.TypeOfPersonId,
                PersonNrcId: data?.PersonNrcId,
                AddressType: data?.AddressType,
                AddressLineOne: "", //Need to confirm fields
                AddressLineTwo: "",
                Address: data?.Address,
                Country: data?.Country,
                Region: data?.Region,
                City: data?.City,
                Street: data?.Street,
                HouseNo: data?.HouseNo,
                MobilePhone: data?.MobilePhone,
                Email: data?.Email,
                CardNumber: data?.CardNumber,
                EmbossName: data?.EmbossName,
                AccountNumber: data?.AccountNumber,
                ApplicationId: data?.ApplicationId || "",
                CreatedUserId: getItemFromStorage('auth').LoginId,
                AccountType: data?.AccountType,
                TemplateType: data?.TemplateType,
                CardList: null,
                CustInfoId: formFields?.CustInfoId
            }
        }
        if (watch('buttonType') === "delete") {
            url = endpoint.prepaidDeleted;
            var deletePayload = {
                IssuingId: formFields?.IssuingId,
                UpdatedUserId: getItemFromStorage('auth').LoginId
            }
            MySwal.fire({
                title: "Are you sure, you want to delete?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "YES",
                cancelButtonText: "NO",
                confirmButtonColor: theme.palette.primary.main,
                cancelButtonColor: theme.palette.error.main,
                iconColor: theme.palette.warning.main,
            }).then((result) => {
                if (result.isConfirmed) {
                    setStillLoading(true);
                    mutate(
                        {
                            url: url,
                            body: deletePayload,
                            baseURL: import.meta.env.VITE_APP_ISSUE_API_URL
                        },
                        {
                            onSuccess: (data) => {
                                if (data?.status == 200 || data?.status == 201 || data?.status == 202) {
                                    MySwal.fire({
                                        html: "Record Deletion is successful !",
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
            return;
        };
        if (watch('buttonType') === "create") {
            url = endpoint.prepaidSaveDraft;
            confrimBtnText = "Agree";
            cancelBtnText = "Not Agree";
        }
        else if (watch('buttonType') === "submit") {
            url = endpoint.prepaidSubmitted
            title = "Are you sure to submit?"
            successMessage = "Record is successfully submitted"
        }
        else if (watch('buttonType') === "update") {
            url = endpoint.prepaidUpdated;
            title = "Are you sure to update?"
            successMessage = "Record is successfully updated"
        }
        else {
            url = endpoint.prepaidApproved
            title = "Are you sure to approve?"
            successMessage = "Record is successfully approved"
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
        CustomerId: '',
        AccountNumber: '',
        AccountType: 'ACCTS',
        DocumentType: '',
        NrcId: '',
        PersonId: '',
        FirstName: '',
        SurName: '',
        DateOfBirth: '',
        Gender: '',
        PersonNrcId: '',
        TypeOfPersonId: 'IDTP4',
        AddressId: '',
        AddressType: 'ADDR1',
        Region: '',
        Address: '',
        Country: '',
        City: '',
        Street: '',
        HouseNo: '',
        MobilePhone: '',
        Email: '',
        CardNumber: '',
        EmbossName: '',
        buttonType: ''
    }

    const { register, handleSubmit, control, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });
    const checkLoading = () => {
        if ((mode === 'edit' && issuingId && isLoading) || isProcessing || isFetchigCustomerData) {
            return true;
        }
        if (mode === 'create' && !issuingId && isFetchigCustomerData) {
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

    const handleButtons = () => {
        const buttonConfig = [
            { btnText: 'Submit', color: 'success', endIcon: <Publish />, buttonType: 'submit' },
            { btnText: 'Update', color: 'secondary', endIcon: <Update />, buttonType: 'update' },
            { btnText: 'Delete', color: 'error', endIcon: <Delete />, buttonType: 'delete' },
        ];

        if (isMaker && mode === "edit" && !["Submitted", "Approved", "Rejected"].includes(formFields?.IssuingStatus)) {
            return buttonConfig.map((button) => (
                <LoadingButtonComponent
                    key={button.btnText}
                    isLoading={isProcessing && watch('buttonType') === button.buttonType}
                    type="submit"
                    btnText={button.btnText}
                    disabled={false}
                    endIcon={button.endIcon}
                    color={button.color as "success" | "secondary" | "error" | "inherit" | "primary" | "info" | "warning"}
                    style={{
                        width: '90px',
                        lineHeight: 0.7,
                        fontSize: '14px',
                        color: button.color === 'success' ? '#fff' : undefined,
                    }}
                    handleOnclick={() => setValue("buttonType", button.buttonType)}
                />
            ));
        } else if (isChecker && mode === "edit" && formFields?.IssuingStatus === "Submitted") {
            return (
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
            );
        }
    };

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
                PREPAID CARD ISSUING
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#'>
                {/* Account Block */}
                <Box component="fieldset" sx={{
                    borderColor: '#d9d2ff',
                    borderRadius: '3px',
                    padding: '15px',
                    marginTop: '15px',
                    borderWidth: '1px',
                }}>
                    <legend>CIF Number</legend>
                    <Grid container columnSpacing={2} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >CIF Number <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CustomerId') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                InputProps={true}
                                onSearch={() => {
                                    mutateByAccNo(
                                        {
                                            url: endpoint.getKYCByCIF + '?cif=' + getValues('CustomerId'),
                                        },
                                        {
                                            onSuccess: (data) => {
                                                if (data?.status == 200) {
                                                    var customerData = data?.data?.Data?.CustomerInfo;
                                                    setValue('FirstName', customerData.Name);
                                                    if (customerData.MobileNumber?.includes(",")) {
                                                        var phone = customerData.MobileNumber?.split(",")[0]?.trim();
                                                        setValue('MobilePhone', CleanPhoneNumber(phone));
                                                    }
                                                    else {
                                                        setValue('MobilePhone', CleanPhoneNumber(customerData.MobileNumber));
                                                    }
                                                    setValue('Email', customerData.Email != null ? customerData.Email.trim() : customerData.Email);
                                                    setValue('DateOfBirth', customerData.DOB);
                                                    setValue('NrcId', customerData.Nrc);
                                                    let address1 = customerData.Address1 ? customerData.Address1.trim() : "";
                                                    let address2 = customerData.Address2 ? customerData.Address2.trim() : "";
                                                    let address3 = customerData.Address3 ? customerData.Address3.trim() : "";
                                                    let address4 = customerData.Address4 ? customerData.Address4.trim() : "";

                                                    let orgAddr = `${address1} ${address2} , ${address3} ${address4}`
                                                    setValue('Address', orgAddr);
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

                                error={errors.CustomerId?.message && true}
                                type='number'
                                helperText={errors.CustomerId?.message && errors.CustomerId?.message.toString()}
                                {...register('CustomerId')}
                            />
                        </Grid>
                        {/* Empty Spaces */}
                        <Grid xs={6} item></Grid>
                    </Grid>
                </Box>
                {/* Card Holder Block */}
                <Box component="fieldset" sx={{
                    borderColor: '#d9d2ff',
                    borderRadius: '3px',
                    padding: '15px',
                    marginTop: '2em',
                    borderWidth: '1px',
                }}>
                    <legend>Card Holder</legend>
                    <Grid container columnSpacing={2} alignItems={'center'} fontWeight={600} fontSize={14}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >SurName <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'SurName') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.SurName?.message ? true : false}>
                                <Controller
                                    name="SurName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormSelectBox
                                            disabled={checkStatus()}
                                            field={field}
                                            error={errors.SurName?.message ? true : false}
                                            {...register('SurName')}
                                            items={SurNameList}
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ marginLeft: '0px' }}>{errors.SurName?.message?.toString()}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Name <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'FirstName') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <TextFieldBox
                                disabled={true}
                                error={errors.FirstName?.message && true}
                                helperText={errors.FirstName?.message && errors.FirstName?.message.toString()}
                                {...register('FirstName')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Date of Birth</Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.DateOfBirth?.message ? true : false}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Controller
                                        name="DateOfBirth"
                                        control={control}
                                        render={({ field }) => (
                                            <FormDatePicker
                                                field={{
                                                    ...field,
                                                    value: field.value ? dayjs(field.value) : null, // Convert value to dayjs object
                                                }}
                                                error={errors.DateOfBirth?.message ? true : false}
                                                disabled={true}
                                            />
                                        )}
                                    />
                                    <FormHelperText sx={{ marginLeft: '0px' }}>{errors.DateOfBirth?.message?.toString()}</FormHelperText>
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Gender <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Gender') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.Gender?.message ? true : false}>
                                <Controller
                                    name="Gender"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormSelectBox
                                            disabled={checkStatus()}
                                            field={field}
                                            error={errors.Gender?.message ? true : false}
                                            {...register('Gender')}
                                            items={NewgenderList}
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ marginLeft: '0px' }}>{errors.Gender?.message?.toString()}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Document Type</Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.DocumentType?.message ? true : false}>
                                <Controller
                                    name="DocumentType"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormSelectBox
                                            field={field}
                                            error={errors.DocumentType?.message ? true : false}
                                            {...register('DocumentType')}
                                            items={docType}
                                            disabled={checkStatus()}
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ marginLeft: '0px' }}>{errors.DocumentType?.message?.toString()}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >NRC <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'NrcId') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                error={errors.NrcId?.message ? true : false}
                                helperText={errors.NrcId?.message && errors.NrcId?.message.toString()}
                                {...register('NrcId')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Phone No <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'MobilePhone') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <TextFieldBox
                                type="number"
                                disabled={true}
                                error={errors.MobilePhone?.message ? true : false}
                                helperText={errors.MobilePhone?.message && errors.MobilePhone?.message.toString()}
                                {...register('MobilePhone')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Email <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Email') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <TextFieldBox
                                disabled={true}
                                error={errors.Email?.message ? true : false}
                                helperText={errors.Email?.message && errors.Email?.message.toString()}
                                {...register('Email')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Region <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Region') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.Region?.message ? true : false}>
                                <Controller
                                    name="Region"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormSelectBox
                                            disabled={checkStatus()}
                                            field={field}
                                            error={errors.Region?.message ? true : false}
                                            {...register('Region')}
                                            items={regionList}
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ marginLeft: '0px' }}>{errors.Region?.message?.toString()}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Country <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Country') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <FormControl size="small" sx={{ width: '100%' }} error={errors.Country?.message ? true : false}>
                                <Controller
                                    name="Country"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormSelectBox
                                            disabled={checkStatus()}
                                            field={field}
                                            error={errors.Country?.message ? true : false}
                                            {...register('Country')}
                                            items={CountryList}
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ marginLeft: '0px' }}>{errors.Country?.message?.toString()}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >City <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'City') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                error={errors.City?.message ? true : false}
                                helperText={errors.City?.message && errors.City?.message.toString()}
                                {...register('City')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Street <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Street') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                error={errors.Street?.message ? true : false}
                                helperText={errors.Street?.message && errors.Street?.message.toString()}
                                {...register('Street')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >House No <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'HouseNo') }} ></span> </Typography>
                        </Grid>
                        <Grid item xs={4} md={4} mt={3}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                error={errors.HouseNo?.message ? true : false}
                                helperText={errors.HouseNo?.message && errors.HouseNo?.message.toString()}
                                {...register('HouseNo')}
                            />
                        </Grid>
                        {/* Empty Space Taking */}
                        <Grid item xs={6}></Grid>
                        <Grid item xs={2} md={2} mt={3}>
                            <Typography variant='subtitle1' fontSize={14} >Address <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'Address') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={10} md={10} mt={3}>
                            <TextFieldBox
                                multiline={true}
                                disabled={checkStatus()}
                                error={errors.Address?.message ? true : false}
                                helperText={errors.Address?.message && errors.Address?.message.toString()}
                                {...register('Address')}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Card Block */}
                <Box component="fieldset" sx={{
                    borderColor: '#d9d2ff',
                    borderRadius: '3px',
                    padding: '15px',
                    marginTop: '2em',
                    borderWidth: '1px',
                }}>
                    <legend>Card</legend>
                    <Grid container columnSpacing={2} alignItems={'center'}>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Card Number  <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardNumber') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                type="number"
                                error={errors.CardNumber?.message ? true : false}
                                helperText={errors.CardNumber?.message && errors.CardNumber?.message.toString()}
                                {...register('CardNumber')}
                            />
                        </Grid>
                        <Grid item xs={2} md={2} fontWeight={600} fontSize={14}>
                            <Typography variant='subtitle1' fontSize={14} >Embossed Name <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'EmbossName') }} ></span></Typography>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <TextFieldBox
                                disabled={checkStatus()}
                                error={errors.EmbossName?.message ? true : false}
                                helperText={errors.EmbossName?.message && errors.EmbossName?.message.toString()}
                                {...register('EmbossName')}
                            />
                        </Grid>
                    </Grid>
                </Box>
                {mode === "create" && (
                    <Box display={'flex'} justifyContent={'flex-end'} margin={'10px 0'} gap={1}>
                        {isMaker && (
                            <>
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
                                    handleOnclick={() => setValue("buttonType", "create")}
                                />
                                <Button type="button" variant='contained' color='info' onClick={() => { reset() }}>Reset <RestartAlt></RestartAlt></Button>
                            </>
                        )}
                        <Button type="button" variant='contained' color='info' onClick={() => {
                            reset();
                            setSearchParams(new URLSearchParams());
                            setOpenDrawer(false)
                        }}>Cancel <CancelOutlined sx={{ marginLeft: '3px' }} /></Button>
                    </Box>
                )}
                {mode === "edit" && (
                    <Box display={'flex'} justifyContent={'flex-end'} margin={'10px 0'} gap={1}>

                        {handleButtons()}

                        <Button type="button" variant='contained' color='info' onClick={() => {
                            reset();
                            setSearchParams(new URLSearchParams());
                            setOpenDrawer(false)
                        }}>Cancel <CancelOutlined sx={{ marginLeft: '3px' }} /></Button>
                    </Box>
                )}
            </form >
        </Box >
    );
}
export default PrepaidCardIssueForm;