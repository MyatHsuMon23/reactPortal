import { FC, ReactElement } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';


interface SummaryCardProps {
  title: string;
  description: string;
  icon: ReactElement;
  bgColor: string;
  url: string;
}
const boxShadow = '0px 3px 9px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12), 0px -2px 3px 0px rgba(0,0,0,0.12)';

const SummaryCard: FC<SummaryCardProps> = ({ title, description, icon, bgColor, url }): ReactElement => {
  return (
    <div style={{ position: 'relative', cursor: 'pointer', width: '100%' }} onClick={() => window.location.href = url}>
      <Card sx={{
        p: 3,
        bgcolor: bgColor,
        height: '56px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        boxShadow: 2
      }}>
        <CardContent sx={{ padding: '0 !important', textAlign: 'start' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translate(-50%, -50%)',
            background: '#ffffff80',
            width: '40px',
            height: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '5px',
          }}>
            {icon}
          </div>
          <Typography gutterBottom sx={{ mb: 0, fontSize: '18px', fontWeight: '600', color: '#FFF' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '10pt', color: '#FFF', mt: 0 }} color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
// { xs:'7pt', sm:'8pt', md:'9', lg:'10pt'}
export default SummaryCard;

