@chart_ = (ctx, type, data, options) --> -> 
  new Chart(ctx)[type](data, options)

@updateChart_ = ({datasets, labels}, chart) --> -> 
  chart.datasets = datasets
  chart.labels   = labels 
  chart.update!