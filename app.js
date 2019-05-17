
(async function() {

   //setting up the margins and chartwidth
    const svgWidth = 800;
    const svgHeight = 500;

    const margin = {
        top: 50,
        right: 10,
        bottom: 50,
        left: 50
    };

    const height = svgHeight - margin.top - margin.bottom;
    const width = svgWidth - margin.left - margin.right;
    // console.log(height)
    // console.log(width)

    // data
    const csvData = await d3.csv("data.csv")
    csvData.forEach(d=>{
        d.poverty = +d.poverty
        d.healthcare = +d.healthcare
        d.state = d.state

    })
    console.log(csvData)
   
    // append svg and group
    const svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(csvData,d=>d.poverty)*.8,d3.max(csvData,d=>d.poverty)*1.1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
                .domain([0, d3.max(csvData, d=>d.healthcare)])
                .range([height, 0]);
  

    // Create axis functions
    // ==============================
    const bottomAxis = d3.axisBottom(xScale).ticks(6)
    const leftAxis = d3.axisLeft(yScale)

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g").call(leftAxis)

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)

    // append circles to data points
    const circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("r", "20px")
    .attr("opacity","0.5")
    .attr("fill", "blue")

    //labels for the circle
    const labelCircle = chartGroup.selectAll(null)
            .data(csvData)
            .enter()
            .append("text")
    labelCircle.attr("text-anchor", "middle")
        .attr("fill","white")

// Initialize tool tip
// ==============================
    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(d) {
        return (`<strong>${d.state}</strong><br><strong>Poverty:${d.poverty}</strong><br><strong>lack Healthcare:${d.healthcare}</strong>`);
        });

//   Add an onmouseover event to display a tooltip
//     // ========================================================
    chartGroup.call(toolTip);

//  Create event listeners to display and hide the tooltip
//     // ==============================
    circlesGroup.on("click", function(d) {
            toolTip.show(d, this);
        })
        .on("mouseout", function(d) {
        toolTip.hide(d);
        });

//      Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -4)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks HealthCare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top-15})`)
        .attr("class", "aText")
        .text("In Poverty(%)");
// transtion for circles
    circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => xScale(d.poverty))
                .attr("cy", d => yScale(d.healthcare))
//transition for labels
    labelCircle.transition()
                .duration(1500)
                .attr("x",d=>xScale(d.poverty))
                .attr("y",d=>yScale(d.healthcare))
                .text(d=>d.abbr)

})()





























// // @TODO: YOUR CODE HERE!
// const svgWidth = 960;
// const svgHeight = 500;

// const margin = {
//   top: 20,
//   right: 40,
//   bottom: 80,
//   left: 100
// };

// const width = svgWidth - margin.left - margin.right;
// const height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// const svg = d3
//   .select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// // Append an SVG group
// const chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial Params
// let chosenXAxis = "hair_length";

// // function used for updating x-scale const upon click on axis label
// function xScale(hairData, chosenXAxis) {
//   // create scales
//   const xLinearScale = d3.scaleLinear()
//     .domain([d3.min(hairData, d => d[chosenXAxis]) * 0.8,
//       d3.max(hairData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }

// // function used for updating xAxis const upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   const bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {
//     let label  = "";
//     if (chosenXAxis === "hair_length") {
//         label = "Hair Length:";
//     }
//     else {
//         label = "# of Albums:";
//     }

//     const toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(d) {
//             return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
//         });

//     circlesGroup.call(toolTip);

//     circlesGroup.on("mouseover", function(data) {
//         toolTip.show(data, this);
//     })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//         toolTip.hide(data, this);
//     });

//   return circlesGroup;
// }

// // Retrieve data from the CSV file and execute everything below
// (async function(){
//     const hairData = await d3.csv("/hairData.csv");

//     // parse data
//     hairData.forEach(function(data) {
//         data.hair_length = +data.hair_length;
//         data.num_hits = +data.num_hits;
//         data.num_albums = +data.num_albums;
//     });

//     // xLinearScale function above csv import
//     let xLinearScale = xScale(hairData, chosenXAxis);

//     // Create y scale function
//     let yLinearScale = d3.scaleLinear()
//         .domain([0, d3.max(hairData, d => d.num_hits)])
//         .range([height, 0]);

//     // Create initial axis functions
//     let bottomAxis = d3.axisBottom(xLinearScale);
//     let leftAxis = d3.axisLeft(yLinearScale);

//     // append x axis
//     let xAxis = chartGroup.append("g")
//         .classed("x-axis", true)
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);

//     // append y axis
//     chartGroup.append("g")
//         .call(leftAxis);

//     // append initial circles
//     let circlesGroup = chartGroup.selectAll("circle")
//         .data(hairData)
//         .enter()
//         .append("circle")
//         .attr("cx", d => xLinearScale(d[chosenXAxis]))
//         .attr("cy", d => yLinearScale(d.num_hits))
//         .attr("r", 20)
//         .attr("fill", "pink")
//         .attr("opacity", ".5");

//     // Create group for  2 x- axis labels
//     const labelsGroup = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     const hairLengthLabel = labelsGroup.append("text")
//         .attr("x", 0)
//         .attr("y", 20)
//         .attr("value", "hair_length") // value to grab for event listener
//         .classed("active", true)
//         .text("Hair Metal Ban Hair Length (inches)");

//     const albumsLabel = labelsGroup.append("text")
//         .attr("x", 0)
//         .attr("y", 40)
//         .attr("value", "num_albums") // value to grab for event listener
//         .classed("inactive", true)
//         .text("# of Albums Released");

//     // append y axis
//     chartGroup.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left)
//         .attr("x", 0 - (height / 2))
//         .attr("dy", "1em")
//         .classed("axis-text", true)
//         .text("Number of Billboard 500 Hits");

//     // updateToolTip function above csv import
//     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//     // x axis labels event listener
//     labelsGroup.selectAll("text")
//         .on("click", function() {
//         // get value of selection
//         const value = d3.select(this).attr("value");
//         if (value !== chosenXAxis) {

//             // replaces chosenXAxis with value
//             chosenXAxis = value;

//             // console.log(chosenXAxis)

//             // functions here found above csv import
//             // updates x scale for new data
//             xLinearScale = xScale(hairData, chosenXAxis);

//             // updates x axis with transition
//             xAxis = renderAxes(xLinearScale, xAxis);

//             // updates circles with new x values
//             circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//             // updates tooltips with new info
//             circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//             // changes classes to change bold text
//             if (chosenXAxis === "num_albums") {
//                 albumsLabel
//                     .classed("active", true)
//                     .classed("inactive", false);
//                 hairLengthLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//             }
//             else {
//                 albumsLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 hairLengthLabel
//                     .classed("active", true)
//                     .classed("inactive", false);
//             }
//         }
//     });
// })()