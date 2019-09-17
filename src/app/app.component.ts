import { Component, HostListener, OnInit } from '@angular/core';
import { ScrollToEvent } from '@nicky-lenaers/ngx-scroll-to/lib/scroll-to-event.interface';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Store, select } from '@ngrx/store';
import { AppState, getContentNavigation } from './app.state';
import { Observable } from 'rxjs';
import { ShowNextVerticalPageAction, ShowPreviousVerticalPageAction, ContentNavigationState } from './content-navigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	private contentNavigation$: Observable<ContentNavigationState>;

	constructor(private scrollService: ScrollToService, private store: Store<AppState>) { }

	ngOnInit(): void {
		this.store
			.pipe(select(getContentNavigation))
			.subscribe((nav) => this.scrollService
				.scrollTo({ target: this.getPageNameByNumber(nav.currentVerticalPosition) }));
	}

	@HostListener('mousewheel', ['$event'])
	onWheelScroll(event: WheelEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (event.deltaY > 0) {
			this.store.dispatch(new ShowNextVerticalPageAction());
		} else if (event.deltaY < 0) {
			this.store.dispatch(new ShowPreviousVerticalPageAction());
		}

	}

	getPageNameByNumber(page: number): string {
		switch (page) {
			case 0: return 'main-page';
			case 1: return 'first-page';
			case 2: return 'second-page';
			case 3: return 'third-page';
			case 4: return 'fourth-page';
			default: return 'main-page';
		}
	}
}
