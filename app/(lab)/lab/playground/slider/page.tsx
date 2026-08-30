import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import ImageSlider from "@/components/lab/ImageSlider";
import type { SliderSlide } from "@/components/lab/ImageSlider";

export const metadata: Metadata = {
  title: "Image slider — Lab",
};

const BASE =
  "/app/themes/portfolio-2018/static/assets/images/careers/slider";

const SLIDES: SliderSlide[] = [
  {
    src: `${BASE}/pirates.jpg`,
    src2x: `${BASE}/pirates@2x.jpg`,
    caption: "Pirates",
  },
  {
    src: `${BASE}/larry.jpg`,
    src2x: `${BASE}/larry@2x.jpg`,
    caption: "Isn't he cute?",
  },
  {
    src: `${BASE}/thierry.jpg`,
    src2x: `${BASE}/thierry@2x.jpg`,
    caption: "Faster Thierry",
  },
  {
    src: `${BASE}/barbecue-sandwich.jpg`,
    src2x: `${BASE}/barbecue-sandwich@2x.jpg`,
    caption: "BBQ season",
  },
  {
    src: `${BASE}/lego.jpg`,
    src2x: `${BASE}/lego@2x.jpg`,
    caption: "Also Lego",
  },
  {
    src: `${BASE}/mario-kart.jpg`,
    src2x: `${BASE}/mario-kart@2x.jpg`,
    caption: "Mario Kart cup",
  },
  {
    src: `${BASE}/workshop.jpg`,
    src2x: `${BASE}/workshop@2x.jpg`,
    caption: "Workshop",
  },
  {
    src: `${BASE}/presentation.jpg`,
    src2x: `${BASE}/presentation@2x.jpg`,
    caption: "Talks",
  },
];

export default function SliderPlaygroundPage() {
  return (
    <LabShell
      title="Careers image slider"
      lead="Drag/scroll strip instead of tiny-slider. Assets from the careers page snapshot (the legacy /careers/ page was removed)."
    >
      <ImageSlider slides={SLIDES} />
      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            <code>study/scss/partials/careers/_image-slider.scss</code>
          </li>
          <li>
            <code>components/lab/ImageSlider.tsx</code>
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
