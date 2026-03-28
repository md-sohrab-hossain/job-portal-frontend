"use client";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "../ui/button";
import { categories } from "@/lib/data";
import { getFindJobsUrl } from "@/lib/routes";

const ShowCategories = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  if (!categories || categories.length === 0) return null;

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold text-white text-center mb-8">
        Browse <span className="text-yellow-400">Categories</span>
      </h2>
      <Carousel
        plugins={[plugin.current]}
        opts={{ align: "start", loop: true }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category} className="md:basis-1/3">
              <Link
                href={getFindJobsUrl(undefined, category)}
                className="p-2 block"
              >
                <Button className="w-full rounded-full bg-black/50 text-yellow-400 hover:bg-yellow-400 cursor-pointer hover:text-black transition-colors">
                  {category}
                </Button>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ShowCategories;
