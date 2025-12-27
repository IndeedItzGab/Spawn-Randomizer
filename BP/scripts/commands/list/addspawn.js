import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "addspawn",
  description: "Add your current location to be listed as one of the specified random spawn location.",
  permissionLevel: 1,
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  let specifiedLocations = db.fetch("randomSpecifiedLocation", true)
  
  specifiedLocations.push({
    location: {
      x: Math.round(player.location.x),
      y: Math.round(player.location.y),
      z: Math.round(player.location.z)
    },
    dimension: player.dimension.id
  })
  db.store("randomSpecifiedLocation", specifiedLocations)
  player.sendMessage(messages.SUCCESS_SET_RANDOM_SPAWN_LOCATION)
  return {
    status: 0
  }
})


