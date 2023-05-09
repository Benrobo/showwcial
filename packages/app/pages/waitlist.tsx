import next from "next"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Navbar from "../components/Navbar/navbar"
import Footer from "../components/Footer"

function WaitList() {
  
  return (
    <Layout>
      <Navbar showLinks={false} showLogo={true} showSocials={true} />
      <Header />
      <Footer />
    </Layout>
  )
}

export default WaitList