import Phaser from 'phaser'
import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import GameUI from './scenes/GameUI'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 500,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [Preloader, Game, GameUI],	
	scale: {
		zoom: 2
	}
}

export default new Phaser.Game(config)
