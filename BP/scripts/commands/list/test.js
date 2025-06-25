import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"

const commandInformation = {
  name: "test",
  description: "description",
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


