import React from "react";
import { ImageResponse } from "@vercel/og";

const size = { width: 1200, height: 630 };

export function getTwitterImageResponse(): ImageResponse {
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
          "linear-gradient(135deg, rgba(201, 138, 44, 1) 0%, rgba(88, 20, 20, 1) 60%, rgba(20, 20, 20, 1) 100%)",
        color: "#ffffff",
      },
    },
    React.createElement(
      "div",
      { style: { fontSize: 58, fontWeight: 800, letterSpacing: -1 } },
      "Shri Gajanan Maharaj Sansthan"
    ),
    React.createElement(
      "div",
      { style: { fontSize: 28, marginTop: 14, opacity: 0.95 } },
      "Accommodation booking help • WhatsApp & Call"
    )
  );

  return new ImageResponse(el, size);
}
