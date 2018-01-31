import { Component, Input } from '@angular/core';
import { Form } from '../../form-builder';

@Component({
  selector: 'form',
  templateUrl: 'form.html'
})
export class FormComponent {

    @Input() form: Form;

    constructor() {

    }
}
