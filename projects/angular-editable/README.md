# Angular Editable

Angular wyiswyg Rich Text Editor

## Demo 

[click here](https://obadasaada.github.io/angular-editable/) to go to demo page


## Supported Versions

Angular 13.*

## Installation

`npm i angular-editable`

## Usage

* Import AngularEditableModule into your app module

* Add AngularEditableModule to imports

``` ts
import { AngularEditableModule } from 'angular-editable'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularEditableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

* add `<lib-angular-editable></lib-angular-editable>` to your html component

## Style

* style files included to the project root inside scss folder
