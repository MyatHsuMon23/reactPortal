import { endpoint } from '@/api/constant/endpoints';
import { useMutateQuery, useQueryListData } from '@/api/hooks/useQueryHook';
import { Box, Typography, Grid, Button, FormHelperText, FormControl } from '@mui/material';
import React, { useEffect } from "react";
import TextFieldBox from '../../components/TextFieldBox';
import { FormSelectBox } from '../../components/SelectBox';
import { CardStatus, CardTypeList, DeliveryDebitCardType } from '@/utils/commonData';
import { AddCircle, RestartAlt, Cancel } from '@mui/icons-material';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { getItemFromStorage } from '@/utils/auth';
import { WordCountValidation, isFieldRequired, removeTabIndex } from '@/utils/common';
import { theme } from '@/styles/GlobalStyle';
import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';

type Props = {
    setOpenDrawer: (val: boolean) => void;
    setLoading: (val: boolean) => void;
    refetchAPI: (val: boolean) => void;
}
const MySwal = withReactContent(Swal);
const schema = yup
    .object()
    .shape({
        CardStatus: yup.string(),
        CardTotalCount: yup.string(),
        BatchNo: yup.string().required()
            .test('len', val => WordCountValidation(val, 0, 50).message, val => WordCountValidation(val, 0, 50).valid),
        CardBin: yup.string().required()
            .test('len', val => WordCountValidation(val, 8, 8).message, val => WordCountValidation(val, 8, 8).valid),
        TicketNumber: yup.string(),
        CardType: yup.string(),
        CardAppID: yup.string(),
        BranchCode: yup.string()
    })
    .required();
const CreateCardInventory: React.FC<Props> = ({ setOpenDrawer, setLoading, refetchAPI }) => {
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
        const payload = {
            Qty: Number(data.CardTotalCount),
            Batch: data.BatchNo,
            CardBin: data.CardBin,
            CardType: data.CardAppID,
            CardTypeDesc: data.CardAppID + " " + data.CardType,
            BranchCode: data.BranchCode,
            ActionStatus: data.CardStatus,
            DispatchedDate: new Date().toISOString(),
            DispatchedUserId: getItemFromStorage('auth').LoginId, // Add current login user ID
            EntryName: getItemFromStorage('auth').name, // Add current login user name
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
                        url: endpoint.saveCardDelivery,
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
                                }).then(() => {
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
        CardStatus: '',
        CardTotalCount: '',
        BatchNo: '',
        CardBin: '',
        TicketNumber: '',
        CardType: '',
        CardAppID: '',
        BranchCode: '',
    }

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: initialFormValues,
        resolver: yupResolver(schema),
    });
    // Bind data to form fields
    useEffect(() => {
        reset(initialFormValues);
    },[refetchAPI]);

    return (
        <Box sx={{
            padding: '15px 30px',
            position: 'relative'
        }}>
            {/* <LoaderWithBackdrop open={true} /> */}
            <Typography variant='subtitle1' fontSize={14} sx={{
                padding: '3px 5px',
                background: '#d9d2ff',
                borderRadius: '5px'
            }}>
                CREATE CARD INVENTORY
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} action='#'>
                <Grid container columnSpacing={2} mt={3} alignItems={'center'} justifyContent={'space-between'}>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Card Status <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardStatus')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.CardStatus?.message ? true : false}>
                            <Controller
                                name="CardStatus"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormSelectBox
                                        field={field}
                                        error={errors.CardStatus?.message ? true : false}
                                        {...register('CardStatus')}
                                        items={CardStatus}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.CardStatus?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card Total Count <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardTotalCount')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            type='number'
                            error={errors.CardTotalCount?.message && true}
                            helperText={errors.CardTotalCount?.message && errors.CardTotalCount?.message.toString()}
                            {...register('CardTotalCount')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2} >
                        <Typography variant='subtitle1' fontSize={14} >Batch Number <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'BatchNo')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            error={errors.BatchNo?.message && true}
                            helperText={errors.BatchNo?.message && errors.BatchNo?.message.toString()}
                            {...register('BatchNo')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card Bin <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardBin')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <TextFieldBox
                            type='number'
                            error={errors.CardBin?.message && true}
                            helperText={errors.CardBin?.message && errors.CardBin?.message.toString()}
                            {...register('CardBin')}
                        />
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card Type <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardType')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
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
                                        items={DeliveryDebitCardType}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.CardType?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} fontWeight={600} fontSize={14} mt={2}>
                        <Typography variant='subtitle1' fontSize={14} >Card App ID <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'CardAppID')}} ></span></Typography>
                    </Grid>
                    <Grid item xs={5} md={5} mt={2}>
                        <FormControl size="small" sx={{ width: '100%' }} error={errors.CardAppID?.message ? true : false}>
                            <Controller
                                name="CardAppID"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormSelectBox
                                        field={field}
                                        error={errors.CardAppID?.message ? true : false}
                                        {...register('CardAppID')}
                                        items={CardTypeList}
                                    />
                                )}
                            />
                            <FormHelperText sx={{ marginLeft: '0px' }}>{errors.CardAppID?.message?.toString()}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} md={3} mt={2} fontWeight={600} fontSize={14}>
                        <Typography variant='subtitle1' fontSize={14} >Branch Code <span dangerouslySetInnerHTML={{ __html: isFieldRequired(schema, 'BranchCode')}} ></span></Typography>
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


                <Grid container columnSpacing={2} mt={3} alignItems={'center'} justifyContent={'space-between'}>
                    {/* Empty Space Taking */}
                    <Grid item xs={5}></Grid>
                    <Grid item xs={5}>
                        <Box display={'flex'} justifyContent={'flex-start'} gap={1}>
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
                    </Grid>
                    {/* Empty Space Taking */}
                    <Grid item xs={2}></Grid>
                </Grid>
            </form >
        </Box >
    );
}
export default CreateCardInventory;