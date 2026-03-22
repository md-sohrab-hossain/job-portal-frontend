"use client";
import { createTheme, MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

const theme = createTheme({});

const MantProvider = ({ children }: { children: ReactNode }) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};

export default MantProvider;
