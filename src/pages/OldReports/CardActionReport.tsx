import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useQueryListData } from '../../api/hooks/useQueryHook';
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { commonListParams, CardTypeList, cardType } from '@/utils/commonData';
import { Search, FileDownload, CancelOutlined } from '@mui/icons-material';
import SelectBox from '@/components/SelectBox';
import { ExportToExcel } from '@/components/ExportToExcel';
import YearMonthPicker from '@/components/YearMonthPicker';
import { getItemFromStorage } from '@/utils/auth';
import TextFieldBox from '@/components/TextFieldBox';
import { FilterBranchByRoles } from '@/utils/common';

export default function CardActionReport() {
    interface FilterItem {
        [key: string]: string | Dayjs;
        CardNo: string;
        AccNo: string;
    }
    const [filterItem, setFilterItem] = useState<FilterItem>({
        CardNo: "",
        AccNo: "",
    });
    const [payload, setPayload] = useState({
        CardNo: "",
        AccNo: ""
    })

    const [listParams, setListParams] = useState(commonListParams)

    const { data, isLoading } = useQueryListData({
        queryKey: "fetchOldCardclosingList",
        url: `${endpoint.getCardActionReport}`,
        config: {},
        payload: payload
    });

    const [rows, setRows] = useState<any>([]);
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 80 },
        { field: 'BranchUser', headerName: 'Branch User', flex: 1, minWidth: 150 },
        { field: 'BranchCode', headerName: 'Branch Code', flex: 1 },
        { field: 'Action', headerName: 'Action', flex: 1, minWidth: 130 },
        { field: 'Message', headerName: 'Message', flex: 1, minWidth: 300 },
        { field: 'CreatedUserId', headerName: 'Created UserId', flex: 1, minWidth: 300 },
    ];

    const handleDataChanges = (name: any, value: any) => {
        setFilterItem({ ...filterItem, [name]: value })
    }

    useEffect(() => {
        const filteredRows = data?.data?.Data?.SVTranInfo?.filter((row: any, index: number) => index >= (listParams.PageIndex - 1) * listParams.PageLimit
            && index < (listParams.PageIndex) * listParams.PageLimit);
        setRows(filteredRows);
    }, [data, listParams.PageIndex]);

    return (
        <Box component="div" style={{ width: '100%', position: 'relative' }}>
        <div style={{margin: '15px 0', fontWeight: 500, color: "#db7312"}}> ** Only Card Block & Pin Reset Records</div>
            <FilterItems
                expended={true}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={3} lg={2} >
                        <TextFieldBox
                            name={"AccountNumber"}
                            type={"number"}
                            placeholder={"AccountNumber"}
                            value={filterItem["AccNo"]}
                            onChange={(e: any) => handleDataChanges("AccNo", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={2} >
                        <TextFieldBox
                            name={"CardNumber"}
                            type={"number"}
                            placeholder={"CardNumber"}
                            value={filterItem["CardNo"]}
                            onChange={(e: any) => handleDataChanges("CardNo", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                        <Box display={'flex'} justifyContent={'flex-start'}>
                            <Button
                                variant='contained'
                                size='medium'
                                color='secondary'
                                sx={{ margin: '0 10px 0 0' }}
                                endIcon={<Search />}
                                onClick={() => {
                                    setPayload({
                                        ...payload,
                                        CardNo: filterItem.CardNo,
                                        AccNo: filterItem.AccNo
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
                                    ExportToExcel(data?.data?.Data?.SVTranInfo, `CardActionReport_${dayjs(filterItem.fromDate).format('YYYY_MMM')}`, columns)
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
                                        CardNo: "",
                                        AccNo: ""
                                    })
                                    setPayload({
                                        ...payload,
                                        CardNo: "",
                                        AccNo: ""
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
