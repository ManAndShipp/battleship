function init() {
	let fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton;
	let guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress;
}
window.onload = init;

function handleKeyPress(e) {
	let fireButton = document.getElementById('fireButton');
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton() {
	let guessInput = document.getElementById('guessInput');
	let guess = guessInput.value;
	guess = guess[0] + (Number(guess[1]) - 1);
	controller.processGuess(guess);
	guessInput.value = '';
}

let view = {
	displayMessage: msg => {
		document.getElementById('messageArea').innerHTML = msg;
	},
	fire: () => {
		this.displayMessage(document.getElementById('guessInput').innerHTML);
	},
	displayHit: location => {
		document.getElementById(location).classList.add('hit');
	},
	displayMiss: location => {
		document.getElementById(location).classList.add('miss');
	}
};

let model = {
	boardSize: 7,
	numShips: 3,
	shipLenght: 3,
	shipSunk: 0,
	ships: [
		{
			locations: ['06', '16', '26'],
			hits: ['', '', '']
		},
		{
			locations: ['24', '34', '44'],
			hits: ['', '', '']
		},
		{
			locations: ['10', '11', '12'],
			hits: ['', '', '']
		}
	],

	fire: function(guess) {
		let index = 0;
		for (let i = 0; i < this.ships.length; i++) {
			let ship = this.ships[i];
			locations = ship.locations;
			index = locations.indexOf(guess);
			if (index != -1) {
				ship.hits[index] = 'hit';
				view.displayHit(locations[index]);
				view.displayMessage('HIT!');
				if (this.isSunk(ship)) {
					view.displayMessage('You sank my battleship!');
					this.shipSunk++;
				}
				return true;
			}
		}
		view.displayMessage('You missed.');
		view.displayMiss(guess);
		return false;
	},
	isSunk: function(ship) {
		for (let i = 0; i < ship.locations.length; i++) {
			if (ship.hits[i] !== 'hit') {
				//console.log('Sunk');
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function() {
		let locations;
		for (var i = 0; i < this.numShips; i++) {
			do {} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function() {
		let diraction = Math.floor(Math.random() * 2);
		let row, col;
		let newShipLocations = [];
		if (diraction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - 3));
		} else {
			row = Math.floor(Math.random() * this.boardSize - 3);
			col = Math.floor(Math.random() * this.boardSize);
		}
		for (let i = 0; i < this.shipLength; i++) {
			if (diraction === 1) {
				row = Math.floor(Math.random() * this.boardSize);
				col = Math.floor(Math.random() * (this.boardSize - 3));
			} else {
				row = Math.floor(Math.random() * this.boardSize - 3);
				col = Math.floor(Math.random() * this.boardSize);
			}
		}
		return newShipLocations;
	}
};

let controller = {
	guesses: 0,

	processGuess: function(guess) {
		let location = this.parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipSunk === model.ships.length) {
				view.displayMessage(
					'You sank all my battleships, in ' + this.guesses + ' guesses'
				);
				console.log('win');
			}
		}
	},
	parseGuess: function(guess) {
		if (guess === null || guess.length !== 2) {
			alert('Oops, please enter a letter and a number on the board.');
		} else {
			let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
			let firsrChar = guess[0];
			let row = alphabet.indexOf(firsrChar);
			let column = guess[1];
			if (isNaN(row) || isNaN(column)) {
				alert("Oops, that isn't on the board.");
			} else if (
				row < 0 ||
				row >= model.boardSize ||
				column < 0 ||
				column >= model.boardSize
			) {
				alert("Oops, that's off the board!");
			} else return row + column;
		}
		return null;
	}
};

let generate = {};

let tests = {
	viewDesck: function() {
		for (let i = 0; i < model.boardSize; i++)
			for (let j = 0; j < model.boardSize; j++) {
				model.fire(i + '' + j);
			}
	}
};

tests.viewDesck();
