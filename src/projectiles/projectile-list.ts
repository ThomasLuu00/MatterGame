import PROJECTILE_COLLISION_GROUP from "../meta/collision-groups";

export enum PROJECTILE{
    KUNAI = 'P01000',
}

type ProjectileList = {readonly [P in PROJECTILE]: ProjectileData;}

export default interface ProjectileData{
    id: PROJECTILE;
    texture: string;
    collisionGroup: PROJECTILE_COLLISION_GROUP;
    damage: number;
}

export const projectileList: ProjectileList = {
    P01000: {
        id: PROJECTILE.KUNAI,
        texture: 'item-kunai',
        collisionGroup: PROJECTILE_COLLISION_GROUP.NORMAL,
        damage: 50,
    },
};