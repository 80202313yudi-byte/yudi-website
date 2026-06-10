import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "FISHDI AI Visual Designer & Content Creator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080808",
          color: "#f5f5f5",
          padding: "68px 76px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22 }}>
          <div
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: "#c9ff45",
              color: "#080808",
              fontWeight: 800,
            }}
          >
            F
          </div>
          FISHDI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ color: "#c9ff45", fontSize: 22, fontWeight: 700 }}>
            AI VISUAL · DESIGN · CREATION
          </div>
          <div style={{ maxWidth: 920, fontSize: 84, fontWeight: 700, lineHeight: 1.04 }}>
            Ideas made visible.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 24,
            color: "#a8a8a8",
            fontSize: 20,
          }}
        >
          <span>Visual systems · AI narratives</span>
          <span>Portfolio 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
