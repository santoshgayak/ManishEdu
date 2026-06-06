import { Component } from '@angular/core';

@Component({
  selector: 'app-classes',
  imports: [],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes {

  ngAfterViewInit() {
  const section = document.querySelector('.classes-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.3
  });

  if (section) {
    observer.observe(section);
  }
}
}
