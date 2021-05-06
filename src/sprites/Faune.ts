import Phaser from 'phaser'
import Treasure from './Treasure';
import {sceneEvents} from '../events/EventCenter'
import EventsConstants from '~/events/EventsConstants';

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            faune(x: number, y: number, texture: string, frame?: string | number): Faune;
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {

    private healthState: HealthState = HealthState.IDLE;
    private damageTime: number = 0;

    private _health: number = 3;
    private _coins: number = 0;


    private knives?: Phaser.Physics.Arcade.Group;
    private activeChest?: Treasure

    get health() {
        return this._health;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.anims.play('faune-idle-down');

    }

    setKnives(knives: Phaser.Physics.Arcade.Group) {
        this.knives = knives;
    }

    setChest(chest: Treasure) {
        this.activeChest = chest;
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (this.healthState === HealthState.DAMAGE
            || this.healthState == HealthState.DEAD) {
            return
        }

        if (!cursors) {
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            if (this.activeChest) {
                let coins = this.activeChest.open();
                this._coins += coins;
                sceneEvents.emit(EventsConstants.PLAYER_COINS_CHANGE, this._coins);
            } else {
                this.throwKnife();
            }
            return; // prevent any other movement while throwing knives
        }

        let speed = 100;

        let leftDown = cursors.left.isDown;
        let rightDown = cursors.right.isDown;
        const upDown = cursors.up.isDown;
        const downDown = cursors.down.isDown;

        if (leftDown) {
            this.anims.play('faune-run-side', true);
            this.setVelocity(-speed, 0);
            this.scaleX = -1;
            this.body.offset.x = 24;
        } else if (rightDown) {
            this.anims.play('faune-run-side', true);
            this.setVelocity(speed, 0);
            this.scaleX = 1;
            this.body.offset.x = 8;
        } else if (upDown) {
            this.anims.play('faune-run-up', true);
            this.setVelocity(0, -speed);
        } else if (downDown) {
            this.anims.play('faune-run-down', true);
            this.setVelocity(0, speed);
        } else {
            let parts = this.anims.currentAnim.key.split('-');
            parts[1] = 'idle';
            this.setVelocity(0, 0);
            this.anims.play(parts.join('-'));
        }

        if (leftDown || rightDown || upDown || downDown) {
            this.activeChest = undefined;
        }
    }

    handleDamage(dir: Phaser.Math.Vector2) {
        if (this._health <= 0) {
            return;
        }

        if (this.healthState === HealthState.DAMAGE) {
            return
        }


        --this._health;

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD;
            this.anims.play('faune-faint');
        } else {
            this.setVelocity(dir.x, dir.y);
            this.setTint(0xff0000);
            this.healthState = HealthState.DAMAGE;
            this.damageTime = 0;
        }
    }

    private throwKnife() {

        if (!this.knives) {
            return
        }

        let knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image
        if (!knife) {
            return;
        }
        
        let parts = this.anims.currentAnim.key.split('-');
        let direction = parts[2];

        let vec = new Phaser.Math.Vector2(0, 0);
        switch (direction) {
            case 'up':
                vec.y = -1;
                break;
            case 'down':
                vec.y = 1;
                break;
            default:
            case 'side':
                if (this.scaleX < 0) {
                    vec.x = -1;
                } else {
                    vec.x = 1;
                }
                break;
        }

        let angle = vec.angle();
        knife.setActive(true);
        knife.setVisible(true);
        knife.setRotation(angle);
        knife.x += vec.x * 16;
        knife.y += vec.y * 16;
        knife.setVelocity(vec.x * 300, vec.y * 300);
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        switch (this.healthState) {
            case HealthState.IDLE:
                break;
            case HealthState.DAMAGE:
                this.damageTime += dt;
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff);
                }
                break;
        }
    }

    static createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
        anims.create({
            key: 'faune-idle-down',
            frames: [{ key: 'faune', frame: 'walk-down-3' }]
        });

        anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3' }]
        });

        anims.create({
            key: 'faune-idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3' }]
        });

        anims.create({
            key: 'faune-run-down',
            frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-' }),
            repeat: -1,
            frameRate: 15
        });

        anims.create({
            key: 'faune-run-up',
            frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-' }),
            repeat: -1,
            frameRate: 15
        });

        anims.create({
            key: 'faune-run-side',
            frames: anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-' }),
            repeat: -1,
            frameRate: 15
        });

        anims.create({
            key: 'faune-faint',
            frames: anims.generateFrameNames('faune', { start: 1, end: 4, prefix: 'faint-' }),
            frameRate: 15
        });
    }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    let sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.7);
    sprite.setOrigin(0.5, 0.4);
    return sprite;
})