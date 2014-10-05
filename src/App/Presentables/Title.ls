@TitleLinker = ({title}, {chart}) !->
  t = document.createElement "h1"
  t.innerHTML = title
  chart.subscribe (v) -> t.innerHTML = v
  document.body.appendChild t 