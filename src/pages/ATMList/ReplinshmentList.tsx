import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useMutateQuery, useQueryListData } from '../../api/hooks/useQueryHook';
import { useListingQueryParams } from '../../utils/tableListingQueryParams';
import { useState } from "react";
import dayjs from 'dayjs';
import FilterItems from '../../components/FilterItems';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add, FilterAlt, Delete, EditNote } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import { commonListParams, atmListFilterItems } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import { useProSidebar } from 'react-pro-sidebar';
import CreateReplinshment from './CreateReplinshment';
import { useQueryClient } from '@tanstack/react-query';
import { checkControlsByRole } from '@/utils/roleAccess';
import { getItemFromStorage } from '@/utils/auth';
import { theme } from '@/styles/GlobalStyle';
import { removeTabIndex } from '@/utils/common';

const MySwal = withReactContent(Swal);

export default function ReplinshmentList() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [expended, setExpended] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [mode, setMode] = useState('create');
    const role = getItemFromStorage("auth")?.Role?.toUpperCase();
    const { mutate, isLoading: isProcessing } = useMutateQuery();
    const [payload, setPayload] = useState({
        TerminalId: "",
        ATMDesc: "",
        ...commonListParams
    })

    interface FilterItem {
        [key: string]: string;
        TerminalId: string;
        ATMDesc: string;
    }
    const [filterItem, setFilterItem] = useState<FilterItem>({
        TerminalId: "",
        ATMDesc: "",
    });

    const { data, isLoading, refetch } = useQueryListData({
        queryKey: "fetchReplinshmentList",
        url: `${endpoint.getReplinshmentList}`,
        payload: payload,
        config: {},
    });

    const rows = data?.data?.Data?.ReplishInfo;
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
        {
            field: 'CREATED_DATE', headerName: 'Date', flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.CREATED_DATE ? dayjs(new Date(params.row.CREATED_DATE)).format("DD/MM/YYYY") : "",
        },
        { field: 'TID', headerName: 'Terminal ID', flex: 1 },
        { field: 'TOTALCASHWITHDRAWAMOUNT', headerName: 'TOTAL Cash Withdraw Amount', width: 250 },
        {
            field: 'ENTRYDATE', headerName: 'Entry Date', flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.ENTRYDATE ? dayjs(new Date(params.row.ENTRYDATE)).format("DD/MM/YYYY") : "",
        },
        { field: 'ENTRYBY', headerName: 'Entry By', flex: 1 },
        {
            field: 'ISAUTHORISED', headerName: 'Active', flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.IS_ACTIVE == "1" ? "Yes" : "No",
        },
        {
            field: "action", headerName: "Edit | Delete", sortable: false, width: 130, align: 'center',
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    setOpenDrawer(true)
                    setMode('edit')
                    setSearchParams({ Id: params.row.CS_REPLINSHMODEL_ID });
                };

                const onDeleteBtnClick = (e: any) => {
                    e.stopPropagation();
                    MySwal.fire({
                        title: "Are you sure, you want to delete?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "YES",
                        cancelButtonText: "NO",
                        confirmButtonColor: theme.palette.primary.main,
                        cancelButtonColor: theme.palette.error.main,
                        iconColor: theme.palette.warning.main,
                        focusCancel: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            mutate(
                                {
                                    url: endpoint.deleteReplenish,
                                    body: {
                                        "ReplenishID": params.row.CS_REPLINSHMODEL_ID
                                    },
                                },
                                {
                                    onSuccess: (data) => {
                                        if (data?.status == 200 || data?.status == 201 || data?.status == 202) {
                                            MySwal.fire({
                                                html: "Record is successfully deleted.",
                                                icon: 'success',
                                                width: 400,
                                                didOpen: removeTabIndex,
                                            }).then(() => {
                                                refetch()
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

                return (
                    <Box display={'flex'} gap={3} justifyContent={'center'} width={'100%'}>
                        <EditNote color='primary' onClick={onClick} />
                        <Delete color='error' onClick={onDeleteBtnClick} />
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
        await queryClient.invalidateQueries(['fetchReplinshmentList']);
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
                {checkControlsByRole(role, 'ReplishmentCreate') && (
                    <Button
                        variant='contained'
                        size='medium'
                        onClick={() => {
                            setMode("create");
                            setOpenDrawer(true)
                        }}
                        color='primary'
                        startIcon={<Add style={{ fontSize: '20px' }} />}
                    >
                        Create New ATM Replenishment
                    </Button>
                )}
            </Box>
            <FilterItems
                expended={expended}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <TextFieldBox
                            name={'TerminalId'}
                            type={'text'}
                            placeholder={'Terminal Id'}
                            value={filterItem['TerminalId']}
                            onChange={(e: any) => handleDataChanges('TerminalId', e.target.value)}
                        />
                    </Grid>
                    <Grid item>
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
                                        TerminalId: filterItem.TerminalId,
                                        // ATMDesc: filterItem.ATMDesc
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
                                        TerminalId: "",
                                        ATMDesc: "",
                                    })
                                    setPayload({
                                        ...payload,
                                        TerminalId: "",
                                        // ATMDesc: "",
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
            <CustomSwipeableDrawer open={openDrawer} setOpenDrawer={setOpenDrawer} width='80vw'>
                <CreateReplinshment setOpenDrawer={setOpenDrawer} mode={mode} refetchAPI={() => handleUpdate()} />
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
            </CustomTable>
        </Box>
    );
}
