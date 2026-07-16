import Hero from "../components/Hero";
import Services from "../components/Services";
import Team from "../components/Team";
import { Gallery, Testimonials, Membership, ContactForm } from "../components/SiteSections";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Team />
      <Gallery />
      <Testimonials />
      <Membership />
      <ContactForm />
    </>
  );
}
