import { Player, world} from "@minecraft/server"
import * as db from "../../storage.js"

Player.prototype.isNew = function () {
  
  // If the player is near the world's spawn location
  const dx = this.location.x - world.getDefaultSpawnLocation().x;
  const dz = this.location.z - world.getDefaultSpawnLocation().z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  const location = distance <= 20;
  
  // If the player has no armor on.
  const equipment = this.getComponent("equippable")
  const noArmor = !equipment.getEquipment("Head") && !equipment.getEquipment("Body") && !equipment.getEquipment("Legs") && !equipment.getEquipment("Feet")
  
  // If player has exp
  const isZeroXP = this.getTotalXp() <= 1

  // If the player is not listed in recent player list
  const isNotListed = db.fetch("recentPlayerList", true).some(d => d.name !== this.name)
 
  return location && noArmor && isZeroXP && isNotListed
};