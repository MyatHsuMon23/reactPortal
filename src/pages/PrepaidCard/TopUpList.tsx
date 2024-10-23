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
import { Add, EditNote, FilterAlt, Search } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import { commonListParams } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import SelectBox from '@/components/SelectBox';
import { useQueryClient } from '@tanstack/react-query';
import { checkControlsByRole } from '@/utils/roleAccess';
import { FilterBranchByRoles } from '@/utils/common';
import TopUpForm from './TopUpForm';

const MySwal = withReactContent(Swal);

export default function TopUpList() {
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
        CardNumber: "",
        BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
        ...commonListParams
    })

    interface FilterItem {
        [key: string]: string;
        CardNumber: string;
    }
    const [filterItem, setFilterItem] = useState<FilterItem>({
        CardNumber: "",
    });

    const { data, isLoading } = useQueryListData({
        queryKey: "fetchTopupList",
        url: `${endpoint.getTopupList}`,
        payload: payload,
        baseURL: import.meta.env.VITE_SVBO2_NEOCDMS,
        config: {},
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


    const rows = data?.data?.Data?.List;
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 70 },
        {
            field: 'CreatedDate', headerName: 'Created Date', flex: 1, minWidth: 130,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.CreatedDate ? dayjs(new Date(params.row.CreatedDate)).format("DD/MM/YYYY") : "",
        },
        { field: 'BranchCode', headerName: 'Branch Code', flex: 1, minWidth: 80 },
        { field: 'BranchName', headerName: 'Branch Name', minWidth: 150, maxWidth: 200 },
        { field: 'CardNumber', headerName: 'Card Number', width: windowWidth <= 1500 ? 120 : 170 },
        { field: 'EmbossName', headerName: 'EmbossName', flex: 1},
        { field: 'CreatedUserId', headerName: 'Created User', minWidth: 150 },
        { field: 'TopupAmount', headerName: 'Topup Amount', minWidth: 120, flex: 1 },
        {
            field: 'TopupStatus', headerName: 'Status', width: 130,
        },
        {
            field: "action", headerName: "Action", sortable: false, width: 80, align: 'right',
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation();
                    setOpenDrawer(true)
                    setMode('edit')
                    setSearchParams({ TopupId: params.row.TopupId });
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
        await queryClient.invalidateQueries(['fetchTopupList']);
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
                {checkControlsByRole(role, 'TopUpCreate') && (
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
                        Create TopUp
                    </Button>
                )}
            </Box>
            <FilterItems
                expended={expended}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4} lg={4} >
                        <TextFieldBox
                            name={"CardNumber"}
                            type={"number"}
                            placeholder={"CardNumber"}
                            value={filterItem["CardNumber"]}
                            onChange={(e: any) => handleDataChanges("CardNumber", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} >
                        <SelectBox
                            items={BranchCodes}
                            name={"BranchCode"}
                            placeholder={"BranchCode"}
                            value={filterItem.BranchCode}
                            onChange={(value: any) => handleDataChanges("BranchCode", value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <Button
                                variant='contained'
                                size='medium'
                                color='secondary'
                                sx={{ margin: '0 10px 0 0' }}
                                onClick={() => {
                                    setPayload({
                                        ...payload,
                                        CardNumber: filterItem.CardNumber,
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
                                        CardNumber: "",
                                    })
                                    setPayload({
                                        ...payload,
                                        CardNumber: "",
                                        BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
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
            <CustomSwipeableDrawer open={openDrawer} setOpenDrawer={setOpenDrawer} width='55vw'>
                <TopUpForm setOpenDrawer={setOpenDrawer} mode={mode} refetchAPI={() => handleUpdate()} />
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
