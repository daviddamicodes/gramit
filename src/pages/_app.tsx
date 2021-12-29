// import App from "next/app";
import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import type { AppProps } from "next/app";
import Amplify from "aws-amplify";

import awsconfig from "../aws-exports";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";

Amplify.configure({ ...awsconfig, ssr: true });

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// function MyApp({
//   Component,
//   emotionCache = clientSideEmotionCache,
//   pageProps,
// }: AppProps) {
function MyApp(AppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = AppProps;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Gramit</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthContext>
        <ThemeProvider theme={theme}>
          <Header />
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthContext>
    </CacheProvider>
  );
}

export default MyApp;
