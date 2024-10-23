import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {

  rightCounter: number = 0;
  wrongCounter: number = 0;

  reset(): void {
    this.rightCounter = 0;
    this.wrongCounter = 0;
  }

  incrementRight(): void {
    this.rightCounter++;
  }

  incrementWrong(): void {
    this.wrongCounter++;
  }
}
