import Phaser from '../lib/phaser.js'
import Carrot from '../game/carrot.js'

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  carrots
  carrotsCollected = 0
  /** @type {Phaser.GameObjects.Text} */
  carrotsCollectedText

  constructor() {
    super('game')
  }
  init() {
    this.carrotsCollected = 0
  }
  preload() {
    this.load.image('background', 'assets/bg_layer1.png')
    this.load.image('platform', 'assets/ground_grass.png')
    this.load.image('bunny-stand', 'assets/bunny1_stand.png')
    this.load.image('bunny-jump', 'assets/bunny1_jump.png')
    this.load.image('carrot', 'assets/carrot.png')
    this.load.audio('jump', 'assets/sfx/phaseJump1.ogg')

    this.cursors = this.input.keyboard.createCursorKeys()
  }
  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
      .setScrollFactor(1, 0)

    // this.physics.add.image(this.scale.width / 2, this.scale.height / 2, 'platform')
    //   .setScale(0.5)

    this.platforms = this.physics.add.staticGroup()

    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = 0.5

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body
      platform.body.checkCollision.down = false
      platform.body.checkCollision.left = false
      platform.body.checkCollision.right = false
      body.updateFromGameObject()
    }

    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'bunny-stand')
      .setScale(0.5)

    this.physics.add.collider(this.platforms, this.player)
    // this.player.body.checkCollision.up = false
    // this.player.body.checkCollision.left = false
    // this.player.body.checkCollision.right = false

    this.cameras.main.startFollow(this.player).setDeadzone(this.scale.width * 1.5)

    // const carrot = new Carrot(this, this.scale.width / 2, this.scale.height / 2, 'carrot')
    // this.add.existing(carrot)
    this.carrots = this.physics.add.group({
      classType: Carrot
    })

    // this.carrots.get(this.scale.width / 2, this.scale.height / 2, 'carrot')

    this.physics.add.collider(this.platforms, this.carrots)

    this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this)

    const style = { color: '#000', fontSize: 24 }
    this.carrotsCollectedText = this.add.text(this.scale.width / 2, 10, 'Carrot: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
  }
  update(t, dt) {
    const bottomPlatform = this.findBottomMostPlatform()
    if (this.player.y > bottomPlatform.y + 200) {
      // console.log('Game Over')
      this.scene.start('game-over')
      return
    }

    // const touchingDown = this.player.body.touching.down
    let touchingDown = false

    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child

      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        this.addCarrotAbove(platform)
      }

      touchingDown = touchingDown || (platform.body.touching.up && this.player.body.touching.down)
    })

    if (touchingDown) {
      this.player.setVelocityY(-300)

      this.player.setTexture('bunny-jump')

      this.sound.play('jump')
    }

    const vy = this.player.body.velocity.y
    if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
      this.player.setTexture('bunny-stand')
    }
    this.player.body.setSize(this.player.texture.width, this.player.texture.height)

    this.player.setDragX(50)
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setAccelerationX(-150)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setAccelerationX(150)
    } else {
      this.player.setAccelerationX(0)
    }

    this.horizontalWrap(this.player)

    console.log(this.carrots.getLength())
    this.carrots.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const carrot = child

      if (carrot.y >= scrollY + 100) {
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
      }
    })
  }
  /**
   * @param {Phaser.GameObjects.Sprite}
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }
  }
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    const x = sprite.x + Phaser.Math.Between(-sprite.displayWidth / 2, sprite.displayWidth / 2)
    const y = sprite.y - sprite.displayHeight

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(x, y, 'carrot')

    carrot.setActive(true)
    carrot.setVisible(true)

    this.add.existing(carrot)

    carrot.body.setSize(carrot.width, carrot.height)

    this.physics.world.enable(carrot)

    return carrot
  }
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCarrot(player, carrot) {
    console.log(1)

    this.carrots.killAndHide(carrot)

    this.physics.world.disableBody(carrot.body)

    this.carrotsCollected++
    const value = `Carrot: ${this.carrotsCollected}`
    this.carrotsCollectedText.text = value
  }
  findBottomMostPlatform() {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    let bottomPlatform = null

    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child

      if (bottomPlatform && platform.y < bottomPlatform.y) {
        return
      }

      bottomPlatform = platform
    })

    return bottomPlatform
  }
}
