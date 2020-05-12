const enum Particle{
    MagicSpell = 'magicspell',
    Magic8 = 'magic8',
    BlueFire = 'bluefire',
    Casting = 'casting',
    MagickaHit = 'magickahit',
    FlameLash = 'flamelash',
    FireSpin = 'firespin',
    ProtectionCircle = 'protectioncircle',
    BrightFire = 'brightfire',
    WeaponHit = 'weaponhit',
    Fire = 'fire',
    Nebula = 'nebula',
    Vortex = 'vortex',
    Phatom = 'phantom',
    Loading = 'loading',
    SunBurn = 'sunburn',
    FelSpell = 'felspell',
    Midnight = 'midnight',
    Freezing = 'freezing',
    MagicBubbles = 'magicbubbles'
}

const dir = '../assets/particles/'
const ParticleTextures : ParticleList= {
    MagicSpell:{
        key: Particle.MagicSpell,
        spritesheet: dir + '1_magicspell_spritesheet.png',
        spritesheetConfig: {
            frameWidth: 100, 
            frameHeight: 100, 
            endFrame: 73,
        },
        animConfig:{
            start: 0,
            end: 73,
        },
    },
    Magic8:{
        key: Particle.Magic8,
        spritesheet: dir + '2_magic8_spritesheet.png',
        spritesheetConfig: {
            frameWidth: 100, 
            frameHeight: 100, 
            endFrame: 60
        },
        animConfig:{
            start: 0,
            end: 60,
        },
    },
    BlueFire:{
        key: Particle.BlueFire,
        spritesheet: dir + '3_bluefire_spritesheet.png',
        spritesheetConfig: {
            frameWidth: 100, 
            frameHeight: 100, 
            endFrame: 60,
        },
        animConfig:{
            start: 0,
            end: 60,
        },
    },
    Casting:{
        key: Particle.MagicSpell,
        spritesheet: dir + '4_casting_spritesheet.png',
        spritesheetConfig: {
            frameWidth: 100, 
            frameHeight: 100, 
            endFrame: 71,
        },
        animConfig:{
            start: 0,
            end: 71,
        },
    },
    MagickaHit:{
        key: Particle.MagickaHit,
        spritesheet: dir + '5_magickahit_spritesheet.png',
        spritesheetConfig: {
            frameWidth: 100, 
            frameHeight: 100, 
            endFrame: 39,
        },
        animConfig:{
            start: 0,
            end: 39,
        },
    },
}

interface ParticleList{
    [index: string]: ParticleTexture;
}

interface ParticleTexture {
    key: Particle;
    spritesheet: string,
    spritesheetConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig,
    animConfig: Phaser.Types.Animations.GenerateFrameNames,
}
export {Particle, ParticleTextures};

