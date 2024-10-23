import { Box, Button, Typography, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { decorateTableProps } from '../../types/decorateTableProps';
import { useMutateQuery, useQueryListData } from '../../api/hooks/useQueryHook';
import { useListingQueryParams } from '../../utils/tableListingQueryParams';
import Loader from '../../components/Loader';
import React, { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add, FilterAlt, EditNote } from '@mui/icons-material';
import { instantCardList } from '@/data/Data';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { instantFilterItems, commonListParams } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import DebitCardInfoUpdateForm from './DebitCardInfoUpdateForm';
import { getItemFromStorage } from '@/utils/auth';
import { useQueryClient } from '@tanstack/react-query';
import { checkControlsByRole } from '@/utils/roleAccess';

const MySwal = withReactContent(Swal);

export default function DebitCardInfoUpdate() {
    let date = new Date();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [expended, setExpended] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [mode, setMode] = useState('create');
    const role = getItemFromStorage("auth")?.Role?.toUpperCase();
    const [payload, setPayload] = useState({
        CustomerId: "",
        Status: "",
        CustomerType: "DebitCardKYC",
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

    const { data, isLoading } = useQueryListData({
        queryKey: "fetchDebitCardKYC",
        url: `${endpoint.getKYCInfoUpdateList}`,
        payload: payload,
        config: {},
    });

    const rows = data?.data?.Data?.CustomerUpdateList;
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
        {
            field: 'CreatedDate', headerName: 'Created Date', flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.CreatedDate ? dayjs(new Date(params.row.CreatedDate)).format("DD/MM/YYYY") : "",
        },
        { field: 'BranchCode', headerName: 'Agent Id', flex: 1 },
        // { field: 'ApplicationId', headerName: 'App Id', flex: 1 },
        // { field: 'TemplateName', headerName: 'Template Name', width: 240 },
        { field: 'CustomerId', headerName: 'Customer Id', flex: 1 },
        { field: 'FirstName', headerName: 'Name', width: 170 },
        { field: 'MobilePhone', headerName: 'Phone No', type: 'number', flex: 1 },
        {
            field: 'Status', headerName: 'Status', flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.Status == "SaveDraft" ? 'Save as draft' :
                    params.row.Status == "Submitted" ? 'Submitted' :
                        params.row.Status == "Approved" ? 'Approved' :
                            params.row.Status == "Processing" ? 'Processing' :
                                'Declined',
        },
        {
            field: "action", headerName: "Action", sortable: false, width: 100, align: 'right',
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    setOpenDrawer(true)
                    setMode('edit')
                    setSearchParams({ Id: params.row.UpdateCustomerId });
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
        await queryClient.invalidateQueries(['fetchDebitCardKYC']);
        setPayload({ ...payload, PageIndex: 1 })
    };

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
                {checkControlsByRole(role, 'DebitKYCUpdateCreate') && (
                    <Button
                        variant='contained'
                        size='medium'
                        onClick={() => {
                            setOpenDrawer(true)
                            setMode('create');
                        }}
                        color='primary'
                        startIcon={<Add style={{ fontSize: '20px' }} />}
                    >
                        Debit KYC Info Update (BTRT30)

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
                                        Status: filterItem.AppStatus
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
                                        Status: ""
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
                <DebitCardInfoUpdateForm setOpenDrawer={setOpenDrawer} mode={mode} refetchAPI={() => handleUpdate()} />
            </CustomSwipeableDrawer>
            <CustomTable
                totalRecord={data?.data?.Data?.TotalCount}
                rows={rows}
                columns={columns}
                height={'450px'}
                cellHeight={'45px'}
                rowHeight={60}
                currentPage={payload.PageIndex}
                pageSize={payload.PageLimit}
                setCurrentPage={(page: any) => setPayload({ ...payload, PageIndex: page })}
                isLoading={isLoading}
            >
            </CustomTable>
        </Box>
    );
}
