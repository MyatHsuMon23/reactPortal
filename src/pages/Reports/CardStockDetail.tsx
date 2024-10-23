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
import YearMonthPicker from '@/components/YearMonthPicker';
import { getItemFromStorage } from '@/utils/auth';

export default function CardStockDetail() {
  let todayDate: any = dayjs(new Date());
  let currentMonth = todayDate.$M + 1;
  let currentYear = todayDate.$y;

  interface FilterItem {
    [key: string]: string | Dayjs;
    Branch: string;
    CardAppID: string;
    TimeLimit: any;
  }
  const [filterItem, setFilterItem] = useState<FilterItem>({
    Branch: getItemFromStorage('auth').branchCode,
    CardAppID: "MPU",
    TimeLimit: todayDate
  });
  const [payload, setPayload] = useState({
    Branch: getItemFromStorage('auth').branchCode,
    CardAppID: "MPU",
    Year: currentYear.toString(),
    Month: currentMonth.toString(),
  })
  const [listParams, setListParams] = useState(commonListParams)

  const { data, isLoading } = useQueryListData({
    queryKey: "fetchCardStockDetail",
    url: `${endpoint.getCardStockDetail}`,
    config: {
      enabled: !!payload.Branch,
    },
    payload: payload,
  });

  const { data: BranchList } = useQueryListData({
    queryKey: "fetchBranchListForStockDetail",
    url: `${endpoint.getBranchList}`,
  });

  // Check if AllowAll is false in the authentication data
  var filteredBranches: any = BranchList?.data?.Data?.BranchInfo;
  if (!getItemFromStorage('auth').AllowAll) {
    // If not AllowAll, filter the BranchInfo array based on branchCode
    filteredBranches = filteredBranches?.filter((branch: any) =>
      branch.BRANCH_CODE == getItemFromStorage('auth').branchCode);
  }
  const BranchCodes = filteredBranches?.map((x: any) => ({
    name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
    value: x.BRANCH_CODE
  }));

  const [rows, setRows] = useState<any>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'CARD_APPID', headerName: 'Card App Id', flex: 1,
    },
    { field: 'BRANCH_CODE', headerName: 'Branch Code', flex: 1 },
    { field: 'BRANCH_NAME', headerName: 'Branch Name', flex: 1 },
    { field: 'QTY', headerName: 'Card Count', flex: 1 },
    { field: 'TRAN_TYPE', headerName: 'Type', flex: 1 },
    {
      field: 'TRAN_STATUS', headerName: 'Status', flex: 1
    },
    {
      field: 'TRAN_DATE', headerName: 'Date', flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.TRAN_DATE ? dayjs(new Date(params.row.TRAN_DATE)).format("DD/MM/YYYY") : "",
    },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }

  useEffect(() => {
    const filteredRows = data?.data?.Data?.TransactionList?.filter((row: any, index: number) => index >= (listParams.PageIndex - 1) * listParams.PageLimit
      && index < (listParams.PageIndex) * listParams.PageLimit);
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
            <SelectBox
              items={CardTypeList}
              name={"Card APP ID"}
              placeholder={"Card App ID"}
              value={filterItem.CardAppID}
              onChange={(value: any) => handleDataChanges("CardAppID", value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} >
            <YearMonthPicker
              name='TimeLimit'
              value={filterItem.TimeLimit}
              onChange={(value: any) => handleDataChanges("TimeLimit", value)}
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
                disabled={filterItem.Branch == ""}
                onClick={() => {
                  setPayload({
                    ...payload,
                    Branch: filterItem.Branch,
                    CardAppID: filterItem.CardAppID,
                    Year: filterItem.TimeLimit?.$y.toString(),
                    Month: (filterItem.TimeLimit?.$M + 1).toString()
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
                disabled={filterItem.Branch == ""}
                onClick={() => {
                  ExportToExcel(data?.data?.Data?.TransactionList, `CardStockDetail_${dayjs(filterItem.TimeLimit).format('YYYY_MMM')}`, columns)
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
                    Branch: getItemFromStorage('auth').branchCode,
                    CardAppID: "MPU",
                    TimeLimit: todayDate,
                  })
                  setPayload({
                    ...payload,
                    Branch: getItemFromStorage('auth').branchCode,
                    CardAppID: "MPU",
                    Year: currentYear,
                    Month: currentMonth,
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
        isLoading={payload.Branch != "" && isLoading}
        currentPage={listParams.PageIndex}
        pageSize={listParams.PageLimit}
        setCurrentPage={(page: any) =>
          setListParams({ ...listParams, PageIndex: page })}
      >
      </CustomTable>
    </Box>
  );
}
