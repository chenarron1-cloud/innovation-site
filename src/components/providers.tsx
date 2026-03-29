"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#FDFBF8",
            color: "#1A1208",
            border: "1px solid #E4DDD3",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    </SessionProvider>
  );
}
