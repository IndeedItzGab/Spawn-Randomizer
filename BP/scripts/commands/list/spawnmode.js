import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"


const commandInformation = {
  name: "spawnmode",
  description: "Choose which spawn mode will the spawn-randomize should use.",
  aliases: [],
  usage:[
    {
      name: "sr:mode",
      type: 9,
      optional: false
    },
  ]
}

registerCommand(commandInformation, (origin, mode) => {
  
  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(messages.MUST_BE_ADMIN)
  
  let spawnRandomizerSetting = db.fetch("spawnRandomizerSetting", true)
  if(!spawnRandomizerSetting[0]) {
    spawnRandomizerSetting.push({
      mode: mode
    })
  } else {
    spawnRandomizerSetting[0].mode = mode // Spawn-Randomizer Main Setting will be at first array.
  }
  db.store("spawnRandomizerSetting", spawnRandomizerSetting)
  player.sendMessage(messages.SUCCESS_CHANGES_SPAWN_MODE.replace("{0}", mode))
  return {
    status: 0
  }
})


