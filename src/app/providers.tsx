"use client"

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import {store} from "../redux/store";
import StorageWrapper from "../components/ecommerce/storage-wrapper";
import Preloader from "../components/elements/Preloader";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Preloader /> : <Provider store={store}><StorageWrapper>{children}</StorageWrapper></Provider>;
}
