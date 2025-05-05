import { GlassWater, Droplets } from "lucide-react"

export const SingleCup = () => (
  <div className="flex flex-col items-center">
    <GlassWater className="h-12 w-12 text-white" />
  </div>
)

export const MultipleCups = () => (
  <div className="flex flex-col items-center">
    <div className="flex">
      <GlassWater className="h-10 w-10 text-white" />
      <GlassWater className="h-10 w-10 text-white -ml-2" />
      <GlassWater className="h-10 w-10 text-white -ml-2" />
    </div>
  </div>
)

export const WaterBottle = () => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <Droplets className="h-16 w-16 text-white" />
      <Droplets className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform text-blue-300" />
    </div>
  </div>
)

export const MultipleBottles = () => (
  <div className="flex flex-col items-center">
    <div className="flex gap-1">
      <div className="relative">
        <Droplets className="h-14 w-14 text-white" />
        <Droplets className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform text-green-300" />
      </div>
      <div className="relative">
        <Droplets className="h-14 w-14 text-white" />
        <Droplets className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform text-green-300" />
      </div>
    </div>
  </div>
)
