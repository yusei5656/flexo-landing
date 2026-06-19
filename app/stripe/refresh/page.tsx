"use client";
import { useEffect } from "react";

export default function StripeRefresh() {
  useEffect(() => {
    window.location.replace("com.yusei.flexo://stripe-refresh");
  }, []);
  return <p style={{ padding: 24, fontFamily: "system-ui" }}>
    Returning to Flexo… If it doesn't open, please launch the app.
  </p>;
}
