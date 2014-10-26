@chart_ = (ctx, type, data, options) --> -> 
  c = new Chart(ctx)
  d = null
  c.update = (data) -> 
    if d then d.destroy!
    d := c[type](data, options)
  d = c.update data
  return c

@updateChart_ = (data, chart) --> -> chart.update data