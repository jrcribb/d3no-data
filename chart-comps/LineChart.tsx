// deno-lint-ignore-file
/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";
import { LineChartProps } from "../ChartProps/LineChartProps.ts";

export default function LineChart(props: LineChartProps) {
  const padding = {
    top: props.paddingTop || 70,
    right: props.paddingRight || 70,
    bottom: props.paddingBottom || 70,
    left: props.paddingLeft || 70,
  };
  const width = (props.width || 800) - padding.left - padding.right;
  const height = (props.height || 600) - padding.bottom - padding.top;
  const fontFamily = props.fontFamily || "Verdana";
  const xAxisLabel = props.xAxisLabel || "x label";
  const yAxisLabel = props.yAxisLabel || "y label";
  const axesLabelColor = props.axesLabelColor || "#277DA1";
  const axesLabelSize = props.axesLabelSize || "0.8em";
  const axesColor = props.axesColor || "#4D908E";
  const axesFontSize = props.axesFontSize || "0.5em";
  const addLabel = props.addLabel || false;
  const addTooltip = props.addTooltip === false ? false : true;
  const addTitle = props.addTitle || false;
  const setTitle = props.setTitle || "TITLE";
  const setTitleColor = props.setTitleColor || axesLabelColor;
  const lineColor = props.lineColor || "#BFE4A3";
  const receivedData = props.data;
  const data: { x: Date; y: number }[] = [];
  const animation = props.animation || true;
  const animationDuration = props.animationDuration || 5000;

  function cleanData() {
    for (let d of receivedData) {
      data.push({
        x: new Date(d.x),
        y: d.y,
      });
    }
  }
  function updateChart() {
    const svg = d3
      .select(".line-chart")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.top + padding.bottom);

    // configure scale
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d: { x: Date; y: number }): Date {
          return d.x;
        })
      )
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d: { x: Date; y: number }): number {
          return d.y;
        })
      )
      .range([height + padding.bottom, padding.top]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    svg
      .append("g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${padding.left}, ${height + padding.bottom})`
      )
      .attr("font-size", axesFontSize)
      .attr("font-family", fontFamily)
      .attr("color", axesColor)
      .selectAll(".tick text")
      .attr("transform", "translate(-10, 3)rotate(-45)") // have to take into account the variables for rotation too
      .style("text-anchor", "end");
    svg
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${padding.left}, 0)`)
      .attr("font-family", fontFamily)
      .attr("font-size", axesFontSize)
      .attr("color", axesColor)
      .selectAll(".tick line")
      .attr("x2", width)
      .attr("opacity", "0.3")
      .attr("stroke-dasharray", "1, 1");

    svg
      .append("path")
      .classed("data-line", true)
      .data([data])
      .attr("transform", `translate(${padding.left}, 0)`)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xScale(d.x);
          })
          .y(function (d) {
            return yScale(d.y);
          })
          .curve(d3.curveLinear)
      )
      .attr("stroke-width", 3)
      .filter(() => animation)
      .attr("stroke-dasharray", function () {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function () {
        return this.getTotalLength();
      })
      .transition()
      .duration(animationDuration)
      .attr("stroke-dashoffset", 0);

    if (addTooltip) {
      const focus = d3
        .select(".line-chart")
        .append("g")
        .append("circle")
        .style("fill", "#4D908E")
        .style("stroke", "#4D908E")
        .style("r", 5)
        .style("opacity", 0);
      const focusText = d3
        .select("body")
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute");

      const bisect = d3.bisector(function (d) {
        return d.x;
      }).left;

      function handleMouseOver() {
        focus.style("opacity", 1);
        focusText.style("opacity", 1);
      }

      function handleMouseLeave() {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
      }

      function handleMouseMove(e: Event) {
        const [x, y] = d3.pointer(e);
        const x0 = xScale.invert(x - padding.left);
        const i = bisect(data, x0, 1);
        const selectedData = data[i];
        focus
          .style("cx", xScale(selectedData.x) + padding.left)
          .style("cy", yScale(selectedData.y));
        focusText
          .html(`${selectedData.y}`)
          .style("left", `${xScale(selectedData.x) + 50}px`)
          .style("top", `${yScale(selectedData.y) - 25}px`)
          .style("font-family", fontFamily)
          .style("background-color", "white")
          .style("border-radius", "5px")
          .style("color", "#4D908E");
      }

      d3.select(".line-chart")
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseleave", handleMouseLeave);
    }
  }

  function updateTitle() {
    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", padding.top / 2)
      .attr("font-family", fontFamily)
      .attr("fill", setTitleColor)
      .text(setTitle);
  }

  // add label to the x and y axes
  function updateLabel() {
    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "start")
      .attr("x", padding.left / 2)
      .attr("y", padding.top - 10) // between the y label and the axes
      .attr("font-family", fontFamily)
      .attr("fill", axesLabelColor)
      .attr("font-size", axesLabelSize)
      .text(yAxisLabel);

    d3.select(".line-chart")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width + padding.left + padding.right) / 2)
      .attr("y", height + padding.bottom + padding.top)
      .attr("font-family", fontFamily)
      .attr("fill", axesLabelColor)
      .attr("font-size", axesLabelSize)
      .text(xAxisLabel);
  }

  // create another function to add animation instead of grouping theme into create chart

  useEffect(() => {
    cleanData();
    updateChart();
    if (addLabel) {
      updateLabel();
    }
    if (addTitle) {
      updateTitle();
    }
  }, []);

  return (
    <Fragment>
      <div className="chart-container">
        <svg className="line-chart">
          <g></g>
        </svg>
      </div>
    </Fragment>
  );
}