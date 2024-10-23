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
import { LuhnCheckValidation, formatDate, maskCard, removeTabIndex } from '@/utils/common';
import { LoaderWithBackdrop } from '@/components/Loader';

const MySwal = withReactContent(Swal);

export default function CardPinReset() {
  const [cardNo, setCardNo] = useState('');
  const [cardNoValidate, setCardNoValidate] = useState({
    valid: true,
    message: ""
  });
  const [rows, setRows] = useState<any[]>([]);
  const { mutate, isLoading } = useMutateQuery();
  const { mutate: mutateAction, isLoading: isdoingAction } = useMutateQuery();

  const checkDateIncludePlusSign = (date: any) => {
    if(date.includes('+')){
      return formatDate(date)
    }
    else return dayjs(date)
  }

  const columns: GridColDef[] = [
    {
      field: "action", headerName: "Action", sortable: false, width: 100, align: 'center',
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation(params);
          MySwal.fire({
            html: `Are you sure to reset this card (${maskCard(params?.row?.CARDNUMBER)})?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: theme.palette.primary.main,
            cancelButtonColor: theme.palette.error.main,
            iconColor: theme.palette.warning.main,
            focusCancel: true,
          }).then((result) => {
            if (result.isConfirmed) {
              mutateAction(
                {
                  url: endpoint.pinResetAction,
                  body: {
                    User_Id: getItemFromStorage('auth').LoginId,
                    User_Name: getItemFromStorage('auth')?.name,
                    BRANCH_CODE: getItemFromStorage('auth')?.branchCode,
                    Action: 'reset',
                    Cardinfo: {
                      CardId: params?.row?.CARDID,
                      CardNumber: params?.row?.CARDNUMBER,
                      MemNumber: params?.row?.MEM_NO,
                      CardStatus: params?.row?.CARDSTATUS,
                      CardStatusDesc: params?.row?.CARDSTATUSDESC,
                      EmbossName: params?.row?.EMBOSSNAME,
                      ProductName: params?.row?.PRODUCTNAME,
                      PrimAtmAcct: params?.row?.ACCT,
                      Nrc: params?.row?.NRC,
                      CIFNo: params?.row?.CIF,
                      ExpirationDate: params?.row?.EXPIRATIONDATE? checkDateIncludePlusSign(params?.row?.EXPIRATIONDATE) : null,
                      IssueDate: params?.row?.ISSDATE? checkDateIncludePlusSign(params?.row?.ISSDATE) : null,
                    }
                  },
                  baseURL: import.meta.env.VITE_APP_ISSUE_API_URL
                },
                {
                  onSuccess: (data) => {
                    if (data?.status == 200) {
                      MySwal.fire({
                        html: "Card Pin Reset is Successful !",
                        icon: "success",
                        confirmButtonColor: theme.palette.primary.main,
                        didOpen: removeTabIndex,
                      })
                    } else {
                      MySwal.fire({
                        html: data?.data?.Data?.ErrorMessage ?
                          data?.data?.Data?.ErrorMessage : data?.data?.Error?.Message || "Backend Service Failed",
                        icon: 'error',
                        confirmButtonColor: theme.palette.primary.main,
                        didOpen: removeTabIndex,
                      })
                    }
                  },
                }
              );
            }
          });
        };

        return (
          <LoadingButtonComponent
            isLoading={isdoingAction}
            handleOnclick={onClick}
            btnText={'Reset'}
            disabled={!params?.row?.DOACTION}
            style={{
              padding: '13px 0px !important',
              lineHeight: 0.7,
              margin: '0 5px',
              fontSize: '14px',
              backgroundColor: theme.palette.primary.main
            }}
          />
        );
      }
    },
    // { field: 'CARDID', headerName: 'Card Id', width: 130 },
    {
      field: 'CARDNUMBER', headerName: 'Card No', width: 150,
      valueGetter: (params: GridValueGetterParams) =>
          params.row.CARDNUMBER ? `${maskCard(params?.row?.CARDNUMBER)}` : ''
  },
    { field: 'EMBOSSNAME', headerName: 'EmbossName', width: 150, flex: 1 },
    { field: 'MEM_NO', headerName: 'Mem_No', width: 90 },
    { field: 'ACCT', headerName: 'PrimAtmAcct', width: 170 },
    { field: 'CARDSTATUS', headerName: 'Card Status', width: 130 },
    { field: 'CARDSTATUSDESC', headerName: 'Card Desc', width: 130 },
    { field: 'PRODUCTNAME', headerName: 'ProductName', flex: 1, minWidth: 170 }
  ];

  const onSearch = () => {
    setRows([]);
    mutate(
      {
        url: endpoint.getCard,
        body: {
          CardNo: cardNo,
          CardType: 'reset'
        },
        baseURL: import.meta.env.VITE_APP_ISSUE_API_URL
      },
      {
        onSuccess: (data) => {
          if (data?.status == 200) {
            var Card = data?.data?.Data?.Card;
            setRows((prevArray: any) => [...prevArray, Card]);
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
