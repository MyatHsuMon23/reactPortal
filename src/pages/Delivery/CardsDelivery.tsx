import { Box, Button, Typography, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useMutateQuery, useQueryListData } from '../../api/hooks/useQueryHook';
import { useListingQueryParams } from '../../utils/tableListingQueryParams';
import Loader, { LoaderWithBackdrop } from '../../components/Loader';
import React, { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddCircle, FilterAlt, BorderColor, Add } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import { CardDeliveryFilterItems, commonListParams } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import { LoadingButtonComponent } from '@/components/LoadingButton';
import CreateCardInventory from './CreateCardInventory';
import { getItemFromStorage } from '@/utils/auth';
import { useQueryClient } from '@tanstack/react-query';
import { removeTabIndex } from '@/utils/common';
import { checkControlsByRole } from '@/utils/roleAccess';
import { theme } from '@/styles/GlobalStyle';

const MySwal = withReactContent(Swal);

export default function CardsDelivery() {
  let date = new Date();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expended, setExpended] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const role = getItemFromStorage("auth")?.Role?.toUpperCase();
  const [payload, setPayload] = useState({
    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    ...commonListParams
  })
  interface FilterItem {
    [key: string]: string;
    BranchCode: string;
  }

  const [filterItem, setFilterItem] = useState<FilterItem>({
    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
  });
  const [currentItem, setCurrentItem] = useState("");

  const { data, isLoading, refetch } = useQueryListData({
    queryKey: "fetchCardDeliveryList",
    url: `${endpoint.getCardDeliveryList}`,
    BranchCode: payload.BranchCode,
    pageindex: payload.PageIndex,
    pagelimit: payload.PageLimit
  });

  const handleUpdate = async () => {
    // Invalidate and refetch the query on page 1
    setSearchParams(new URLSearchParams());
    await queryClient.invalidateQueries(['fetchCardDeliveryList']);
    setPayload({ ...payload, PageIndex: 1 })
  };

  const { mutate, isLoading: isProcessing } = useMutateQuery();

  const rows = data?.data?.Data?.DeliveryDto;
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'CardType', headerName: 'Card App ID', flex: 1,
    },
    { field: 'Qty', headerName: 'Card Count', flex: 1 },
    { field: 'BranchCode', headerName: 'Branch', flex: 1 },
    { field: 'EntryName', headerName: 'Entry Name', width: 200 },
    { field: 'ActionStatus', headerName: 'Card Status', flex: 1 },
    {
      field: 'DispatchedDate', headerName: 'Dispatched Date', width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.DispatchedDate ? dayjs(new Date(params.row.DispatchedDate)).format("DD/MM/YYYY") : "",
    },
    {
      field: 'ReceivedDate', headerName: 'Received Date', flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.ReceivedDate ? dayjs(new Date(params.row.ReceivedDate)).format("DD/MM/YYYY") : "",
    },
    {
      field: "action", headerName: "Confirm", sortable: false, flex: 1, align: 'center', type: 'actions',
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          setCurrentItem(params.row.DeliveryId);

          MySwal.fire({
            html: "Are you sure to receive?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "YES",
            cancelButtonText: "NO",
            confirmButtonColor: theme.palette.primary.main,
            cancelButtonColor: theme.palette.error.main,
            iconColor: theme.palette.warning.main,
          }).then((result) => {
            if (result.isConfirmed) {
              mutate(
                {
                  url: endpoint.receiveCardDelivery,
                  body: {
                    "DeliveryId": params.row.DeliveryId,
                    "ReceivedUserId": getItemFromStorage('auth').LoginId
                  }
                },
                {
                  onSuccess: (data) => {
                    if (data?.status === 200 || data?.status === 202) {
                      MySwal.fire({
                        html: "Card is successfully accepted",
                        icon: 'success',
                        width: 400,
                        didOpen: removeTabIndex,
                      }).then(() => {
                        setOpenDrawer(false)
                        refetch();
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
                  }
                }
              )
            }
          });
        };
        if (params.row.ActionStatus === 'RECEIVED') {
          return <Typography color={"primary"} fontSize={14}>Received</Typography>
        }

        return (
          <LoadingButtonComponent
            isLoading={isProcessing && currentItem == params.row.DeliveryId}
            handleOnclick={onClick}
            btnText={'Received'}
            disabled={!checkControlsByRole(role, 'Received')}
            style={{
              lineHeight: 0.7,
              margin: '0 10px',
              fontSize: '14px',
            }}
          />
        );
      }
    },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }


  return (
    <Box component="div" style={{ width: '100%', marginTop: '10px' }}>
      <LoaderWithBackdrop open={isProcessing} />
      <Box display={'flex'} justifyContent={'space-between'}>
        {getItemFromStorage('auth').AllowAll ? (
          <Button
            variant='outlined'
            size='medium'
            onClick={() => setExpended(!expended)}
            color='primary'
            sx={{ gap: '5px' }}
          >
            Filter
            <FilterAlt style={{ fontSize: '16px' }} />
          </Button>
        )
          :
          (<div></div>)}

        {checkControlsByRole(role, 'DeliveryCreate') && (
          <Button
            variant='contained'
            size='medium'
            onClick={() => setOpenDrawer(true)}
            color='primary'
            startIcon={<Add style={{ fontSize: '20px' }} />}
          >
            Create Card Inventory
          </Button>
        )}
      </Box>
      <FilterItems
        expended={expended}
      >
        <Grid container spacing={2}>
          {CardDeliveryFilterItems.map((item) => {
            if (item.type === 'dropdown') {
              return (
                <Grid item xs={12} sm={4} md={4} lg={4} key={item.name}>
                  <SelectBox
                    items={item.items}
                    name={item.name}
                    placeholder={item.key}
                    value={filterItem[item.name]}
                    onChange={(value: any) => handleDataChanges(item.name, value)}
                  />
                </Grid>
              )
            }
            else {
              return (
                <Grid item xs={12} sm={4} md={4} lg={4} key={item.name}>
                  <TextFieldBox
                    name={item.name}
                    type={item.type}
                    placeholder={item.key}
                    value={filterItem[item.name]}
                    onChange={(e: any) => handleDataChanges(item.name, e.target.value)}
                  />
                </Grid>
              )
            }
          })}
          <Grid item xs={12} sm={8} md={8} lg={8}>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <Button
                variant='contained'
                size='medium'
                color='secondary'
                sx={{ margin: '0 10px 0 0' }}
                onClick={() => {
                  setPayload({
                    ...payload,
                    BranchCode: filterItem.BranchCode,
                    ...commonListParams
                  })
                }}
              >
                Search
              </Button>
              <Button
                variant='outlined'
                size='medium'
                type='button'
                onClick={() => {
                  setFilterItem({
                    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
                  })
                  setPayload({
                    ...payload,
                    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
                    ...commonListParams
                  })
                  setExpended(false)
                }}
                color='secondary'
                sx={{ margin: '0 10px 0 0' }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FilterItems>
      <CustomSwipeableDrawer open={openDrawer} setOpenDrawer={setOpenDrawer} width='50vw'>
        <LoaderWithBackdrop open={isOpen} />
        <CreateCardInventory setOpenDrawer={setOpenDrawer} setLoading={(val: any) => setOpen(val)} refetchAPI={() => handleUpdate()} />
      </CustomSwipeableDrawer>
      <CustomTable
        totalRecord={data?.data?.Data?.TotalCount}
        rows={rows}
        columns={columns}
        height={'450px'}
        cellHeight={'45px'}
        currentPage={payload.PageIndex}
        pageSize={payload.PageLimit}
        rowHeight={50}
        setCurrentPage={(page: any) => setPayload({ ...payload, PageIndex: page })}
        isLoading={isLoading}
      >
      </CustomTable>
    </Box>
  );
}
