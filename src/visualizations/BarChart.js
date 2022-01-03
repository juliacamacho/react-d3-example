import React, { Component, useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]).mode('hsl');

const BarChart = ({data}) => {

  const svgRef = useRef(null);

  const [bars, setBars] = useState([]) // array of rects
  const [xScale, setXScale] = useState(d3.scaleTime().range([margin.left, width - margin.right]))
  const [yScale, setYScale] = useState(d3.scaleLinear().range([height - margin.bottom, margin.top]))
  const [colorScale, setColorScale] = useState(d3.scaleLinear())

  useEffect(() => {

    const xScale = d3.scaleTime().range([margin.left, width - margin.right])
    const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top])
    const colorScale = d3.scaleLinear()

    const svgEl = d3.select(svgRef.current);

    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
    const svg = svgEl
      .append("g")
      // .attr("transform", `translate(${margin.left},${margin.top})`);

  // // xAxis = d3.axisBottom().scale(this.state.xScale)
    const xAxis = d3.axisBottom().scale(xScale)
      .tickFormat(d3.timeFormat('%b'));
  // // yAxis = d3.axisLeft().scale(this.state.yScale)
    const yAxis = d3.axisLeft().scale(yScale)
      .tickFormat(d => `${d}℉`);

    const xAxisGroup = svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    const yAxisGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);
  

  // // static getDerivedStateFromProps(nextProps, prevState) {
  // //   if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
  // //   const {data} = nextProps;
  // //   const {xScale, yScale, colorScale} = prevState;

    const timeDomain = d3.extent(data, d => d.date);
    const tempMax = d3.max(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg);
    xScale.domain(timeDomain);
    yScale.domain([0, tempMax]);
    colorScale.domain(colorDomain);

    console.log("DATA:", data)
    data.map(d => {
      const y1 = yScale(d.high);
      const y2 = yScale(d.low);
      return {
        x: xScale(d.date),
        y: y1,
        height: y2 - y1,
        fill: colors(colorScale(d.avg)),
      }
    })

  // //   return {bars};
  // // }

  //   d3.select(xAxis).call(xAxis);
  //   d3.select(yAxis).call(yAxis);

  }, [data])


  return (
    <svg ref={svgRef} width={width} height={height}>
      {/* {bars.map((d, i) =>
        (<rect key={i} x={d.x} y={d.y} width='2' height={d.height} fill={d.fill} />))}
      <g>
        <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
        <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
      </g> */}
    </svg>
  );

}

export default BarChart;
