//variables

let link = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let svg = d3.select("#svg");

let width = 800;
let height = 400;
let padding = 60;

let bui = new XMLHttpRequest();
let res;
let data;

let xScale;
let yScale;

let base;
//functions

let makeBackground = () => {
  svg.attr("width", width);
  svg.attr("height", height);
}

let scaleFunction = ()  => {
  xScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => {
      return d["year"]
    }), d3.max(data, (d) => {
      return d["year"] + 1
    })
 ])
    .range([padding, width - padding]);
  
  yScale = d3.scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding])
}

let makeAxes = () => {
  let xAxis = 
d3.axisBottom(xScale)
  .tickFormat(d3.format("d"));
  let yAxis = 
d3.axisLeft(yScale)
  .tickFormat(d3.timeFormat("%B"));
  
svg.append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr('transform', 'translate(0, ' + (height - padding) + ')')
  
svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr('transform', 'translate(' + padding + ', 0)')
}

let makeGraph = () => {
  
  let tooltip = d3.select("#tooltipdiv")
      .append("div")
      .attr("id", "tooltip")
      .style("visibility", "hidden")
      .style("width", "auto")
      .style("height", "auto")
  
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
  base = res["baseTemperature"]
//  console.log(base)
  
  svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("x", (d) => {
    return xScale(d["year"])
  })
  .attr("y", (d) => {
    return yScale(new Date(0, d["month"] - 1, 0, 0, 0, 0, 0))
  })
  .attr("height", (d) => {
    return (height - (2 * padding)) / 12
  })
  .attr("width", (d) => {
    return (width - (2 * padding)) / ((d3.max(data, (d) => {
      return d["year"] + 1
    })) - (d3.min(data, (d) => {
      return d["year"]
    }))) 
  })
  .attr("fill", (d) => {
    let variance = d["variance"]
    if(variance <= -1){
                return "#074EAA"
            }else if(variance <= 0){
                return "#0B9ACC"
            }else if(variance <= 1){
                return "#DBE46E"
            }else{
                return "#D86136"
            }
  })
  .attr("data-month", (d) => {
    return d["month"] - 1
  })
  .attr("data-year", (d) => {
    return d["year"]
  })
  .attr("data-temp", (d) => {
    return base + d["variance"]
  })
  .on("mouseover", (d, i) => {
    tooltip.attr("data-year", i["year"])
    tooltip.transition()
    .style("visibility", "visible")
    tooltip.text(months[i["month"] - 1] + ", " + i["year"])
  })
  .on("mouseout", (d) => {
    tooltip.transition()
    .style("visibility", "hidden")
  })
} ;


//API and function calls

bui.open("GET", link, true);
bui.send();
bui.onload = () => {
  res = JSON.parse(bui.responseText);
  data = res.monthlyVariance;
 // console.log(data)
  makeBackground();
  scaleFunction();
  makeAxes();
  makeGraph();
};