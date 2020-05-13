const enum Particle{
    MagicSpell = 'MagicSpell',
    Magic8 = 'Magic8',
    BlueFire = 'BlueFire',
    Casting = 'Casting',
    MagickaHit = 'MagickaHit',

    Vortex = 'Vortex',
    /*
    FlameLash = 'FlameLash',
    FireSpin = 'FireSpin',
    ProtectionCircle = 'ProtectionCircle',
    BrightFire = 'BrightFire',
    WeaponHit = 'WeaponHit',
    Fire = 'Fire',
    Nebula = 'Nebula',

    Phatom = 'Phatom',
    Loading = 'Loading',
    SunBurn = 'SunBurn',
    FelSpell = 'FelSpell',
    Midnight = 'Midnight',
    Freezing = 'Freezing',
    MagicBubbles = 'MagicBubbles'
    */
}

const dir = '../assets/particles/'
const ParticleTextures : ParticleList = {
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
    Vortex:{
        key: Particle.Vortex,
        spritesheet: dir + '13_vortex_spritesheet.png',
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
}

type ParticleList = {
    [P in Particle]: ParticleTexture
}

interface ParticleTexture {
    key: Particle;
    spritesheet: string,
    spritesheetConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig,
    animConfig: Phaser.Types.Animations.GenerateFrameNames,
}

function addParticleAnimations(scene) {
    scene.anims.create({
        key: Particle.MagicSpell,
        frames: scene.anims.generateFrameNames(Particle.MagicSpell, ParticleTextures.MagicSpell.animConfig),
        repeat: 0,
        frameRate: 60,
    });
    scene.anims.create({
        key: Particle.Magic8,
        frames: scene.anims.generateFrameNames(Particle.Magic8, ParticleTextures.Magic8.animConfig),
        repeat: 0,
        frameRate: 60,
    });
    scene.anims.create({
        key: Particle.BlueFire,
        frames: scene.anims.generateFrameNames(Particle.BlueFire, ParticleTextures.BlueFire.animConfig),
        repeat: 0,
        frameRate: 60,
    });
    scene.anims.create({
        key: Particle.Casting,
        frames: scene.anims.generateFrameNames(Particle.Casting, ParticleTextures.Casting.animConfig),
        repeat: 0,
        frameRate: 60,
    });
    scene.anims.create({
        key: Particle.MagickaHit,
        frames: scene.anims.generateFrameNames(Particle.MagickaHit, ParticleTextures.MagickaHit.animConfig),
        repeat: 0,
        frameRate: 60,
    });
    scene.anims.create({
        key: Particle.Vortex,
        frames: scene.anims.generateFrameNames(Particle.Vortex, ParticleTextures.Vortex.animConfig),
        repeat: 0,
        frameRate: 60,
    });
}
export {Particle, ParticleTextures, addParticleAnimations};

