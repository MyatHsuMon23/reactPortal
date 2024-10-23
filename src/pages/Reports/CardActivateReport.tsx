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
import TextFieldBox from '@/components/TextFieldBox';
import { FilterBranchByRoles } from '@/utils/common';

export default function CardActivateReport() {
  let todayDate: any = dayjs(new Date()).format('YYYY-MM-DD');

  interface FilterItem {
    [key: string]: string | Dayjs;
    CardNumber: string;
    BranchCode: string;
    fromDate: string;
  }
  const [filterItem, setFilterItem] = useState<FilterItem>({
    CardNumber: "",
    BranchCode: getItemFromStorage('auth').AllowAll ? "000" : getItemFromStorage('auth').branchCode,
    fromDate: todayDate
  });
  const [payload, setPayload] = useState({
    CardNumber: "",
    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
    IsAdmin: getItemFromStorage('auth').AllowAll,
    fromDate: todayDate
  })
  const [listParams, setListParams] = useState(commonListParams)

  const { data, isLoading } = useQueryListData({
    queryKey: "fetchCardActivateList",
    url: `${endpoint.getCardActivatedReport}`,
    config: {},
    payload: payload
  });

  const { data: BranchList } = useQueryListData({
    queryKey: "fetchBranchListForCardActivateReport",
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
      field: 'CREATED_DATE', headerName: 'Created Date', flex: 1, minWidth: 120,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.CREATED_DATE ? dayjs(new Date(params.row.CREATED_DATE)).format("DD/MM/YYYY") : "",
    },
    { field: 'NAME', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'BRANCHCODE', headerName: 'Branch Code', flex: 1, minWidth: 130 },
    { field: 'BRANCH_NAME', headerName: 'Branch Name', flex: 1, minWidth: 130 },
    { field: 'CARDNUMBER', headerName: 'Card No', width: 150 },
    { field: 'PRODUCTNAME', headerName: 'Product Name', width: 200 },
  ];

  const handleDataChanges = (name: any, value: any) => {
    setFilterItem({ ...filterItem, [name]: value })
  }

  useEffect(() => {
    const filteredRows = data?.data?.Data?.CardActivateInfo?.filter((row: any, index: number) => index >= (listParams.PageIndex - 1) * listParams.PageLimit
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
            <TextFieldBox
              name={"CardNumber"}
              type={"number"}
              placeholder={"CardNumber"}
              value={filterItem["CardNumber"]}
              onChange={(e: any) => handleDataChanges("CardNumber", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} >
            <SelectBox
              items={BranchCodes}
              name={"BranchCode"}
              placeholder={"BranchCode"}
              value={filterItem.BranchCode}
              onChange={(value: any) => handleDataChanges("BranchCode", value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} >
            <YearMonthPicker
              name='fromDate'
              value={filterItem.fromDate}
              onChange={(value: any) => handleDataChanges("fromDate", value.format('YYYY-MM-DD'))}
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
                    CardNumber: filterItem.CardNumber,
                    BranchCode: filterItem.BranchCode === '000' ? "" : filterItem.BranchCode,
                    fromDate: filterItem.fromDate,
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
                  ExportToExcel(data?.data?.Data?.CardActivateInfo, `CardActivateReport_${dayjs(filterItem.fromDate).format('YYYY_MMM')}`, columns)
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
                    BranchCode: getItemFromStorage('auth').AllowAll ? "000" : getItemFromStorage('auth').branchCode,
                    CardNumber: "",
                    fromDate: todayDate,
                  })
                  setPayload({
                    ...payload,
                    CardNumber: "",
                    BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
                    fromDate: todayDate,
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
