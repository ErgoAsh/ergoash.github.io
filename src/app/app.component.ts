import { Component, HostListener } from '@angular/core';
import { ScrollToEvent } from '@nicky-lenaers/ngx-scroll-to/lib/scroll-to-event.interface';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

	constructor(private _scrollService: ScrollToService) { }

	@HostListener('mousewheel', ['$event'])
	onWheelScroll(event: WheelEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (event.deltaY > 0) {
			this._scrollService.scrollTo({target: 'fourth-page'}); //TODO getNextPage
		} else if (event.deltaY < 0) {
			this._scrollService.scrollTo({target: 'third-page'}); //TODO getPreviousPage
		}
	}
}
