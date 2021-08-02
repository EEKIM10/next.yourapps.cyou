import '../styles/globals.css'
import Nav from "../public/components/nav";
import Footer from "../public/components/footer";

function MyApp({ Component, pageProps }) {
  return (
      <>
        <Nav/>
        <Component {...pageProps} />
        <Footer/>
      </>
  )
}

export default MyApp
