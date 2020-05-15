import ItemData from './item-data';
import Tags from '../meta/tags';
import Attributes from '../meta/attributes';

export interface Equipable extends Item {
    image: Phaser.Physics.Matter.Image;
    attributes: Attributes;
    tags: Tags[];
}

export interface Useable {
    use: UseFunc;
}

export interface Item {
    data: ItemData;
    icon: Phaser.GameObjects.Image;
}

export interface UseFunc {
    (source: any, target: any): boolean;
}
