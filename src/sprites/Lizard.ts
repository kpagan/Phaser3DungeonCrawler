import Phase from 'phaser'

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const randomDirection = (exclude: Direction) => {
    let newDirection = Phaser.Math.Between(0, 3);
    while (newDirection === exclude) {
        newDirection = Phaser.Math.Between(0, 3);
    }
    return newDirection;
}
export default class Lizard extends Phaser.Physics.Arcade.Sprite {

    private direction = Direction.RIGHT;
    private moveEvent: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.anims.play('lizard-idle');
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileColision, this);
        // change direction every 2 seconds
        this. moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.changeDirection();
            },
            loop: true
        })
    }

    private changeDirection() {
        this.direction = randomDirection(this.direction);
    }

    private handleTileColision(object: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        if (object !== this) {
            return;
        }
        
        this.changeDirection();
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        let speed = 50;

        switch (this.direction) {
            case Direction.UP:
                this.setVelocity(0, -speed);
                break;
            case Direction.DOWN:
                this.setVelocity(0, speed);
                break;
            case Direction.LEFT:
                this.setVelocity(-speed, 0);
                break;
            case Direction.RIGHT:
                this.setVelocity(speed, 0);
                break;
        }
    }

    destroy() {
        this.moveEvent.destroy();
        super.destroy();
    }

    static createLizardAnims = (anims: Phaser.Animations.AnimationManager) => {
        anims.create({
            key: 'lizard-idle',
            frames: anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_idle_anim_f' }),
            repeat: -1,
            frameRate: 8
        });
    
        anims.create({
            key: 'lizard-run',
            frames: anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_run_anim_f' }),
            repeat: -1,
            frameRate: 8
        });
    }
}