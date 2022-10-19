
import { _decorator, Component, Node, Prefab, input, Input, Vec3, Director, instantiate, Collider, RigidBody, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Tue Oct 18 2022 20:37:16 GMT+0800 (中国标准时间)
 * Author = danthought
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scripts/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {

    @property({ type: Node })
    private ballNode: Node = null;
    @property({ type: Prefab })
    private blockPrefab: Prefab = null;
    @property({ type: Node })
    private blocksNode: Node = null;
    @property({ type: Label })
    private scoreLabel: Label = null;

    private bounceSpeed: number = 0;
    private gameState: number = 0;
    private blockGap: number = 2.4;
    private score: number = 0;

    start () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.collisionHandler();
        this.initBlock();
    }

    update(dt: number) {
        if (this.gameState == 1) {
            this.moveAllBlock(dt);
        }
    }

    moveAllBlock(dt: number) {
        let speed = -2 * dt;

        for (const blockNode of this.blocksNode.children) {
            let pos = blockNode.position.clone();
            pos.x += speed;
            blockNode.position = pos;

            this.checkBlockOut(blockNode);
        }

        if (this.ballNode.position.y < -4) {
            this.gameState = 2;
            Director.instance.loadScene('Game');
        }
    }

    getLastBlockPosX() {
        let lastBlockPosX = 0;
        for (const blockNode of this.blocksNode.children) {
            if (blockNode.position.x > lastBlockPosX) {
                lastBlockPosX = blockNode.position.x;
            }
        }
        return lastBlockPosX;
    }

    checkBlockOut(blockNode: Node) {
        if (blockNode.position.x < -3) {
            let nextBlockPosX = this.getLastBlockPosX() + this.blockGap;
            let nextBlockPosY = 0;
            blockNode.position = new Vec3(nextBlockPosX, nextBlockPosY, 0);
            this.incrScore();
        }
    }

    incrScore() {
        this.score = this.score + 1;
        this.scoreLabel.string = String(this.score);
    }

    collisionHandler() {
        let collider = this.ballNode.getComponent(Collider);
        let rigidbody = this.ballNode.getComponent(RigidBody);

        collider.on('onCollisionEnter', () => {
            let vc = new Vec3(0, 0, 0);
            rigidbody.getLinearVelocity(vc);

            if (this.bounceSpeed == 0) {
                this.bounceSpeed = Math.abs(vc.y);
            } else {
                rigidbody.setLinearVelocity(new Vec3(0, this.bounceSpeed, 0));
            }
        }, this);
    }

    onTouchStart() {
        if (this.bounceSpeed == 0) {
            return;
        }

        let rigidbody = this.ballNode.getComponent(RigidBody);
        rigidbody.setLinearVelocity(new Vec3(0, -this.bounceSpeed *  1.5, 0));
        this.gameState = 1;
    }

    initBlock() {
        let posX: number;

        for (let i = 0; i < 8; i++) {
            if (i == 0) {
                posX = this.ballNode.position.x;
            } else {
                posX = posX + this.blockGap; 
            }
            this.createNewBlock(new Vec3(posX, 0, 0));
        }
    }

    createNewBlock(pos: Vec3) {
        let blockNode = instantiate(this.blockPrefab);
        blockNode.position = pos;
        this.blocksNode.addChild(blockNode);
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
