import Character from '../characters/character';
import { Weapon } from '../item/itemmeta';

export default class Equipment {
    owner: Character;

    weapon: Weapon = null;

    weaponSlot1: Weapon = null;
    weaponSlot2: Weapon = null;
    weaponSlot3: Weapon = null;
    weaponSlot4: Weapon = null;

    setWeapon(slot: integer) {
        switch (slot) {
            case 1:
                if (this.weaponSlot1 != null) this.weapon = this.weaponSlot1;
                break;
            case 2:
                if (this.weaponSlot2 != null) this.weapon = this.weaponSlot2;
                break;
            case 3:
                if (this.weaponSlot3 != null) this.weapon = this.weaponSlot3;
                break;
            case 4:
                if (this.weaponSlot4 != null) this.weapon = this.weaponSlot4;
                break;
        }
    }

    /*
    helm: Helm;
    torso: Torso;
    pants: Pants;
    shoes: Shoes;
    gloves: Gloves;

    earring1: Earring;
    earring2: Earring;
    necklace: Necklace;
    ring1: Ring;
    ring2: Ring;
    */

    /*
    constructor(owner: Character) {
        this.owner = owner;
    }
    equip(item: Equipable, slot?: integer) {}

    unequip(target: any): boolean {
        return true;
    }
    */
}
