import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "test",
  description: "description",
  permissionLevel: 1,
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  console.info(player.isNew())
  return {
    status: 0
  }
})


