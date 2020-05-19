import Tags from "../meta/tags";
import Attributes from "../meta/attributes";

export interface ItemType{
    id: string;
    name: string;
    description: string;
    tags: Tags[];
    iconKey: string;
}

export interface Equipable {
    attributes: Attributes;
}

export interface Useable {
    use: UseFunc;
}

interface UseFunc {
    (source: any, target: any): boolean;
}
