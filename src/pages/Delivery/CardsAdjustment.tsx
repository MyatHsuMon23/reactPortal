import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useMutateQuery, useQueryListData } from '../../api/hooks/useQueryHook';
import { useListingQueryParams } from '../../utils/tableListingQueryParams';
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add, AddCircle, FilterAlt } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import { CardDeliveryFilterItems, commonListParams } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import CreateCardAdjustment from './CreateCardAdjustment';
import { LoaderWithBackdrop } from '@/components/Loader';
import { useQueryClient } from '@tanstack/react-query';
import { getItemFromStorage } from '@/utils/auth';
import { checkControlsByRole } from '@/utils/roleAccess';
import YearMonthPicker from '@/components/YearMonthPicker';

const MySwal = withReactContent(Swal);

export default function CardsAdjustment() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setOpen] = useState(false);
  const [expended, setExpended] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const role = getItemFromStorage("auth")?.Role?.toUpperCase();
  let todayDate: any = dayjs(new Date());
  let currentMonth = todayDate.$M + 1;
  let currentYear = todayDate.$y;
  const [payload, setPayload] = useState({
    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    Monthly: `${currentYear}${currentMonth > 9 ? currentMonth : "0" + currentMonth}`,
    ...commonListParams
  })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  interface FilterItem {
    [key: string]: string | Dayjs;
    BranchCode: string;
    Monthly: any;
  }

  const [filterItem, setFilterItem] = useState<FilterItem>({
    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    Monthly: todayDate
  });

  const { data, isLoading, refetch } = useQueryListData({
    queryKey: "fetchCardAdjustmentList",
    url: `${endpoint.getCardAdjustmentList}`,
    payload: payload,
  });

  const { mutate, isLoading: isProcessing } = useMutateQuery();

  const rows = data?.data?.Data?.CardAdjustment;
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'CreatedDate', headerName: 'Created Date', width: 110,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.CreatedDate ? dayjs(new Date(params.row.CreatedDate)).format("DD/MM/YYYY") : "",
    },
    { field: 'BranchCode', headerName: 'Branch', width: 90 },
    { field: 'CardNumber', headerName: 'Card Number', width: 150 },
    { field: 'ApplicationId', headerName: 'App ID', width: 100 },
    { field: 'CardType', headerName: 'Card Type', flex: 1 },
    { field: 'Qty', headerName: 'Quantity', flex: 1 },
    { field: 'ActionStatus', headerName: 'Status', flex: 1 },
    { field: 'ActionUser', headerName: 'Action User', width: windowWidth <= 1500 ? 130 : 170 },
    { field: 'ActionType', headerName: 'Action Type', width: windowWidth <= 1500 ? 200 : 250 },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }
  const handleUpdate = async () => {
    // Invalidate and refetch the query on page 1
    setSearchParams(new URLSearchParams());
    await queryClient.invalidateQueries(['fetchCardAdjustmentList']);
    setPayload({ ...payload, PageIndex: 1 })
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box component="div" style={{ width: '100%', marginTop: '10px', position: 'relative' }}>

      <Box display={'flex'} justifyContent={'space-between'}>
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
        {checkControlsByRole(role, 'AdjustmentCreate') && (
          <Button
            variant='contained'
            size='medium'
            onClick={() => setOpenDrawer(true)}
            color='primary'
            startIcon={<Add style={{ fontSize: '20px' }} />}
          >
            Create Card Adjustment
          </Button>
        )}
      </Box>
      <FilterItems
        expended={expended}
      >
        <Grid container spacing={2}>
          {getItemFromStorage('auth').AllowAll && (
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <TextFieldBox
                name={"BranchCode"}
                type={"text"}
                placeholder={"Branch Code"}
                value={filterItem["BranchCode"]}
                onChange={(e: any) => handleDataChanges("BranchCode", e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <YearMonthPicker
              name='Monthly'
              value={filterItem.Monthly}
              onChange={(value: any) => handleDataChanges("Monthly", value)}
            />
          </Grid>
          <Grid item >
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
                    Monthly: `${filterItem.Monthly?.$y}${filterItem.Monthly?.$M + 1 > 9? filterItem.Monthly?.$M + 1 : "0" + (filterItem.Monthly?.$M + 1)}`,
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
                    Monthly: todayDate,
                  })
                  setPayload({
                    ...payload,
                    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
                    Monthly: `${currentYear}${currentMonth > 9 ? currentMonth : "0" + currentMonth}`,
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
      <CustomSwipeableDrawer open={openDrawer} setOpenDrawer={setOpenDrawer}>
        <LoaderWithBackdrop open={isOpen} />
        <CreateCardAdjustment setOpenDrawer={setOpenDrawer} setLoading={(val: any) => setOpen(val)} refetchAPI={() => handleUpdate()} />
      </CustomSwipeableDrawer>
      <CustomTable
        totalRecord={data?.data?.Data?.TotalCount}
        rows={rows}
        columns={columns}
        height={'450px'}
        cellHeight={'45px'}
        currentPage={payload.PageIndex}
        pageSize={payload.PageLimit}
        rowHeight={60}
        setCurrentPage={(page: any) => setPayload({ ...payload, PageIndex: page })}
        isLoading={isLoading}
      >
      </CustomTable>
    </Box>
  );
}
