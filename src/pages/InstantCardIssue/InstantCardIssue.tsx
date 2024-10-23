import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useQueryListData } from '../../api/hooks/useQueryHook';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { getItemFromStorage } from '../../utils/auth';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSearchParams } from 'react-router-dom';
import { Add, EditNote, FilterAlt } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import GreenPinInstantCardForm from '@/pages/InstantCardIssue/GreenPinInstantCardForm';
import { instantFilterItems, commonListParams } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import { useQueryClient } from '@tanstack/react-query';
import { checkControlsByRole } from '@/utils/roleAccess';

const MySwal = withReactContent(Swal);

export default function InstantCardIssue() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expended, setExpended] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState('create');
  const role = getItemFromStorage("auth")?.Role?.toUpperCase();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const [payload, setPayload] = useState({
    CustomerId: "",
    TemplateName: "",
    IssuingStatus: "",
    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    ...commonListParams
  })

  interface FilterItem {
    [key: string]: string;
    CustomerId: string;
    AppStatus: string;
  }
  const [filterItem, setFilterItem] = useState<FilterItem>({
    CustomerId: "",
    AppStatus: "",
  });

  const { data, isLoading, refetch } = useQueryListData({
    queryKey: "fetchInstantCardIssuList",
    url: `${endpoint.getInstantCardIssueList}`,
    payload: payload,
    config: {},
  });

  const rows = data?.data?.Data?.CardRequestDto;
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'ModifiedDate', headerName: 'Created Date', flex: 1, minWidth: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.ModifiedDate ? dayjs(new Date(params.row.ModifiedDate)).format("DD/MM/YYYY") : "",
    },
    { field: 'BranchCode', headerName: 'Branch', flex: 1, minWidth: 80 },
    // { field: 'TemplateName', headerName: 'Template Name', width:  windowWidth <= 1500 ? 200 : 270},
    { field: 'CustomerId', headerName: 'Customer Id', width: 110 },
    { field: 'FirstName', headerName: 'Name', minWidth: 170, flex: 1 },
    { field: 'MobilePhone', headerName: 'Phone No', width: 150 },
    // { field: 'ApplicationId', headerName: 'App Id', sortable: false, width: 90 },
    {
      field: 'IssuingStatus', headerName: 'Status', width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.IssuingStatus == "SaveDraft" ? 'Save as draft' :
          params.row.IssuingStatus == "Submitted" ? 'Submitted' :
            params.row.IssuingStatus == "Approved" ? 'Approved' :
              params.row.IssuingStatus == "Processing" ? 'Processing' :
                'Declined',
    },
    {
      field: "action", headerName: "Action", sortable: false, width: 80, align: 'right',
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          setOpenDrawer(true)
          setMode('edit')
          setSearchParams({ IssuingId: params.row.IssuingId });
        };

        return (
          <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <EditNote color='primary' onClick={onClick} />
          </Box>
        );
      }
    },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }

  const handleUpdate = async () => {
    // Invalidate and refetch the query on page 1
    setSearchParams(new URLSearchParams());
    await queryClient.invalidateQueries(['fetchInstantCardIssuList']);
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
        {checkControlsByRole(role, 'CardIssueCreate') && (
          <Button
            variant='contained'
            size='medium'
            onClick={() => {
              setOpenDrawer(true)
              setMode('create')
            }}
            color='primary'
            startIcon={<Add style={{ fontSize: '20px' }} />}
          >
            Create GreenPIN Instant Card Application
          </Button>
        )}
      </Box>
      <FilterItems
        expended={expended}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextFieldBox
              name={"CustomerId"}
              type="text"
              placeholder="Customer Id"
              value={filterItem["CustomerId"]}
              onChange={(e: any) => handleDataChanges("CustomerId", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Box display={'flex'} justifyContent={'flex-start'}>
              <Button
                variant='contained'
                size='medium'
                color='secondary'
                sx={{ margin: '0 10px 0 0' }}
                onClick={() => {
                  setPayload({
                    ...payload,
                    ...commonListParams,
                    CustomerId: filterItem.CustomerId,
                    IssuingStatus: filterItem.AppStatus
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
                    CustomerId: "",
                    AppStatus: "",
                  })
                  setPayload({
                    ...payload,
                    CustomerId: "",
                    IssuingStatus: ""
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
        <GreenPinInstantCardForm setOpenDrawer={setOpenDrawer} mode={mode} refetchAPI={() => handleUpdate()} />
      </CustomSwipeableDrawer>
      <CustomTable
        totalRecord={data?.data?.Data?.TotalCount}
        rows={rows}
        columns={columns}
        height={'450px'}
        cellHeight={'45px'}
        currentPage={payload.PageIndex}
        pageSize={payload.PageLimit}
        rowHeight={55}
        setCurrentPage={(page: any) => setPayload({ ...payload, PageIndex: page })}
        isLoading={isLoading}
      >
      </CustomTable>
    </Box>
  );
}
