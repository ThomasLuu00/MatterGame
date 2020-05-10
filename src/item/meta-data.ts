enum Tags {
    // Item Type
    EQUIPABLE = 'Equipable',
    USEABLE = 'Useable',

    // Attack types
    MELEE = 'Melee',
    MAGIC = 'Magic',
    RANGED = 'Ranged',

    // Status Effects
    SLOW = 'Slow',
    STUN = 'Stun',
    BURN = 'Burn',
    POISON = 'Poison',
    EXHUAST = 'Exhuast',
    SILENCE = 'Silence',
}

interface Attributes {
    health?: number;
    mana?: number;
    stamina?: number;

    attack?: number;
    defence?: number;

    attackSpeed?: number;
    castSpeed?: number;
    projectileSpeed?: number;

    jumpHeight?: number;
    moveSpeed?: number;
};

export {Tags, Attributes};
