import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Portafolio from "@/components/Portafolio";
import PorQueElegirnos from "@/components/PorQueElegirnos";
import Estadisticas from "@/components/Estadisticas";
import Testimonios from "@/components/Testimonios";
import NuestroProceso from "@/components/NuestroProceso";
import GaleriaVideo from "@/components/GaleriaVideo";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";
import CTAFinal from "@/components/CTAFinal";
import Formulario from "@/components/Formulario";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Servicios />
      <Portafolio />
      <PorQueElegirnos />
      <Estadisticas />
      <Testimonios />
      <NuestroProceso />
      <GaleriaVideo />
      <PreguntasFrecuentes />
      <CTAFinal />
      <Formulario />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
