import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"
import "../../utilities/FetchTopBlock.js"

const commandInformation = {
  name: "spreadplayers",
  description: "Spread out players around the overworld.",
  permissionLevel: 1,
  aliases: [],
  usage:[
    {
      name: "radius",
      type: "Integer",
      optional: false
    },
    {
      name: "setSpawnPoint",
      type: "Boolean",
      optional: true,
    },
    {
      name: "includeAdmin",
      type: "Boolean",
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, radius, setSpawnPoint = false, includeAdmin = false) => {
  
  const player = origin.sourceEntity
  let recentPlayerList = db.fetch("recentPlayerList", true);

  for(const selectedPlayer of world.getPlayers()) {
    if(!includeAdmin && selectedPlayer.commandPermission === 1) continue;
    let x = Math.floor(Math.random() * radius) + 1;
    let z = Math.floor(Math.random() * radius) + 1;
    system.run(() => selectedPlayer.tryTeleport({x, y: 320, z}))
    
    const runner = system.runInterval(() => {
      const topBlock = getTopBlock({x, z})
      selectedPlayer.tryTeleport({x, y: 320,z})
      
      // Avoid spawning on lava or water
      if(topBlock.typeId === "minecraft:water" && topBlock.typeId === "minecraft:lava") {
        x = Math.floor(Math.random() * radius) + 1;
        z = Math.floor(Math.random() * radius) + 1;
        return;
      }
      
      if(topBlock) {
        selectedPlayer.tryTeleport({x, y: topBlock.location.y + 1, z})
        if(setSpawnPoint) {
          recentPlayerList = recentPlayerList.filter(d => d.name !== selectedPlayer.name)
          recentPlayerList.push({
            name: selectedPlayer.name,
            dimension: player.dimension.id,
            location: {
              x: x,
              y: topBlock.location.y + 1,
              z: z
            }
          })
          system.run(() => selectedPlayer.runCommand(`spawnpoint @s ${x} ${topBlock.location.y + 1} ${z}`))
          db.store("recentPlayerList", recentPlayerList)
        }
        system.clearRun(runner)
      }
    }, 1*20)
  }
  player.sendMessage(messages.SUCCESS_SPREAD_PLAYERS)
  return {
    status: 0
  }
})


