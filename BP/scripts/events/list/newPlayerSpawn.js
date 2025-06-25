import { world, system } from "@minecraft/server"
import { config } from "../../config.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/getTopBlock.js"

world.afterEvents.playerSpawn.subscribe(async (event) => {
  const player = event.player;
  const threshold = config.distanceThreshold
  const setting = db.fetch("spawnRandomizerSetting", true)[0]

  let recentPlayerList = db.fetch("recentPlayerList", true);
  if(!player.getSpawnPoint()) {
    const playerData = recentPlayerList.find(d => d.name === player.name)
    const dimension = world.getDimension(playerData?.dimension)
    system.run(() => {
      player.tryTeleport({x: playerData.location.x, y: playerData.location.y, z: playerData.location.z}, {dimension})
      player.runCommand(`spawnpoint @s ${playerData.location.x} ${playerData.location.y} ${playerData.location.z}`)
    })
  }
  
  if(!player.isNew() || (setting && setting.mode === "vanilla")) return;
  
  let data = {}
  if((setting && setting.mode === "default") || !setting) {
    let x = Math.floor(Math.random() * threshold) + 1;
    let z = Math.floor(Math.random() * threshold) + 1;
    player.tryTeleport({x, y: 320, z})
    
    const runner = system.runInterval(async () => {
      const topBlock = getTopBlock({x, z})
      player.tryTeleport({x, y: 320,z})
      
      // Avoid spawning on lava or water
      if(topBlock.typeId === "minecraft:water" && topBlock.typeId === "minecraft:lava") {
        x = Math.floor(Math.random() * threshold) + 1;
        z = Math.floor(Math.random() * threshold) + 1;
        return;
      }
      
      if(topBlock) {
        player.tryTeleport({x, y: topBlock.location.y + 1, z})
        console.info("test")
        data = {
          name: player.name,
          dimension: player.dimension.id,
          location: {
            x: x,
            y: topBlock.location.y + 1,
            z: z
          }
        }
        player.runCommand(`spawnpoint @s ${x} ${topBlock.location.y + 1} ${z}`)
        recentPlayerList.push(data)
        db.store("recentPlayerList", recentPlayerList)
        system.clearRun(runner)
      }
    }, 1*20)
  } else if(setting && setting.mode === "specified") {
    const randomLocations = db.fetch("randomSpecifiedLocation", true)
    if(randomLocations < 0) return;
    let result = randomLocations[Math.floor(Math.random() * randomLocations.length)]
    let dimension = world.getDimension(result.dimension)
    player.tryTeleport({x: result.location.x, y: result.location.y, z: result.location.z}, {dimension})
    data = {
      name: player.name,
      dimension: player.dimension.id,
      location: {
        x: result.location.x,
        y: result.location.y,
        z: result.location.z
      }
    }
    player.runCommand(`spawnpoint @s ${result.location.x} ${result.location.y} ${result.location.z}`)
    recentPlayerList.push(data)
    db.store("recentPlayerList", recentPlayerList)
  }
  
})