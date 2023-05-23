import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/Layout";
import Router from "next/router";
import nProgress from "nprogress";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import { DataContextProvider } from "../context/DataContext";
import { useEffect, useState } from "react";

// nprogress loader
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({ Component, pageProps }: AppProps) {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const client = new QueryClient();

  useEffect(() => {
    const initialWidth = window?.innerWidth;
    setWidth(initialWidth);
    if (initialWidth <= 700) setVisible(true);

    window.addEventListener("resize", (e) => {
      const width = (e.target as any)?.innerWidth;
      setWidth(width);
      if (width <= 700) {
        setVisible(true);
        return;
      }
      setVisible(false);
    });

    return () => window.removeEventListener("resize", () => {});
  }, [width]);

  if (visible) {
    return <UnresponsiveMessage />;
  }

  return (
    <QueryClientProvider client={client}>
      <ChakraProvider>
        <DataContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DataContextProvider>
      </ChakraProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

function UnresponsiveMessage() {
  return (
    <div className="w-full bg-dark-300 h-screen flex flex-col items-center justify-center text-center  ">
      <div className="w-full max-w-[400px] flex flex-col items-center justify-center text-center">
        <span className="text-5xl">😞</span>
        <h1 className="font-pp-sb text-[20px] text-white-100 mt-2 ">
          Showwcial Message
        </h1>
        <p className="text-white-400 text-[14px] font-pp-rg">
          Showwcial is unresponsive to this screen size. We recommend viewing
          this on a <span className="text-white-100">Desktop</span> device.{" "}
        </p>
      </div>
    </div>
  );
}
