import { Component, OnInit, Input } from '@angular/core';
import { ErrorModel } from '../ViewModels/errormodel';


@Component({
    selector: 'error-page',
    templateUrl: './errorpage.component.html',
    styleUrls: ['./errorpage.component.css']
})
export class ErrorPageComponent implements OnInit {
    @Input() errorModel: ErrorModel;

    constructor() { }

    ngOnInit() {
    }
    refresh(): void {
        window.location.reload();
    }
}
