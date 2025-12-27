import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"


const commandInformation = {
  name: "clearspawns",
  description: "Clear all specified random spawn locations.",
  permissionLevel: 1,
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  db.store("randomSpecifiedLocation", [])
  
  player.sendMessage(messages.SUCCESS_CLEARED_RANDOM_SPAWN_LOCATIONS)
  return {
    status: 0
  }
})


