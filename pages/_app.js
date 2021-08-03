import '../styles/globals.css'
import Nav from "../public/components/nav";
import Footer from "../public/components/footer";

function MyApp({ Component, pageProps }) {
  return (
      <>
          <div style={{minHeight: "100%"}}>
              <Nav/>
              <Component {...pageProps} />
              <Footer/>
          </div>
      </>
  )
}

export default MyApp
