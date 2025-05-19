import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"


const commandInformation = {
  name: "clearspawns",
  description: "Clear all specified random spawn locations.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(messages.MUST_BE_ADMIN)
  db.store("randomSpecifiedLocation", [])
  player.sendMessage(messages.SUCCESS_CLEARED_RANDOM_SPAWN_LOCATIONS)
  return {
    status: 0
  }
})


