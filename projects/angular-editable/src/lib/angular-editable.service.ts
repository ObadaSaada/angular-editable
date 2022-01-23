import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class AngularEditableService {
savedSelection!: Range | null;
selectedText!: string;
constructor(@Inject(DOCUMENT) private doc: any) { }

exec(type: string, command: string){
  switch (type) {
    case 'fontFamily':
      this.doc.execCommand('fontName',false,command);
      break;
    case 'headings':
        this.doc.execCommand('formatBlock',false,command);
        break;
    case 'textFormat':
      this.doc.execCommand(command,false);
      break;
    case 'createlink':
      this.createLink(command);
      break
    case 'direction':
      this.Direction(command)
    break;
    default: this.doc.execCommand(type, false, command); break;
  }
}
createLink(url: string) {
  let text = this.selectedText;
  let urlPrefix = '';
  if(!url.startsWith('http'))
  {
    urlPrefix = 'http://'
  }
  if(this.selectedText.length < 1){
    text = url;
  }
  const newUrl = '<a href="' + urlPrefix + url + '" target="_blank">' + text + '</a>';
  this.insertHtml(newUrl);
}
insertHtml(html: string): void {
  this.doc.execCommand('insertHTML', false, html);
}
Direction(direction: string)
{
  let SelectedNodes = this.getSelectedNodes().filter(n => n.nodeName.toLocaleLowerCase() === 'p');
  if(SelectedNodes.length > 0)
  {
    SelectedNodes.forEach(p  => (p as HTMLParagraphElement).setAttribute('dir',direction))
  }
  else {
    this.savedSelection?.commonAncestorContainer.parentElement?.setAttribute('dir', direction);
  }
}

nextNode(node: Node) {
  if (node.hasChildNodes()) {
      return node.firstChild;
  } else {
      while (node && !node.nextSibling) {
          node = node?.parentNode!;
      }
      if (!node) {
          return null;
      }
      return node.nextSibling;
  }
}

getRangeSelectedNodes(range: Range) {
  var node = range.startContainer;
  var endNode = range.endContainer;

  // Special case for a range that is contained within a single node
  if (node == endNode) {
      return [node];
  }

  // Iterate nodes until we hit the end container
  var rangeNodes = [];
  while (node && node != endNode) {
      rangeNodes.push( node = this.nextNode(node)! );
  }

  // Add partially selected nodes at the start of the range
  node = range.startContainer;
  while (node && node != range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node?.parentNode!;
  }

  return rangeNodes;
}

getSelectedNodes() {
  if (window.getSelection) {
      var sel = window.getSelection();
      if (!sel?.isCollapsed) {
          return this.getRangeSelectedNodes(sel!.getRangeAt(0));
      }
  }
  return [];
}

public saveSelection = (): void => {
  if (this.doc.getSelection) {
    const sel = this.doc.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      this.savedSelection = sel.getRangeAt(0);
      this.selectedText = sel.toString();
    }
  } else if (this.doc.getSelection && this.doc.createRange) {
    this.savedSelection = document.createRange();
  } else {
    this.savedSelection = null;
  }
}
restoreSelection(): boolean {
  if (this.savedSelection) {
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.savedSelection);
      return true;
    } else if (this.doc.getSelection /*&& this.savedSelection.select*/) {
      // this.savedSelection.select();
      return true;
    }
  } else {
    return false;
  }
  return false
}

}
