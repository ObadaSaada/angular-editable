# Angular Editable

Angular wyiswyg Rich Text Editor

## Supported Versions

Angular 13.*

## Installation

`npm i angular-editable`

## Usage

* Import AngularEditableModule into your app module

* Add AngularEditableModule to declarations

`import { AngularEditableModule } from 'angular-editable'

@NgModule({
  declarations: [
    AppComponent,
    AngularEditableModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
`

* add `<lib-angular-editable></lib-angular-editable>` to your html component

## Style

* style files included to the project root inside scss folder
