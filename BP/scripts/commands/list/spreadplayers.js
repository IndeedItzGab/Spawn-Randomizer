import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/getTopBlock.js"

const commandInformation = {
  name: "spreadplayers",
  description: "Spread out players around the overworld.",
  aliases: [],
  usage:[
    {
      name: "radius",
      type: 9, // change later, should be int
      optional: false
    },
    {
      name: "setSpawnPoint",
      type: 9, // change later, should be Boolean
      optional true,
    }
    {
      name: "includeAdmin",
      type; 9, // change later, should be Boolean
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, radius, setSpawnPoint = false, includeAdmin = false) => {
  
  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(messages.MUST_BE_ADMIN)
  
  let recentPlayerList = db.fetch("recentPlayerList", true);

  for(const selectedPlayer of world.getPlayers()) {
    if(!includeAdmin && selectedPlayer.isAdmin()) continue;
    let x = Math.floor(Math.random() * radius) + 1;
    let z = Math.floor(Math.random() * radius) + 1;
    selectedPlayer.tryTeleport({x, y: 320, z})
    
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
          selectedPlayer.runCommand(`spawnpoint @s ${x} ${topBlock.location.y + 1} ${z}`) : null
        }
        system.clearRun(runner)
      }
    }, 1*20)
  }
  player.sendMessage(messages.SUCCESS_CHANGES_SPAWN_MODE.replace("{0}", mode))
  return {
    status: 0
  }
})


