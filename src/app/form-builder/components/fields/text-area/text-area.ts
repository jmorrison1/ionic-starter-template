import { Component, Input } from '@angular/core';
import { FormField } from '../../../form-builder';

@Component({
  selector: 'text-area',
  templateUrl: 'text-area.html'
})
export class TextAreaComponent {

    @Input() field: FormField;

}
