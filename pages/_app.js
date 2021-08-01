import '../styles/globals.css'

export function reportWebVitals(metric) {
  console.log("Metrics: ", metric)
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
