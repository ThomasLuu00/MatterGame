export default abstract class Item extends Phaser.Physics.Matter.Image{
    body : MatterJS.BodyType;
    name : string;
    sensor;
    constructor(world : Phaser.Physics.Matter.World, x : number, y : number, texture : string){
        super(world, x, y, texture)
        this.scene.add.existing(this);
        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const w = this.width * 0.5;
        const h = this.height * 0.7;

        const mainBody = Bodies.circle(-w/2, -h , w , {label: 'circlebody'});
        this.sensor = Bodies.circle(-w/2, -h , w , { isSensor: true, label: 'circle'});

        const compoundBody = Body.create({
            parts: [mainBody, this.sensor],
            inertia: Infinity
        });

        let cx = this.centerOfMass.x
        let cy = this.centerOfMass.y

        this.setExistingBody(compoundBody);
        this.setOrigin(cx, cy);
        this.setPosition(x, y);
    }
}

class ItemTest {
    id: string;
    name: string;
    type: Array<string>;
    description: string;
    texture: string;

    constructor(id: string){
    }
}