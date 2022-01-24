import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'colors-editable-select',
  templateUrl: './colors-editable-select.component.html',
  styleUrls: ['../../../scss/color-editable-select.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ColorsEditableSelectComponent implements OnInit {
  selectedItem: any;
  @Input() title!: string;
  @Input() items: {name: string, tag: string}[]= [];
  @Output() changeColors = new EventEmitter<{selectedItem: any}>();

  constructor(private config: NgSelectConfig) {
    this.config.notFoundText = 'None';
  }
  changeEventEmitter(){
    this.changeColors.emit({selectedItem: this.selectedItem});
  }
  reset() {
    this.selectedItem = null;
  }
  ngOnInit(): void {
    this.items = [...this.items]
  }
}
