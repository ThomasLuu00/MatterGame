import 'phaser';

class Box extends Phaser.GameObjects.Graphics{
    
    width: number;
    height: number;

    color: number = 0xffffff;
    alpha: number = 1;
    radius: number = 0;
    padding: number = 0;
    lineColor: number = 0x565656;
    lineWidth: number = 2;
    lineAlpha: number = 1;
    shadow: number = 0;
    shadowColor: number = 0x222222;
    shadowAlpha: number = 0.5;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, config? : BoxConfig){
        super(scene, {x: x, y: y});

        if (config){
            if (config.color) this.color = config.color;
            if (config.alpha) this.alpha = config.alpha;
            if (config.radius) this.radius = config.radius;
            if (config.padding) this.padding = config.padding;
            if (config.lineColor) this.lineColor = config.lineColor;
            if (config.lineWidth) this.lineWidth = config.lineWidth;
            if (config.lineAlpha) this.lineAlpha = config.lineAlpha;
            if (config.shadow) this.shadow = config.shadow;
            if (config.shadowColor) this.shadowColor = config.shadowColor;
            if (config.shadowAlpha) this.shadowAlpha = config.shadowAlpha;
        }
        
        this.width = width + this.padding  * 2;
        this.height = height + this.padding  * 2;
        
        this.refresh();
    }

    setSize(width: number, height: number){
        this.width = width + this.padding  * 2;
        this.height = height + this.padding  * 2;
        this.clear();
        this.refresh();
    }

    refresh(){
        //  Bubble shadow
        if (this.shadow){
            this.fillStyle(this.shadowColor, this.shadowAlpha);
            this.fillRoundedRect(this.shadow, this.shadow, this.width, this.height, this.radius);
        }

        //  Bubble color
        this.fillStyle(this.color, this.alpha);

        //  Bubble outline line style
        this.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);

        //  Bubble shape and outline
        this.strokeRoundedRect(0, 0, this.width, this.height, this.radius);
        this.fillRoundedRect(0, 0, this.width, this.height, this.radius);
    }
}

type BoxConfig = {
    color?: number,
    alpha?: number,
    radius?: number,
    padding?: number,
    lineColor?: number,
    lineWidth?: number,
    lineAlpha?: number,
    shadow?: number,
    shadowColor?: number,
    shadowAlpha?: number,
}

export default Box;