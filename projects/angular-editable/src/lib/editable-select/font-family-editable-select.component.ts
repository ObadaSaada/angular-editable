import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'font-family-editable-select',
  templateUrl: './font-family-editable-select.component.html',
  styleUrls: ['../../../scss/editable-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FontFamilyEditableSelectComponent implements OnInit {
  selectedItem: any;
  @Input() title!: string;
  @Input() items: {name: string, tag: string}[]= [];
  @Output() changeFontFamily = new EventEmitter<{selectedItem: any}>();

  constructor(private config: NgSelectConfig) {
    this.config.notFoundText = 'None';
  }
  changeEventEmitter(){
    this.changeFontFamily.emit({selectedItem: this.selectedItem})
  }
  reset() {
    this.selectedItem = null;
  }
  ngOnInit(): void {
    this.items = [...this.items]
  }


}
