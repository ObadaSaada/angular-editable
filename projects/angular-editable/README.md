# Angular Editable

Angular wysiwyg Rich Text Editor

## Demo

[click here](https://obadasaada.github.io/angular-editable/) to go to demo page

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

* add `<angular-editable></angular-editable>` to your html component

## Events

| Event       | Description                                   |
| ----------- | --------------------------------------------- |
| focus       | editor focus in                               |
| blur        | editor focus out                              |
| change      | editor changing event will return html result |

## Configuration

* to change angular-editable configuration import `AngularEditableConfig` to your component
* apply changes inside `constructor()`
* Example:

``` ts
import { AngularEditableConfig } from 'angular-editable'

export class AppComponent {
  constructor(){
    AngularEditableConfig.style = {primary: '#D9D0DE', secondary: '#F52F57', toolbarColor: '#BC8DA0', light: '#D9D0DE', dark1: '#0C1713', dark2: '#A04668', dark3: '#AB4967'}
    AngularEditableConfig.translate = {/* Your translation */}
  }
}
```

## 1.1.0 Changes

* Creating Tables
* Allow custom Buttons
* Allow custom style
* Allow Translation
* selector name changed
* adding change event
* scss enhancements
