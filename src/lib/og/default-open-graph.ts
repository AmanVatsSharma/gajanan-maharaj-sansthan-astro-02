import React from "react";
import { ImageResponse } from "@vercel/og";

const size = { width: 1200, height: 630 };

/** Default OG image — parity with former `src/app/opengraph-image.tsx` */
export function getDefaultOpenGraphResponse(): ImageResponse {
  const el = React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        textAlign: "center",
        background:
          "linear-gradient(135deg, rgba(88, 20, 20, 1) 0%, rgba(201, 138, 44, 1) 45%, rgba(88, 20, 20, 1) 100%)",
        color: "#ffffff",
      },
    },
    React.createElement(
      "div",
      { style: { fontSize: 64, fontWeight: 800, letterSpacing: -1 } },
      "Shri Gajanan Maharaj Sansthan"
    ),
    React.createElement(
      "div",
      { style: { fontSize: 30, marginTop: 14, opacity: 0.95 } },
      "Shegaon • Official Website"
    ),
    React.createElement(
      "div",
      { style: { fontSize: 22, marginTop: 28, opacity: 0.9 } },
      "Accommodation • Locations • Devotee Information"
    )
  );

  return new ImageResponse(el, size);
}
