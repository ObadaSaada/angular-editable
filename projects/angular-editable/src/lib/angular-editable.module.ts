import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditableComponent } from './angular-editable.component';
import { ColorsEditableSelectComponent } from './editable-select/colors-editable-select.component';
import { FontFamilyEditableSelectComponent } from './editable-select/font-family-editable-select.component';
import { FontSizeEditableSelectComponent } from './editable-select/font-size-editable-select.component';
import { HeadingsEditableSelectComponent} from './editable-select/headings-editable-select.component';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { EditableModalComponent } from './editable-modal/editable-modal.component';

@NgModule({
  declarations: [
    AngularEditableComponent,
    HeadingsEditableSelectComponent,
    FontSizeEditableSelectComponent,
    FontFamilyEditableSelectComponent,
    ColorsEditableSelectComponent,
    EditableModalComponent
  ],
  imports: [
    NgSelectModule, FontAwesomeModule, FormsModule, BrowserModule
  ],
  exports: [
    AngularEditableComponent
  ]
})
export class AngularEditableModule {


  constructor(faConfig: FaConfig, library: FaIconLibrary) {
  faConfig.defaultPrefix = 'fas';
  library.addIconPacks(fas);
}}
