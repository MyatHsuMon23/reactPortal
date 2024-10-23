import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useQueryListData } from '../../api/hooks/useQueryHook';
import { useListingQueryParams } from '../../utils/tableListingQueryParams';
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add, AddCircle, FilterAlt, BorderColor } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import GreenPinInstantCardForm from '@/pages/InstantCardIssue/GreenPinInstantCardForm';
import { commonListParams, CardDeliveryFilterItems } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import { getItemFromStorage } from '@/utils/auth';

const MySwal = withReactContent(Swal);

export default function EntryClosingStock() {
  let date = new Date();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expended, setExpended] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState('create');
  
  const [payload, setPayload] = useState({
    CustomerId: "",
    TemplateName: "",
    IssuingStatus: "",
    BranchCode: getItemFromStorage('auth').branchCode,
    ...commonListParams
  })
  
  interface FilterItem {
    [key: string]: string;
    CustomerId: string;
    IssuingStatus: string;
  }
  const [filterItem, setFilterItem] = useState<FilterItem>({
    CustomerId: "",
    IssuingStatus: "",
  });

  const { data, isLoading } = useQueryListData({
    queryKey: "fetchInstantCardIssuList",
    url: `${endpoint.getInstantCardIssueList}`,
    payload: payload,
    config: {},
  });

  const rows = data?.data?.Data?.CardRequestDto;
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'ModifiedDate', headerName: 'Created Date', width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.ModifiedDate ? dayjs(new Date(params.row.ModifiedDate)).format("DD/MM/YYYY") : "",
    },
    { field: 'BranchCode', headerName: 'Branch Code', width: 130 },
    // { field: 'TemplateName', headerName: 'Template Name', width: 300 },
    {
      field: 'CustomerId', headerName: 'Customer Id', width: 160,
    },
    {
      field: 'FirstName',
      headerName: 'Name',
      width: 130
    },
    {
      field: 'MobilePhone',
      headerName: 'Phone No',
      type: 'number',
      width: 130
    },
    // {
    //   field: 'ApplicationId',
    //   headerName: 'Application Id',
    //   sortable: false,
    //   width: 130,
    // },

    {
      field: 'IssuingStatus',
      headerName: 'Status',
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.IssuingStatus == "SaveDraft" ? 'Save as draft' :
          params.row.IssuingStatus == "Submitted" ? 'Submitted' :
            params.row.IssuingStatus == "Approved" ? 'Approved' :
              'Declined',
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          setOpenDrawer(true)
          setMode('edit')
          setSearchParams({ IssuingId: params.row.IssuingId });
        };

        return <Button onClick={onClick}><BorderColor /></Button>;
      }
    },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }

  return (
    <Box component="div" style={{ width: '100%', marginTop: '10px', position: 'relative' }}>
      <Button
        variant='contained'
        size='medium'
        onClick={() => setExpended(!expended)}
        color='primary'
        sx={{ gap: '10px' }}
      >
        Filter By
        <FilterAlt style={{ fontSize: '16px' }} />
      </Button>
      <Button
        variant='contained'
        size='medium'
        onClick={() => setOpenDrawer(true)}
        color='primary'
        sx={{ gap: '10px', marginLeft: '10px' }}
      >
        Create Branch's Stock Setting up
        <AddCircle style={{ fontSize: '16px' }} />
      </Button>
      <FilterItems
        expended={expended}
      >
        <Grid container spacing={2}>
          {CardDeliveryFilterItems.map((item: any) => {
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
                    ...commonListParams,
                    CustomerId: filterItem.CustomerId,
                    IssuingStatus: filterItem.IssuingStatus
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
                    IssuingStatus: "",
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
      {/* <CustomSwipeableDrawer open={openDrawer} setOpenDrawer={setOpenDrawer}>
        <GreenPinInstantCardForm setOpenDrawer={setOpenDrawer} mode={mode}/>
      </CustomSwipeableDrawer>
        <CustomTable
          totalRecord={data?.data?.Data?.TotalCount}
          rows={rows}
          columns={columns}
          height={'450px'}
          cellHeight={'45px'}
          currentPage={payload.PageIndex}
          pageSize={payload.PageLimit}
          setCurrentPage={(page: any) => setPayload({ ...payload, PageIndex: page })}
          isLoading={isLoading}
        >
        </CustomTable> */}
    </Box>
  );
}
