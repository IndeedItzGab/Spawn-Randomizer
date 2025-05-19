import { world } from "@minecraft/server";

globalThis.getTopBlock = (location) => {
  const dimension = world.getDimension("overworld")
  for (let y = 320; y >= -64; y--) {
    const block = dimension.getBlock({x: location.x, y: y, z: location.z});
    if ((block && block.isSolid)) {
      return block.location.y
    }
  }
  return 0
}