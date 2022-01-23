export interface IAngularEditableConfig {
  headings: { name: string, tag: string}[],
  fontSizes: { name: string, tag: string}[],
  fontFamilies: { name: string, tag: string}[]
}

export const AngularEditableConfig : IAngularEditableConfig = {
  headings: [
    {'name': 'Heading 1','tag': 'h1'},
    {'name': 'Heading 2','tag': 'h2'},
    {'name': 'Heading 3','tag': 'h3'},
    {'name': 'Heading 4','tag': 'h4'},
    {'name': 'Heading 5','tag': 'h5'},
    {'name': 'Heading 6','tag': 'h6'},
    {'name': 'Paragraph','tag': 'p'},
    {'name': 'Preformatted','tag': 'pre'}
  ],
  fontSizes:[
    {'name': 'x-small','tag': '1'},
    {'name': 'small','tag': '2'},
    {'name': 'medium','tag': '3'},
    {'name': 'large','tag': '4'},
    {'name': 'x-large','tag': '5'},
    {'name': 'xx-large','tag': '6'},
    {'name': 'xxx-large','tag': '7'},
  ],
  fontFamilies: [
    {'name': 'Arial','tag': 'arial'},
    {'name': 'Georgia','tag': 'georgia'},
    {'name': 'Helvetica','tag': 'helvetica'},
    {'name': 'Impact','tag': 'impact'},
    {'name': 'Symbol','tag': 'symbol'},
    {'name': 'Tahoma','tag': 'tahoma'},
    {'name': 'Times New Roman','tag': '"times new roman"'},
    {'name': 'Verdana','tag': '"verdana'},
  ]
}

