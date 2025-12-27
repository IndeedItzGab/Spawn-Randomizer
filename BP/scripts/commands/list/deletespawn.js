import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"


const commandInformation = {
  name: "deletespawn",
  description: "Delete the current spawn location that you are standing on.",
  permissionLevel: 1,
  aliases: ["delspawn"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  let specifiedLocations = db.fetch("randomSpecifiedLocation", true)
  
  if(!specifiedLocations.some(d => d.location.x === Math.round(player.location.x) && d.location.z === Math.round(player.location.z) && d.dimension === player.dimension.id)) return player.sendMessage(messages.FAILED_DELETED_RANDOM_SPAWN_LOCATION)
  specifiedLocations = specifiedLocations.filter(d => !(d.location.x ===  Math.round(player.location.x) && d.location.z === Math.round(player.location.z) && d.dimension === player.dimension.id))
  db.store("randomSpecifiedLocation", specifiedLocations)
  player.sendMessage(messages.SUCCESS_DELETED_RANDOM_SPAWN_LOCATION)
  return {
    status: 0
  }
})


