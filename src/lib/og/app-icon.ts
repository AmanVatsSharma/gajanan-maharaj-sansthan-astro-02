import React from "react";
import { ImageResponse } from "@vercel/og";

export function getAppIcon32Response(): ImageResponse {
  const el = React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        background: "linear-gradient(135deg, #5b1c1c 0%, #c98a2c 100%)",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: -0.5,
      },
    },
    "SG"
  );
  return new ImageResponse(el, { width: 32, height: 32 });
}

export function getAppleTouchIconResponse(): ImageResponse {
  const el = React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
        background: "linear-gradient(135deg, #5b1c1c 0%, #c98a2c 100%)",
        color: "#ffffff",
        fontSize: 72,
        fontWeight: 900,
        letterSpacing: -2,
      },
    },
    "SG"
  );
  return new ImageResponse(el, { width: 180, height: 180 });
}
