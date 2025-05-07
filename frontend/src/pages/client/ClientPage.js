import Footer from "../../components/Footer";

function ClientDashboard() {
    return (
        <main>
            <div className="hero d-flex justify-content-center align-items-center mx-auto flex-column">
               <div className="hero-container">
                    <div className="hero-content text-center d-flex justify-content-center align-items-center flex-column">
                        <h1 className="text-center text-light pt-4 mt-5">TIMELESS ELEGANCE</h1>
                        <p className="text-center text-light fs-4 w-50">Explore our curated collection of premium watches for every style and collector.</p>
                    </div>
               </div>
            </div>
            <div className="about-us">
                <div className="about-us-description d-flex">
                    <div className="about-us-text d-flex flex-column justify-content-center align-items-start">
                        <h2 className="ms-5">About Us</h2>
                        <p className="ms-5">At Dialuxe, we connect watch lovers with authentic, luxury timepieces. Curated for style and quality, our marketplace offers a seamless shopping experience for collectors and modern buyers alike. Every piece tells a story—start yours with us.</p>
                    </div>
                    <div className="about-image d-flex flex-column justify-content-center align-items-center">
                        <img className="image2" />
                    </div>
                </div>
                <div className="about-us-image d-flex flex-column justify-content-center align-items-center">
                    <img className="image1" />
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default ClientDashboard;