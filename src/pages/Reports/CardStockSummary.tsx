import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useQueryListData } from '../../api/hooks/useQueryHook';
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import { GridColDef } from '@mui/x-data-grid';
import { commonListParams, CardTypeList } from '@/utils/commonData';
import { Search, FileDownload, CancelOutlined } from '@mui/icons-material';
import SelectBox from '@/components/SelectBox';
import { ExportToExcel } from '@/components/ExportToExcel';
import YearMonthPicker from '@/components/YearMonthPicker';
import { getItemFromStorage } from '@/utils/auth';
import { FilterBranchByRoles } from '@/utils/common';

export default function CardStockSummary() {
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
    Branch: getItemFromStorage('auth').AllowAll ? "000" : getItemFromStorage('auth').branchCode,
    CardAppID: "MPU",
    TimeLimit: todayDate
  });
  const [payload, setPayload] = useState({
    Branch: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    CardAppID: "MPU",
    Year: currentYear.toString(),
    Month: currentMonth.toString(),
  })
  const [listParams, setListParams] = useState(commonListParams)

  const { data, isLoading } = useQueryListData({
    queryKey: "fetchCardStockSummary",
    url: `${endpoint.getCardStockSummaryList}`,
    config: {},
    payload: payload
  });

  const { data: BranchList } = useQueryListData({
    queryKey: "fetchBranchListForStockSummary",
    url: `${endpoint.getBranchList}`,
  });

  var filteredBranches: any = BranchList?.data?.Data?.BranchInfo;
  // Create BranchCodes array based on the modified BranchList
  const BranchCodes = FilterBranchByRoles(filteredBranches)?.map((x: any) => ({
    name: `${x.BRANCH_CODE} | ${x.BRANCH_NAME}`,
    value: x.BRANCH_CODE,
  }));

  const [rows, setRows] = useState<any>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    {
      field: 'CARD_APPID', headerName: 'Card App Id', flex: 1,
    },
    { field: 'BRANCH_CODE', headerName: 'Branch Code', flex: 1 },
    { field: 'BRANCH_NAME', headerName: 'Branch Name', flex: 1 },
    { field: 'OPENING_STOCK', headerName: 'Opening Stock', flex: 1 },
    { field: 'ADJUSTMENT_COUNT', headerName: 'Adjustment', flex: 1 },
    {
      field: 'TOTAL_RECEIVED', headerName: 'Received Count', flex: 1
    },
    { field: 'TOTAL_ISSUED', headerName: 'Issue Count', flex: 1 },
    { field: 'PHYSICAL_CARD_BALANCE', headerName: 'Available Card Balance', minWidth: 180 },
    { field: 'MINIMUN_CARD_LIMIT', headerName: 'Minimum Card Limit', flex: 1, minWidth: 170 },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }

  useEffect(() => {
    const filteredRows = data?.data?.Data?.InverntoryList?.filter((row: any, index: number) => index >= (listParams.PageIndex - 1) * listParams.PageLimit
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
                onClick={() => {
                  setPayload({
                    ...payload,
                    Branch: filterItem.Branch === '000' ? "" : filterItem.Branch,
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
                onClick={() => {
                  ExportToExcel(data?.data?.Data?.InverntoryList, `CardStockSummary_${dayjs(filterItem.TimeLimit).format('YYYY_MMM')}`, columns)
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
