import { Component, Input } from '@angular/core';
import { FormField } from '../../../form-builder';

@Component({
    selector: 'textbox',
    templateUrl: 'textbox.html'
})
export class TextboxComponent {

    @Input() field: FormField;
}
