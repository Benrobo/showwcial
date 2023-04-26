import React from "react";

function Gap({ height }: { height?: number }) {
  return <div style={{ width: "100%", height: height ?? 50 }}></div>;
}

export default Gap;
