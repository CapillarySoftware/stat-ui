@chart_ = (ctx, type, data, options) --> -> 
  c = new Chart(ctx)
  c.update = (data) -> c[type](data, options)
  c.update data
  return c

@updateChart_ = (data, chart) --> -> 
  chart.update data