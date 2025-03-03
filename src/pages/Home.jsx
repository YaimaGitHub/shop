import { useState } from "react"
import Footer from "../layout/Footer"
import Navbar from "../layout/Navbar"
import Product from "../layout/Product"

const HomePage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    document.title = "Yero Cart"

    return (
        <>
            <Navbar />
            <Product setIsLoaded={setIsLoaded} />
            <Footer />
        </>
    )
}

export default HomePage