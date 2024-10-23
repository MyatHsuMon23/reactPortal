import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./styles/GlobalStyle";
import React, { Suspense, useEffect, useState } from "react";
import ToastAlert from "./components/ToastAlert";
import DialogModal from "./components/DialogModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css'
import Loader from "./components/Loader";
import '../src/styles/Sidebar.scss'

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const AppRoutes = React.lazy(() => import('./routes/routes'));

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Loader />}>
          <QueryClientProvider client={queryClient}>
            <ToastAlert />
            <AppRoutes />
          </QueryClientProvider>
          <DialogModal />
        </Suspense>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
