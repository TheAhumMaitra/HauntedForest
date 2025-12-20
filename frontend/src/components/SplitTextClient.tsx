// components/SplitTextClient.tsx
"use client";

import { useEffect } from "react";
import SplitText from "./SplitText";

export default function SplitTextClient(props: any) {
  useEffect(() => {
    // handle animation complete here
    const timer = setTimeout(() => {
      console.log("All letters have animated!");
    }, 1000); // adjust according to your animation duration

    return () => clearTimeout(timer);
  }, []);

  return <SplitText {...props} />;
}
