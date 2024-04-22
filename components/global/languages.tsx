"use client"
import Autoplay from "embla-carousel-autoplay"

import {
  DE,
  ES,
  FR,
  GB,
  GR,
  IN,
  IT,
  SE,
  US,
} from "country-flag-icons/react/3x2"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import React from "react"

const flags = [
  <US />,
  <IT />,
  <DE />,
  <GB />,
  <FR />,
  <SE />,
  <ES />,
  <IN />,
  <GR />,
]

const Flags = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    <div className="w-full flex justify-center items-center mb-16">
      <Carousel
        opts={{ loop: true, align: "center" }}
        plugins={[plugin.current]}
        className="w-full xl:max-w-xl max-w-[75vw]"
      >
        <CarouselContent>
          {flags.map((flag, index) => (
            <CarouselItem
              className="basis-1/4 md:basis-1/6 lg:basis-1/6"
              key={index}
            >
              {flag}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default Flags
