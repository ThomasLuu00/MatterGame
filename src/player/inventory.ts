import Tags from "../meta/tags";
import { ItemType } from "../item/item";

export default class Inventory implements ItemList{
    [index: number]: InventorySlot<ItemType>;
    head = null;
    tail = null;
    count = 0;

    constructor(n: number){
        for (let i = 0; i < n; i++){
            this.push();
        }
    }

    push(item: ItemType = null){
        let node: InventorySlot<ItemType> = {
            item: item,
            prev: this.tail,
            next: null,
        }
        if (this.count == 0) this.head = node;
        this.tail = node;
        this[this.count] = node;
        this.count += 1;
    }

    setItem(index: number, item: ItemType): ItemType{
        let oldItem: ItemType = null;
        if (index < this.count && index >= 0) {
            this[index].item = item;
        }
        return oldItem;
    }

    popItem(index: number): ItemType{
        let oldItem = this[index].item;
        this[index].item = null;
        return oldItem;
    }
    
    swapItems(index1: number, index2: number){
        if (index1 < this.count && index1 >= 0 && index2 < this.count && index2 >= 0) {
            let temp: ItemType = this[index1].item;
            this[index1].item = this[index2].item;
            this[index2].item = temp;
        }
    }

    condense(){
        let empty: number = null;
        for (let i = 0; i < this.count; i++){
            if (empty === null && this[i].item === null){
                empty = i;
            }
            else if (this[i].item !== null && empty !== null ){
                this.swapItems(empty, i);
                empty += 1;
            } 
        }
    }

    addItem(item: ItemType): boolean{
        if (item){
            let i = 0;
            while (i < this.count){
                if (!this[i].item && this[i].item !== item){
                    this[i].item = item;
                    return true;
                }
                i++;
            }
            return false;
        }
    }
}

interface ItemList{
    [index: number]: InventorySlot<ItemType>;
    head: InventorySlot<ItemType>;
    tail: InventorySlot<ItemType>;
}

export interface InventorySlot<T>{
    item: T;
    next: InventorySlot<T>;
    prev: InventorySlot<T>;
}


