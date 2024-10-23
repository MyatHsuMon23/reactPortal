import { FC, ReactElement, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';//useTheme
import { Box, Typography, Paper, Grid } from '@mui/material';
import SummaryCard from './SummaryCard';
import { Beenhere, Publish, CancelPresentation, Drafts } from '@mui/icons-material';
import BarChart from './BarChart';
import PieChart from './PieChart';
import { LineChart } from './LineChart';
import DoughnutChart from './Doughnut';
import axios from 'axios';
import { useQueryListData } from '@/api/hooks/useQueryHook';
import { endpoint } from '@/api/constant/endpoints';
import { getItemFromStorage } from '@/utils/auth';
import { LoaderWithBackdrop } from '@/components/Loader';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? 'whitesmoke' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const boxShadow = '0px 3px 9px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12), 0px -2px 3px 0px rgba(0,0,0,0.12)';

const Dashboard: FC = (): ReactElement => {
  const { data, isLoading: issueLoading } = useQueryListData({
    queryKey: "fetchInstantCardIssue",
    url: `${endpoint.getInstantCardIssueList}`,
    payload: {
      CustomerId: "",
      TemplateName: "",
      IssuingStatus: "",
      BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
      PageIndex: 1,
      PageLimit: 99999,
    },
    config: {},
  });

  const { data: adjustmentData, isLoading: adjustmentLoading } = useQueryListData({
    queryKey: "fetchCardAdjustmentList",
    url: `${endpoint.getCardAdjustmentList}`,
    payload: {
      BranchCode: getItemFromStorage('auth').AllowAll ? "" : getItemFromStorage('auth').branchCode,
      PageIndex: 1,
      PageLimit: 99999,
    }
  });

  const SaveDraft = data?.data?.Data?.CardRequestDto?.filter((x: any) => x.IssuingStatus === 'SaveDraft');
  const Rejected = data?.data?.Data?.CardRequestDto?.filter((x: any) => x.IssuingStatus === 'Rejected');
  const Submitted = data?.data?.Data?.CardRequestDto?.filter((x: any) => x.IssuingStatus === 'Submitted');
  const Approved = data?.data?.Data?.CardRequestDto?.filter((x: any) => x.IssuingStatus === 'Approved');

  const AdjustmentIn = adjustmentData?.data?.Data?.CardAdjustment?.filter((x: any) => x.ActionStatus?.toLowerCase() === 'in');
  const AdjustmentOut = adjustmentData?.data?.Data?.CardAdjustment?.filter((x: any) => x.ActionStatus?.toLowerCase() === 'out');

  // const TotalReceivedCount = data.Data.InverntoryList.reduce((sum: any, item: any) => sum + item.TOTAL_RECEIVED, 0);


  const adjustments = {
    labels: ['IN', 'OUT'],
    datasets: [
      {
        data: [AdjustmentIn ? AdjustmentIn.length : 0, AdjustmentOut ? AdjustmentOut.length : 0],
        backgroundColor: [
          '#937DE4',
          '#9F5BAD',
        ],
        borderWidth: 1,
      },
    ],
  };

  const StockSummary = {
    labels: ['Opening Balance', 'Received Count', 'Issuing Count', 'Hand Balance'],
    datasets: [
      {
        data: [150, 200, 80, 275],
        backgroundColor: [
          '#937DE4',
          '#00227B',
          '#715C18',
          '#9D4B92',
        ],
        borderWidth: 1,
      },
    ],
  };

  const ReceivedList = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Received',
        data: [19, 5, 9, 12, 5, 11],
        backgroundColor: '#845EC2',
      },
      {
        label: 'Not Received',
        data: [10, 5, 3, 10, 5, 15],
        backgroundColor: '#0089BA'
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, p: '1px 10px' }} >
      <LoaderWithBackdrop open={issueLoading || adjustmentLoading} />
      <Grid container spacing={2} marginTop={'5px'}>
        <Grid item xs={10} md={6} xl={3}>
          <Box sx={{
            borderColor: '#d9d2ff',
            borderRadius: '7px',
            padding: '10px 15px',
            borderWidth: '1px',
            backgroundColor: 'white',
            boxShadow: boxShadow
          }}>
            <Typography textAlign={'center'} fontWeight={600} color={'#666666'} fontSize={'14px'}>Card Issuing</Typography>
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={'10px'} mt={'7px'}>
              <SummaryCard title={SaveDraft ? SaveDraft.length : '0'} description={'Save As Draft'} icon={<Drafts />} bgColor='#8190FF' url="/instantCardIssue" />
              <SummaryCard title={Submitted ? Submitted.length : '0'} description={'Submitted'} icon={<Publish />} bgColor='#8D8DB9' url="/instantCardIssue" />
              <SummaryCard title={Approved ? Approved.length : '0'} description={'Approved'} icon={<Beenhere sx={{ fontSize: '20px !important' }} />} bgColor='#00B785' url="/instantCardIssue" />
              <SummaryCard title={Rejected ? Rejected.length : '0'} description={'Declined'} icon={<CancelPresentation />} bgColor='#FF5A6B' url="/instantCardIssue" />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10} md={6} xl={4}>
          <Item sx={{ height: 300, boxShadow: boxShadow }}>
            <DoughnutChart data={adjustments} />
          </Item>
        </Grid>
        <Grid item xs={10} md={6} xl={5}>
          <Item sx={{ height: 300, boxShadow: boxShadow }}>
            <PieChart data={StockSummary} />
          </Item>
        </Grid>
        <Grid item xs={10} md={6} xl={6}>
          <Item sx={{ height: 300, boxShadow: boxShadow }}>
            <BarChart data={ReceivedList} />
          </Item>
        </Grid>
        <Grid item xs={10} md={6} xl={6}>
          <Item sx={{ height: 300, boxShadow: boxShadow }}>
            <LineChart />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;