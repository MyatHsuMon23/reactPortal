import { Box, Grid, Typography } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useMutateQuery, useQueryListData } from '../../api/hooks/useQueryHook';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import TextFieldBox from '@/components/TextFieldBox';
import { Cancel, CheckCircle } from "@mui/icons-material";
import { LoadingButtonComponent } from '@/components/LoadingButton';
import { theme } from '@/styles/GlobalStyle';
import { getItemFromStorage } from '@/utils/auth';
import { LuhnCheckValidation, formatDate, removeTabIndex } from '@/utils/common';
import { LoaderWithBackdrop } from '@/components/Loader';

const MySwal = withReactContent(Swal);

export default function BalanceEnquiry() {
    const [cardNo, setCardNo] = useState('');
    const [cardNoValidate, setCardNoValidate] = useState({
        valid: true,
        message: ""
    });
    const [rows, setRows] = useState<any[]>([]);
    const { mutate, isLoading } = useMutateQuery();
    const { mutate: mutateAction, isLoading: isdoingAction } = useMutateQuery();

    const columns: GridColDef[] = [
        { field: 'CardNumber', headerName: 'Card No', minWidth: 150, flex: 1 },
        { field: 'CardHolderName', headerName: 'Card Holder Name', minWidth: 170, flex: 1 },
        {
            field: 'CardExpiredDate', headerName: 'Card Expired Date', minWidth: 200, flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.CardExpiredDate ? `${dayjs(new Date(params.row.CardExpiredDate.split('+')[0])).format("DD/MM/YYYY")}` : "",
        },
        { field: 'AvailableBalance', headerName: 'Available Balance', width: 150, flex: 1 },
        { field: 'CurrencyCode', headerName: 'Currenty Code', width: 130, flex: 1 },
    ];

    const onSearch = () => {
        setRows([]);
        mutate(
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
                        setRows((prevArray: any) => [...prevArray, CustBalanceEnquiry]);
                    } else {
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

    useEffect(() => {
        if (cardNo != '' && cardNo)
            setCardNoValidate(LuhnCheckValidation(cardNo));
    }, [cardNo])

    return (
        <Box component="div" style={{ width: '100%', marginTop: '10px' }}>
            <LoaderWithBackdrop open={isdoingAction} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} lg={4} mt={2}>
                    <TextFieldBox
                        name='CardNumber'
                        type='number'
                        placeholder='Card Number'
                        InputProps={true}
                        btnDisabled={cardNo == '' || !cardNoValidate.valid}
                        onChange={(e) => setCardNo(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter')
                                onSearch()
                        }}
                        onSearch={() => onSearch()}
                        error={!cardNoValidate.valid}
                        helperText={cardNoValidate.message.toString()}
                    />
                </Grid>
            </Grid>
            <CustomTable
                totalRecord={rows?.length}
                rows={rows}
                columns={columns}
                height={'450px'}
                cellHeight={'45px'}
                currentPage={1}
                pageSize={1}
                rowHeight={90}
                setCurrentPage={(page: any) => { console.log(page) }}
                isLoading={isLoading}
            >
            </CustomTable>
        </Box>
    );
}
