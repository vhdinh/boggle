import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import { ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'BOGGLE';
  boardSize = 16;
  // list of dice
  board = [
    "aoeiue","aafirs","adenvn","aiieei",
    "pfhrsy","bjkqxz","cgenst","aeiiou",
    "conlpt","ceipst","dhlnpr","ewiitt",
    "emonmt","eaiuoo","fiprsy","oioaau"];
  boardString = '';
  currentWord = '';
  correctWords = [];
  incorrectWords = [];
  score = 0;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.createBoard();
  }

  createBoard() {
    let piece;
    for (let i = 0; i < this.boardSize; i++) {
      const index = Math.floor((Math.random() * this.boardSize));
      const temp = this.board[index];
      this.board[index] = this.board[i];
      this.board[i] = temp;
    }
    // populating letters
    for (let i = 0; i < this.boardSize; i++) {
      this.boardString += this.board[i][Math.floor((Math.random() * 6))];
    }

    for (let i = 0; i < this.boardString.length; i++) {
      piece = '<li class="letter" data-order="' + i + '" data-val="' +
        this.boardString[i] + '"><span>' + this.boardString[i] +
        '</span></li>';
      $('#board').append(piece);
    }

    $('#board').on('click', 'li', (e) => {
      this.handleLetterClick(e.currentTarget);
    });
  }

  handleLetterClick(e) {
    const param = $(e)[0].getAttribute('data-val');
    if ($(e)[0].classList.contains('selected') || $(e)[0].classList.contains('disabled')) {
      return;
    }
    this.currentWord += param;
    this.setValidSelection(parseInt($(e)[0].getAttribute('data-order')));

  }

  setValidSelection(index) {
    let letters = $('#board').find('li');
    for (let i = 0; i < this.boardString.length; i++) {
      letters[i].classList.add('disabled');
    }
    // RIGHT
    if (index != 3 && index != 7 && index != 11 && index != 15) {
      letters[index + 1].classList.remove('disabled');
    }
    // LEFT
    if (index % 4 > 0) {
      letters[index - 1].classList.remove('disabled');
    }
    // TOP
    if (index > 3) {
      letters[index - 4].classList.remove('disabled');
    }
    // BOTTOM
    if (index < 12) {
      letters[index + 4].classList.remove('disabled');
    }
    // BOTTOM RIGHT
    if (index < 11 && index != 3 && index != 7 && index != 11 && index!= 14) {
      letters[index + 5].classList.remove('disabled');
    }
    // BOTTOM LEFT
    if (index < 12 && index % 4 > 0) {
      letters[index + 3].classList.remove('disabled');
    }
    // TOP LEFT
    if (index > 3 && index % 4 > 0) {
      letters[index - 5].classList.remove('disabled');
    }
    // TOP RIGHT
    if (index > 3 && index != 3 && index != 7 && index != 11 && index != 15) {
      letters[index - 3].classList.remove('disabled');
    }
    letters[index].classList.add('selected');
  }

  resetBoard() {
    this.currentWord = '';
    const letters = $('#board').find('li');
    for (let i = 0; i < this.boardString.length; i++) {
      letters[i].classList.remove('disabled');
      letters[i].classList.remove('selected');
    }
  }

  // resetGame() {
  //   this.createBoard();
  //   this.resetBoard();
  //   this.incorrectWords = [];
  //   this.correctWords = [];
  // }

  submitGuess() {
    this.http.post('https://us-central1-hazel-analytics.cloudfunctions.net/boggle-dictionary', {
      'word': this.currentWord
    }).subscribe((data: any) => {
      if (data.valid) {
        if (this.currentWord.length >= 8) {
          this.score += 11;
        } else if (this.currentWord.length === 7) {
          this.score += 5;
        } else if (this.currentWord.length === 6) {
          this.score += 3;
        } else if (this.currentWord.length === 5) {
          this.score += 2;
        } else if (this.currentWord.length <= 4) {
          this.score += 1;
        }
        this.correctWords.push(this.currentWord);
      } else {
        this.incorrectWords.push(this.currentWord);
      }
      this.resetBoard();
    }, (err) => {
      console.log('ERROR', err);
    });
  }


}





