"use client";

import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type Chart = {
  kind: string;
  title: string;
  x: number[];
  y: number[];
  xLabel: string;
  yLabel: string;
};

export function StudyChart({ chart }: { chart: Chart }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  const isBar = chart.kind === "bar";
  const option = {
    animation: ready,
    animationDuration: 700,
    grid: { left: 48, right: 24, top: 40, bottom: 48 },
    title: {
      text: chart.title,
      left: 0,
      textStyle: {
        color: "var(--text)",
        fontFamily: "var(--font-display)",
        fontSize: 14,
        fontWeight: 600,
      },
    },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: isBar ? "category" : "value",
      data: isBar ? chart.x.map(String) : undefined,
      name: chart.xLabel,
      nameLocation: "middle",
      nameGap: 28,
      axisLine: { lineStyle: { color: "#55616B" } },
      splitLine: { show: !isBar, lineStyle: { color: "#E3E8EC" } },
    },
    yAxis: {
      type: "value",
      name: chart.yLabel,
      nameLocation: "middle",
      nameGap: 36,
      axisLine: { lineStyle: { color: "#55616B" } },
      splitLine: { lineStyle: { color: "#E3E8EC" } },
    },
    series: [
      {
        type: isBar ? "bar" : "line",
        data: isBar ? chart.y : chart.x.map((x, i) => [x, chart.y[i]]),
        showSymbol: true,
        symbolSize: 8,
        lineStyle: { width: 2, color: "#F26B1D" },
        itemStyle: { color: "#00B8D4" },
        areaStyle: isBar
          ? undefined
          : { color: "rgba(242,107,29,0.12)" },
        barWidth: 28,
      },
    ],
  };

  return (
    <div className="panel" style={{ padding: "0.5rem" }}>
      <ReactECharts option={option} style={{ height: 320, width: "100%" }} opts={{ renderer: "svg" }} />
    </div>
  );
}
