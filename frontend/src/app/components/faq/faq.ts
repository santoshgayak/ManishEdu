import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {


  toggleDetails(element: any) {
    const answer = element.nextElementSibling;

    answer.classList.toggle("hidden");

    const arrow = element.querySelector("img");

    if (answer.classList.contains("hidden")) {
        arrow.style.transform = "rotate(0deg)";
    } else {
        arrow.style.transform = "rotate(180deg)";
    }
}
}
