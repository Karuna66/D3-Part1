
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








