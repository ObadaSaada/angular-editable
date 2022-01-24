import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'font-size-editable-select',
  templateUrl: './font-size-editable-select.component.html',
  styleUrls: ['../../../scss/editable-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FontSizeEditableSelectComponent implements OnInit {
  selectedItem: any;
  @Input() title!: string;
  @Input() items: {name: string, tag: string}[]= [];
  @Output() changefontSize = new EventEmitter<{selectedItem: any}>();

  constructor(private config: NgSelectConfig) {
    this.config.notFoundText = 'None';
  }
  changeEventEmitter(){
    this.changefontSize.emit({selectedItem: this.selectedItem})
  }
  reset() {
    this.selectedItem = null;
  }
  ngOnInit(): void {
    this.items = [...this.items]
  }


}
