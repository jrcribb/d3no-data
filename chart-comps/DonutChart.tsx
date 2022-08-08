/** @jsx h */
import { h, useEffect, Fragment, d3 } from "../mod.ts";
import { DonutChartProps } from "../ChartProps/DonutChartProps.ts";

export default function DonutChart(props: DonutChartProps) {
  const padding = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };
  const width = 500 - padding.left - padding.right;
  const height = 500 - padding.top - padding.bottom;
  const radius = Math.min(height, width) / 2;
  const fontFamily = props.fontFamily || "Verdana";
  const setTitle = props.setTitle || "TITLE";
  const setTitleColor = props.setTitleColor || "#277DA1";
  const setTitleSize = props.setTitleSize || "1em";

  const color = d3
    .scaleOrdinal()
    .range([
      "#CED89E",
      "#F9F9C5",
      "#6CC4A1",
      "#AEDBCE",
      "#76BA99",
      "#D9F8C4",
      "#90C8AC",
    ]);

  const data = [
    { ages: "<18", count: "727432" },
    { ages: "≥65", count: "629032" },
    { ages: "55-64", count: "515347" },
    { ages: "18-24", count: "341435" },
    { ages: "25-34", count: "444509" },
    { ages: "35-44", count: "426967" },
    { ages: "45-54", count: "480565" },
  ];

  function updateChart() {
    const svg = d3
      .select(".donut-chart")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.bottom + padding.top)
      .append("g")
      .attr(
        "transform",
        `translate(${(width + padding.left + padding.right) / 2}, ${
          (height + padding.top + padding.bottom) / 2
        })`
      );

    const pie = d3
      .pie()
      .value((d: { ages: string; count: string }): number => {
        return Number(d.count);
      })
      .sort(null);
    const path = d3.arc().outerRadius(radius).innerRadius(100);
    svg
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("stroke-width", "1")
      .attr("stroke", "#277DA1")
      .attr("fill", function (d) {
        return color(d.data.ages);
      })
      .transition()
      .delay(function (d, i: number): number {
        return i * 120;
      })
      .duration(240)
      .attrTween("d", function (d) {
        const i = d3.interpolate(d.startAngle + 0, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return path(d);
        };
      });

    svg
      .selectAll("text")
      .data(pie(data))
      .join("text")
      .attr("transform", function (d) {
        return `translate(${path.centroid(d)})`;
      })
      .text(function (d) {
        return d.data.ages;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-family", "Verdana")
      .style("font-size", 15);
  }

  function updateInteractivity() {
    const toolTip = d3.select(".donut-chart").append("text").attr("opacity", 0);

    function handleMouseOver() {
      toolTip.attr("opacity", "1");
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", "0.6")
        .attr("stroke-width", "4")
        .style("cursor", "pointer");
    }

    function handleMouseMove(e: Event, d) {
      const [x, y] = d3.pointer(e);
      toolTip
        .attr("x", x + 10 + (width + padding.left + padding.right) / 2)
        .attr("y", y + (height + padding.top + padding.bottom) / 2)
        .attr("opacity", "1")
        .attr("font-family", fontFamily)
        .attr("font-size", "0.8em")
        .attr("fill", "black")
        .text(`${d.data.count}`);
    }

    function handleMouseLeave() {
      toolTip.attr("opacity", 0);
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", "1")
        .attr("stroke-width", "1");
    }

    d3.select(".donut-chart")
      .selectAll("path")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
  }

  function updateTitle() {
    d3.select(".donut-chart")
      .append("text")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", padding.top / 2)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("fill", setTitleColor)
      .attr("font-size", setTitleSize)
      .text(setTitle);
  }

  useEffect(() => {
    updateChart();
    updateInteractivity();
    updateTitle();
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="donut-chart"></svg>
      </div>
    </Fragment>
  );
}
