import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useQueryListData } from '../../api/hooks/useQueryHook';
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { commonListParams, CardTypeList } from '@/utils/commonData';
import { Search, FileDownload, CancelOutlined } from '@mui/icons-material';
import SelectBox from '@/components/SelectBox';
import { ExportToExcel } from '@/components/ExportToExcel';
import { getItemFromStorage } from '@/utils/auth';
import { FilterBranchByRoles } from '@/utils/common';
import CustomDatePicker from '@/components/CustomDatePicker';

export default function TopupReport() {
  let todayDate: any = dayjs(new Date());

  interface FilterItem {
    [key: string]: string | Dayjs;
    Branch: string;
    StartDate: any;
    EndDate: any;
  }
  const [filterItem, setFilterItem] = useState<FilterItem>({
    Branch: getItemFromStorage('auth').AllowAll ? "000" : getItemFromStorage('auth').branchCode,
    StartDate: "",
    EndDate: "",
  });
  const [payload, setPayload] = useState({
    Branch: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    StartDate: "",
    EndDate: ""
  })
  const [listParams, setListParams] = useState(commonListParams)

  const { data, isLoading } = useQueryListData({
    queryKey: "fetchTopupReport",
    url: `${endpoint.getTopupReport}`,
    config: {},
    payload: payload
  });

  const { data: BranchList } = useQueryListData({
    queryKey: "fetchBranchListForTopupList",
    url: `${endpoint.getBranchList}`,
  });

  var filteredBranches: any = BranchList?.data?.Data?.BranchInfo;
  // Create BranchCodes array based on the modified BranchList
  const BranchCodes = FilterBranchByRoles(filteredBranches)?.map((x: any) => ({
    name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
    value: x.BRANCH_CODE,
  }));

  const [rows, setRows] = useState<any>([]);
  const [updatedItems, setUpdatedItems] = useState<any>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'LastUpdatedDate', headerName: 'Top-up Trxn Date', flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.LastUpdatedDate ? dayjs(new Date(params.row.LastUpdatedDate)).format("DD/MM/YYYY") : "",
    },
    { field: 'CardNo', headerName: 'Card No', flex: 1 },
    { field: 'Emboss_Name', headerName: 'Card Holder Name', flex: 1 },
    { field: 'TopupAmt', headerName: 'USD Amount', flex: 1 },
    { field: 'BranchCode', headerName: 'Branch Code', flex: 1 },
    { field: 'BranchName', headerName: 'Branch Name', flex: 1 },
    { field: 'SvRefNum', headerName: 'SV Ref Number', flex: 1 },
    {
      field: 'CreatedUserId', headerName: 'Maker ID', flex: 1
    },
    { field: 'LastUpdatedUserId', headerName: 'Checker ID', flex: 1 },
    {
      field: 'TopupStatus', headerName: 'Status', flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        if (params.row.TopupStatus == "Processing") {
          return "Manual Check"
        }
        return params.row.TopupStatus
      }
    }
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }

  useEffect(() => {
    const filteredRows = data?.data?.Data?.TopupList?.filter((row: any, index: number) => index >= (listParams.PageIndex - 1) * listParams.PageLimit
      && index < (listParams.PageIndex) * listParams.PageLimit);
    const updatedList = data?.data?.Data?.TopupList?.map((item: any) => {
      if (item?.TopupStatus == "Processing") {
        return { ...item, TopupStatus: 'Manual Check' };
      }
      return item;
    });
    setUpdatedItems(updatedList);
    setRows(filteredRows);
  }, [data, listParams.PageIndex]);

  return (
    <Box component="div" style={{ width: '100%', position: 'relative' }}>
      <FilterItems
        expended={true}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={3} >
            <SelectBox
              items={BranchCodes}
              name={"Branch"}
              placeholder={"Branch"}
              value={filterItem.Branch}
              onChange={(value: any) => handleDataChanges("Branch", value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} >
            <CustomDatePicker
              name="StartDate"
              value={filterItem.StartDate}
              disableDate={(value: any) => { return value > dayjs(filterItem.EndDate) || value > dayjs(new Date()) }}
              onChange={(value: any) => handleDataChanges("StartDate", value.format('DD/MMM/YYYY'))}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} >
            <CustomDatePicker
              name="EndDate"
              value={filterItem.EndDate}
              disableDate={(value: any) => { return value < dayjs(filterItem.StartDate) || value > dayjs(new Date()) }}
              onChange={(value: any) => handleDataChanges("EndDate", value.format('DD/MMM/YYYY'))}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <Button
                variant='contained'
                size='medium'
                color='secondary'
                sx={{ margin: '0 10px 0 0' }}
                endIcon={<Search />}
                onClick={() => {
                  setPayload({
                    ...payload,
                    Branch: filterItem.Branch === '000' ? "" : filterItem.Branch,
                    StartDate: filterItem.StartDate?.toString(),
                    EndDate: filterItem.EndDate?.toString(),
                  })
                }}
              >
                Search
              </Button>
              <Button
                variant='contained'
                size='medium'
                type='button'
                endIcon={<FileDownload />}
                onClick={() => {
                  ExportToExcel(updatedItems, `TopupReport${filterItem.StartDate ? "_" + dayjs(filterItem.StartDate).format('YYYY_MMM') : ""}`, columns)
                }}
                color='warning'
                sx={{ margin: '0 10px 0 0' }}
              >
                Export
              </Button>
              <Button
                variant='outlined'
                size='medium'
                type='button'
                endIcon={<CancelOutlined />}
                onClick={() => {
                  setFilterItem({
                    ...filterItem,
                    Branch: getItemFromStorage('auth').AllowAll ? "000" : getItemFromStorage('auth').branchCode,
                    CardAppID: "MPU",
                    TimeLimit: todayDate,
                  })
                  setPayload({
                    ...payload,
                    Branch: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
                    StartDate: "",
                    EndDate: "",
                    ...commonListParams
                  })
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
      <CustomTable
        totalRecord={data?.data?.Data?.TotalCount}
        rows={rows}
        columns={columns}
        height={'450px'}
        cellHeight={'45px'}
        rowHeight={60}
        isLoading={isLoading}
        currentPage={listParams.PageIndex}
        pageSize={listParams.PageLimit}
        setCurrentPage={(page: any) =>
          setListParams({ ...listParams, PageIndex: page })}
      >
      </CustomTable>
    </Box>
  );
}
