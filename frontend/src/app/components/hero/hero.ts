import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
   openVideo() {
    const modal = document.getElementById("videoModal");
    if (modal) {
        modal.classList.remove("hidden");
    }
}

//close the video modal
  closeVideo() {
    const modal = document.getElementById("videoModal");
    if (modal) {
        modal.classList.add("hidden");

        const iframe = modal.querySelector("iframe") as HTMLIFrameElement | null;
        if (iframe) {
            iframe.src = iframe.src;
        }
    }
}
//close on click anywhere in screen
 outsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).id === "videoModal") {
        this.closeVideo();
    }
}
  
}
