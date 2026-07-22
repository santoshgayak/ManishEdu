import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loader',
  imports: [RouterLink],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {}
