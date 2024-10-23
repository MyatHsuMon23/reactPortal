import { Box, Button, Grid } from '@mui/material';
import CustomTable from '../../components/CustomTable';
import { useMutateQuery, useQueryListData } from '../../api/hooks/useQueryHook';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { getItemFromStorage } from '../../utils/auth';
import { endpoint } from '@/api/constant/endpoints';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSearchParams } from 'react-router-dom';
import { Add, Delete, EditNote, FilterAlt } from '@mui/icons-material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomSwipeableDrawer } from '@/components/CustomSwipeableDrawer';
import { commonListParams } from '@/utils/commonData';
import TextFieldBox from '@/components/TextFieldBox';
import { useQueryClient } from '@tanstack/react-query';
import { checkControlsByRole } from '@/utils/roleAccess';
import UserForm from './UserForm';
import { theme } from '@/styles/GlobalStyle';
import { removeTabIndex } from '@/utils/common';
import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';

const MySwal = withReactContent(Swal);

export default function UserList() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expended, setExpended] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState('create');
  const role = getItemFromStorage("auth")?.Role?.toUpperCase();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { mutate, isLoading: isProcessing } = useMutateQuery();
  const { setStillLoading } = useCommonDataContext();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const [payload, setPayload] = useState({
    service_id: import.meta.env.VITE_APP_SERVICE_ID,
    staff_id: "",
    ...commonListParams
  })

  interface FilterItem {
    [key: string]: string;
    staff_id: string;
  }
  const [filterItem, setFilterItem] = useState<FilterItem>({
    staff_id: "",
  });

  const { data, isLoading, refetch } = useQueryListData({
    queryKey: "fetchAllADUserList",
    url: `${endpoint.getAllADList}`,
    payload: payload,
    config: {},
    baseURL: import.meta.env.VITE_APP_AUTH_API_URL
  });

  const rows = data?.data?.Data?.ADUserList;
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', minWidth: 30, maxWidth: 100 },
    { field: 'EmployeeId', headerName: 'Employee Id', flex: 1 },
    { field: 'Name', headerName: 'Name', width: 180 },
    { field: 'RoleID', headerName: 'Role', minWidth: 170, flex: 1 },
    { field: 'BranchCode', headerName: 'Branch', flex: 1, minWidth: 80 },
    {
      field: 'SessionIssued', headerName: 'Issued Date', flex: 1, minWidth: 80,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.SessionIssued ? dayjs(new Date(params.row.SessionIssued)).format("DD/MM/YYYY") : "",
    },
    {
      field: 'SessionExpired', headerName: 'Expired Date', flex: 1, minWidth: 80,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.SessionExpired ? dayjs(new Date(params.row.SessionExpired)).format("DD/MM/YYYY") : "",
    },
    {
      field: "action", headerName: "Edit | Delete", sortable: false, width: 130, align: 'center',
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          setOpenDrawer(true);
          setMode('edit');
          setSearchParams({ employeeId: params.row.EmployeeId });
        };
        const onDeleteBtnClick = (e: any) => {
          e.stopPropagation();
          MySwal.fire({
            title: "Are you sure, you want to remove?",
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
              setStillLoading(true);
              mutate(
                {
                  url: endpoint.removeUserSession,
                  body: {
                    staff_id: params?.row?.EmployeeId,
                    name: params?.row?.Name,
                    roleId: params?.row?.RoleID,
                    branchCode: params?.row?.BranchCode,
                    service_id: import.meta.env.VITE_APP_SERVICE_ID,
                  },
                  baseURL: import.meta.env.VITE_APP_AUTH_API_URL
                },
                {
                  onSuccess: (data) => {
                    if (data?.status == 200 || data?.status == 201 || data?.status == 202) {
                      MySwal.fire({
                        html: "Record is successfully removed.",
                        icon: 'success',
                        width: 400,
                        didOpen: removeTabIndex,
                      }).then(() => {
                        setFilterItem({
                          staff_id: ""
                        })
                        setPayload({
                          ...payload,
                          staff_id: ""
                        })
                        setStillLoading(false);
                      })
                    }
                    else {
                      MySwal.fire({
                        html: data?.data?.Data?.ErrorMessage ?
                          data?.data?.Data?.ErrorMessage : data?.data?.Error?.Message || "Backend Service Failed",
                        icon: 'error',
                        width: 400,
                        didOpen: removeTabIndex,
                      }).then(() => {
                        setStillLoading(false);
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
    await queryClient.invalidateQueries(['fetchAllADUserList']);
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
        <div></div>
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
            Add New User
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <TextFieldBox
            name={"employeeId"}
            type="text"
            placeholder="Employee Id"
            value={filterItem["staff_id"]}
            onChange={(e: any) => handleDataChanges("staff_id", e.target.value)}
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
                  staff_id: filterItem.staff_id
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
                  staff_id: ""
                })
                setPayload({
                  ...payload,
                  staff_id: ""
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
      <CustomSwipeableDrawer open={openDrawer} setOpenDrawer={setOpenDrawer} width='60vw'>
        <UserForm setOpenDrawer={setOpenDrawer} mode={mode} refetchAPI={() => handleUpdate()} />
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
