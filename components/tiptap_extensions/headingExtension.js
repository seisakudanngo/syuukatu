import { Extension } from "@tiptap/core";
//https://tiptap.dev/guide/custom-extensions#global-attributes globalattributesを参考にした
export const HeaderId = Extension.create({
  addGlobalAttributes() {
    return [{
      types: [
        'heading',
      ],
      attributes: {
        id: {
          //idが無い時は弾く
          default: null,
          // parseHTML: element => element.style.textAlign || 'left',
          parseHTML: element => element.getAttribute('id'),
          renderHTML: attributes => {
            return {
              id: attributes.id,
            }
          // style: `text-align: ${attributes.textAlign}`,
          // console.log(element)
          }
        }
      }
    }]
  }
})