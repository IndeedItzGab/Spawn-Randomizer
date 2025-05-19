import { world, system } from "@minecraft/server"
import { config } from "../../config.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/getTopBlock.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  const threshold = config.distanceThreshold
  const setting = db.fetch("spawnRandomizerSetting", true)[0]
  
  if(!player.isNew() || (setting && setting.mode === "vanilla")) return;
  
  if((setting && setting.mode === "default") || !setting) {
    let x = Math.floor(Math.random() * threshold) + 1;
    let z = Math.floor(Math.random() * threshold) + 1;
    player.tryTeleport({x, y: 320, z})
    
    const runner = system.runInterval(() => {
      const topBlock = getTopBlock({x, z})
      player.tryTeleport({x, y: 320,z})
      if(topBlock) {
        player.tryTeleport({x, y: topBlock + 1, z})
        player.runCommand(`spawnpoint @s ${x} ${topBlock + 1} ${z}`)
        system.clearRun(runner)
      }
    }, 1*20)
  } else if(setting && setting.mode === "specified") {
    const randomLocations = db.fetch("randomSpecifiedLocation", true)
    if(randomLocations < 0) return;
    let result = randomLocations[Math.floor(Math.random() * randomLocations.length)]
    let dimension = world.getDimension(result.dimension)
    player.tryTeleport({x: result.location.x, y: result.location.y, z: result.location.z}, {dimension})
    player.runCommand(`spawnpoint @s ${result.location.x} ${result.location.y} ${result.location.z}`)
  }
  
  let recentPlayerList = db.fetch("recentPlayerList", true);
  recentPlayerList.push({ name: player.name })
  db.store("recentPlayerList", recentPlayerList)
})