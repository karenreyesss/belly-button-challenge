// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }).catch(error => {
    console.error('Error fetching the JSON data:', error);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = result.otu_ids;
    const otuLabels = result.otu_labels;
    const sampleValues = result.sample_values;

    // Build a Bubble Chart
    const trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth',
        opacity: 0.7
      }
    };

    const dataBubble = [trace2];

    const layoutBubble = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
      height: 600,
      width: 1000
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', dataBubble, layoutBubble);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const topOtuIds = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const topOtuLabels = otuLabels.slice(0, 10).reverse();
    const topSampleValues = sampleValues.slice(0, 10).reverse();

    const yticks = topOtuIds;

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const trace1 = {
      type: "bar",
      orientation: "h",
      x: topSampleValues,
      y: yticks, // Use the mapped otu_ids as yticks
      text: topOtuLabels,
      hoverinfo: "text",
    };
    const dataBar = [trace1];

    const layoutBar = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID", autorange: "reversed" },
      margin: { t: 50, l: 150 },
    };
    // Render the Bar Chart
    Plotly.newPlot("bar", dataBar, layoutBar);

  }).catch(error => {
    console.error('Error fetching the JSON data:', error);
  });
}
  
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }).catch(error => {
    console.error('Error fetching the JSON data:', error);
  });
}
  
// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
