import { Component, Input, Injectable, NgModule, ViewContainerRef, ElementRef } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';


export interface ContentDescriptor {
    placeholder: string;
    elementRef: ElementRef;
}

@Injectable()
export class ContentService {
    private contentInit$ = new Subject<ContentDescriptor>();

    contentInit(): Observable<ContentDescriptor> {
        return this.contentInit$.asObservable();
    }

    registerContent(content: ContentDescriptor) {
        this.contentInit$.next(content);
    }
}

@Component({
    selector: 'my-content',
    template: '<ng-content></ng-content>'
})
export class ContentComponent {
    @Input() placeholder: string;

    constructor(
        private elementRef: ElementRef,
        private contentService: ContentService
    ) { }

    ngOnInit() {
        this.contentService.registerContent({
            placeholder: this.placeholder,
            elementRef: this.elementRef
        });
    }
}

@Component({
    selector: 'my-placeholder',
    template: '<ng-content></ng-content>'
})
export class PlaceholderComponent {
    @Input() name: string;

    private subscription: Subscription;

    constructor(
        private containerRef: ViewContainerRef,
        private contentService: ContentService
    ) {
        this.subscription = contentService.contentInit().subscribe((content: ContentDescriptor) => {
            if (content.placeholder == this.name) {
                this.containerRef.clear();
                this.containerRef.element.nativeElement.appendChild(content.elementRef.nativeElement);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

@NgModule({
    declarations: [PlaceholderComponent, ContentComponent],
    exports: [PlaceholderComponent, ContentComponent],
    providers: [ContentService]
})
export class MasterModule {

}