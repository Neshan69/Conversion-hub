import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PopularConversions } from "@/components/home/PopularConversions";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <PopularConversions />
      <FAQ />
    </>
  );
}