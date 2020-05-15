export default class Inventory implements ItemList{
    [index: number]: InventorySlot<Item>;
    head = null;
    tail = null;
    count = 0;

    constructor(n: number){
        for (let i = 0; i < n; i++){
            this.push();
        }
    }

    push(item: Item = null){
        let node: InventorySlot<Item> = {
            item: item,
            prev: this.tail,
            next: null,
        }
        if (this.count == 0) this.head = node;
        this.tail = node;
        this[this.count] = node;
        this.count += 1;
    }

    setItem(index: number, item: Item): Item{
        let oldItem: Item = null;
        if (index < this.count && index >= 0) {

        }
        return oldItem;
    }

    popItem(index: number): Item{
        let oldItem = this[index].item;
        this[index].item = null;
        return oldItem;
    }
    
    swapItems(index1: number, index2: number){
        if (index1 < this.count && index1 >= 0 && index2 < this.count && index2 >= 0) {
            let temp: Item = this[index1].item;
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
}

interface ItemList{
    [index: number]: InventorySlot<Item>;
    head: InventorySlot<Item>;
    tail: InventorySlot<Item>;
}
interface InventorySlot<T>{
    item: T;
    next: InventorySlot<T>;
    prev: InventorySlot<T>;
}

interface Item{
    id: string;
    name: string;
}

