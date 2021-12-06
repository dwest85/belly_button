function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset')

  // Use the list of sample names to populate the select options
  d3.json('samples.json').then(data => {
    var sampleNames = data.names

    sampleNames.forEach(sample => {
      selector.append('option').text(sample).property('value', sample)
    })

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0]
    buildCharts(firstSample)
    buildMetadata(firstSample)
  })
}

// Initialize the dashboard
init()

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json('samples.json').then(data => {
    var metadata = data.metadata
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)
    var result = resultArray[0]
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select('#sample-metadata')

    // Use `.html("") to clear any existing metadata
    PANEL.html('')

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`)
    })
  })
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json('samples.json').then(data => {
    // 3. Create a variable that holds the samples array.
    var sampleData = data.samples
    var metadata = data.metadata
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample)
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var result_1 = resultArray[0]
    var result_2 = metaArray[0]
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otu_ids = result_1.otu_ids
    var otu_labels = result_1.otu_labels
    var sample_values = result_1.sample_values

    var wfreqArray = parseFloat(result_2.wfreq)
    console.log(wfreqArray)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var slicedOtuIds = otu_ids
      .slice(0, 10)
      .map(otuID => ` OTU ${otuID}`)
      .reverse()

    var slicedOtuLabels = otu_labels.slice(0, 10).reverse()

    var slicedSampleValues = sample_values.slice(0, 10).reverse()

    var bubbleOtuIds = otu_ids.slice(0, 10).reverse()

    console.log(slicedOtuIds)
    console.log(slicedOtuLabels)
    console.log(slicedSampleValues)

    // 8. Create the trace for the bar chart.
    var trace = {
      y: slicedOtuIds,
      x: slicedSampleValues,
      text: slicedOtuLabels,
      type: 'bar',
      orientation: 'h'
    }

    var barData = [trace]

    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: '' },
      height: 400,
      width: 300
    }
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bar-plot', barData, barLayout)

    // 1. Create the trace for the bubble chart.
    var trace_2 = {
      x: bubbleOtuIds,
      y: slicedSampleValues,
      text: slicedOtuLabels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: bubbleOtuIds,
        colorscale: 'RdBu'
        //sizeref: 2
      }
    }

    var bubbleData = [trace_2]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '',
      xaxis: { title: '' },
      yaxis: { title: '' },
      height: 500,
      width: 800
    }

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble-plot', bubbleData, bubbleLayout)

    //Gauge chart plot
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqArray,
        title: { text: 'WFreq' },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 10], color: 'black' },
            { range: [0, 2], color: 'red' },
            { range: [2, 4], color: 'orange' },
            { range: [4, 6], color: 'yellow' },
            { range: [6, 8], color: 'light green' },
            { range: [8, 10], color: 'green' }
          ]
        }
      }
    ]

    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } }

    Plotly.newPlot('gauge-plot', gaugeData, gaugeLayout)
  })
}



