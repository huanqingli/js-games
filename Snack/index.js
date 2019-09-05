class Cell{
  constructor(row, column){
    this.row = row
    this.column = column
    this.type = 'EMPTY' // 'SNAKE' 'FOOD'
  }
}
class Board{
  constructor(rows, columns){
    this.score = 0
    this.allCell = []
    this.head = undefined
    this.direction = 'NONE' // 'RIGHT' 'LEFT' 'UP' 'DOWN'
    this.initBoard(rows, columns)
    this.snake = this.initSnake()
  }
  initBoard(rows, columns){
    for(let row = 0 ; row < rows ; row++){
      this.allCell[row] = []
      for(let column = 0 ; column < columns; column++){
        this.allCell[row][column] = new Cell(row, column)
      }
    }
  }
  initSnake(){
    this.allCell[0][0].type = 'SNAKE'
    this.allCell[0][1].type = 'SNAKE'
    this.allCell[0][2].type = 'SNAKE'
    this.head = this.allCell[0][2]
    return [this.allCell[0][0], this.allCell[0][1], this.allCell[0][2]]
  }
  move(){
    let row = this.head.row
    let column = this.head.column
    switch (this.direction) {
      case 'DOWN': row += 1
        break;
      case 'UP': row -= 1
        break;
      case 'LEFT': column -= 1
        break;
      case 'RIGHT': column += 1
        break;
      default:
        break;
    }
    if(this.direction === 'NONE'){
      return true
    }
    if (
      !this.allCell[row] || // break the wall
      !this.allCell[row][column] || // break the wall
      this.snake.includes(this.allCell[row][column]) // eat self
    ) {
      location.reload()
      alert('score:' + this.score)
      return
    }
    this.head = this.allCell[row][column] // next head
    if(this.head.type !== 'FOOD'){
      let tail = this.snake.shift()
      tail.type = 'EMPTY'
    } else {
      this.score += 1
      this.generateFood()
    }
    this.head.type = 'SNAKE'
    this.snake.push(this.head)
  }
  generateFood(){
    let list = this.getEmptyCell()
    list[Math.floor(Math.random()*list.length)].type = 'FOOD'
  }
  getEmptyCell(){
    let emptyList = []
    for(let row = 0 ; row < this.allCell.length ; row++){
      for(let column = 0 ; column < this.allCell[0].length ; column++){
        if(this.allCell[row][column].type === 'EMPTY'){
          emptyList.push(this.allCell[row][column])
        }
      }
    }
    return emptyList
  }
  startGame(speed){
    this.generateFood()
    setInterval(this.move.bind(this), 1000/speed)
  }
}
let columns = 50
let rows = 40
let speed = 5
var app = new Vue({
  el: '#app',
  data: {
    board: new Board(rows, columns)
  },
  methods:{
    go(event){
      switch (event.code) {
        case 'ArrowUp': this.board.direction = this.board.direction === 'DOWN' ? 'DOWN' : 'UP'
          break;
        case 'ArrowDown': this.board.direction = this.board.direction === 'UP' ? 'UP' : 'DOWN'
          break;
        case 'ArrowRight': this.board.direction = this.board.direction === 'LEFT' ? 'LEFT' : 'RIGHT'
          break;
        case 'ArrowLeft': this.board.direction = this.board.direction === 'RIGHT' ? 'RIGHT' : 'LEFT'
          break;
        default:
          break;
      }
    }
  },
  created(){
    document.onkeyup=this.go
    this.board.startGame(speed)
  }
})