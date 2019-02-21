/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function (gs) {

    this.board = [];

    this.state = ["Memory Game", "Match found!", "Try again!", "You win!"];

    this.message;

    this.first_card;

    this.time;

    this.end;

    this.initGame = function () {

        var cont = 0, card;
        //let pos; 
        var usadas = [];

        this.message = this.state[0];

        this.end = false;

        //Inicializamos las casillas del tablero a undefined y le asignamos la imagen del back
        this.board.size = 16;
        for (let i = 0; i < this.board.size; i++) {
            this.board[i] = undefined;
        }


        //Bucle para asignar imágenes de forma aleatoria al tablero
        while (cont < this.board.size) {

            card = Math.floor(Math.random() * (18 - 0) + 0);

            if (!usadas.some(n => n === card) && card !== 1 && card !== (this.board.size / 2 + 2)) {

                usadas.push(card);

                if (card > (this.board.size / 2)) {
                    this.board[cont] = new MemoryGameCard(Object.keys(gs.maps)[card - (this.board.size / 2 + 1)]);
                }   
                else {
                    this.board[cont] = new MemoryGameCard(Object.keys(gs.maps)[card]);
                }

                cont++;
            }

        }

        this.loop();
    }
    //Bucle del juego. Llama a draw cada 16 ms (60 fps)
    this.loop = function () {
        this.time = setInterval(()=>{this.draw()}, 16);
    }

    this.draw = function () {
        
        if(this.end){
            this.message = this.state[3];
            clearInterval(this.time);
        }

        gs.drawMessage(this.message);

        for (let i = 0; i < this.board.size; i++) {
            this.board[i].draw(gs, i);
        }
    
    }

    this.onClick = function (cardId) {

        let volteadas=0, descubiertas=0;
        
        for(let i=0; i<this.board.size; i++){
            if(this.board[i].volteada && !this.board[i].f)
                volteadas++;
        }
        
        
        if (volteadas < 2) {
            
            //Caso 1: Ya hay una volteada
            if (volteadas === 1 && cardId !== this.first_card && !this.board[cardId].f) {
                //Se voltea la carta cardId
                this.board[cardId].flip();
               
                if (this.board[this.first_card].compareTo(this.board[cardId].name)) {

                    this.message = this.state[1];
                    this.board[cardId].found();
                    this.board[this.first_card].found();
                    var change_message = setTimeout(()=>{
                        this.message = this.state[0];
                    }, 1000)
                }
                else {

                    this.message = this.state[2];
                    var voltear_de_nuevo = setTimeout((board, first_card, cardId) => {
                        board[cardId].flip();
                        board[first_card].flip();
                        this.message = this.state[0];
                    }, 1000, this.board, this.first_card, cardId);
                }

                this.first_card = undefined;
            } //Caso 2: No hay ninguna volteada
            else if(volteadas === 0 && !this.board[cardId].f){
                this.first_card = cardId;
                this.board[cardId].flip();
            }
        }

        for(let i=0; i<this.board.size; i++){
            if(this.board[i].f)
                descubiertas++;
        }


        if(descubiertas === this.board.size)
            this.end = true;
        
        
    }
    

};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function (id) {

    this.volteada = false;

    this.name = id;

    this.f = false;

    this.flip = function () {
        if (this.volteada) {
            this.volteada = false;
        }
        else {
            this.volteada = true;
        }
    }

    this.compareTo = function (otherCard) {
        return (this.name === otherCard);
    }

    this.found = function () {
        this.f = true;
    }

    this.draw = function (gs, pos) {
        if (!this.volteada) {
            gs.draw("back", pos);
        }
        else {
            gs.draw(this.name, pos);
        }
    }
};
