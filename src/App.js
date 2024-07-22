import React from 'react';
import DataTable from './components/DataTable';
import { Typography } from '@mui/material';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography sx={{
          ml:"20px",
                      backgroundColor: "initial",
                      fontSize: "28px",
                      paddingY: 0.5,
                      paddingX: 1,
                      borderRadius: "initial",
                    }}
>
          Car Data
        </Typography>
      </header>
      <main>
        <DataTable />
      </main>
    </div>
  );
}

export default App;