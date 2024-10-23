import { Box } from '@mui/material';
import React, { FC } from "react";
type FilterProps = {
  expended: boolean;
  children?: React.ReactNode;
  title?: string;
}

const FilterItems: FC<FilterProps> = ({ children, expended, title }) => {

  return (
    <Box component={'fieldset'} sx={{
      display: expended ? 'block' : 'none',
      opacity: 0,
      animation: 'show 1s  forwards',
      border: '1px solid #cacbd0',
      margin: '10px 0',
      padding: '15px',
      borderRadius: '5px',
      background: '#FFF',
      marginTop: '10px',
    }}>
      <legend>{title? title : 'Filter By'}</legend>
      {children}
    </Box>
  );
}
export default FilterItems;