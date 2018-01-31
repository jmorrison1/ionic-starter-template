import { FormComponent } from './components/form/form';
import { TextAreaComponent } from './components/fields/text-area/text-area';
import { TextboxComponent } from './components/fields/textbox/textbox';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';


@NgModule({
    imports: [
        IonicModule
    ],
    declarations: [
        FormComponent,
        TextboxComponent,
        TextAreaComponent

    ], 
    exports: [
        FormComponent
    ]
})
export class FormBuilderModule {

}