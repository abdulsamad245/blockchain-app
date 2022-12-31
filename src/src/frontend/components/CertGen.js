import { useEffect} from "react"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import CryptoJS from "crypto-js"
import {sha1,sha256,sha384,sha512} from 'crypto-hash';
import { saveAs } from 'file-saver';

const CertGen = ({name, description, nft, document_id, location, registrantAddress}) => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  'Roboto': {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-Italic.ttf'
  }
};


/**
 * @desc pdf content
 * @param {Array} sections
 * @param {Number} pageWidth Width in inches
 * @param {Number} pageHeight Width in inches
 * @return title, pageSize, content, pageMargin
 * */
 const pdfContent = (sections, pageWidth, pageHeight) => {
    const pageSize = {
      width: pageWidth * 72,
      height: pageHeight * 72
    };
    const imageWidth = 1.0;
    const imagePercentage = 70;
    const pageMargins = [40, 60, 40, 60];
    let content = [];
    sections.forEach((section, si) => {
        content.push({
          text: section.heading || `Section ${si + 1}`,
          fontSize: 20,
          alignment: 'center',
          margin: [15, 15],
          // If it is the first section, do not insert a pageBreak.
          pageBreak: si === 0 ? null : 'before'
        });

    });
    return {
      pageSize,
      content,
      pageMargins
    }
  };

  /**
 * @desc Print pdf for the puzzles
 * @param {Array} sections
 * @param {Number} pageWidth Width in inches
 * @param {Number} pageHeight Width in inches
 * */
const printPdf = (sections, pageWidth, pageHeight) => {
    const pageSize = {
        width: 900,
        height: 900
      };
      const imageWidth = 1.0;
      const imagePercentage = 70;
      const pageMargins = [40, 60, 40, 60];
      let content = [{
        text: `NFT CERTIFICATE OF OWNERSHIP\n\nITEM'S NAME: ${name}\nITEM'S DESCRIPTION: ${description}\nNFT's ADDRESS: ${nft}\nITEM'S LOCATION: ${location}\n REGISTRANT'S ADDRESS: ${registrantAddress}\n\n DOCUMENT'S ID: ${document_id}`,
        fontSize: 20,
        alignment: 'left',
        margin: [15, 15],
        pageBreak: null
      }

      ];
    const docDefinition = {
      pageSize,
      content: content,
      pageMargins,
      footer: function (currentPage, pageCount) {
        return {
          text: "Page " + currentPage.toString() + ' of ' + pageCount,
          alignment: currentPage % 2 === 0 ? 'left' : 'right',
          style: 'normalText',
          margin: [10, 10, 10, 10]
        };
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

pdfDocGenerator.getBlob((blob) => {
    
    var reader = new FileReader();
        
        reader.readAsArrayBuffer(blob);
        
            reader.onload = function () {
                
                var file_result = this.result; 
                var file_wordArr = CryptoJS.lib.WordArray.create(file_result);
                var sha256_hash = CryptoJS.SHA256(file_wordArr); 
                var Hash = sha256_hash.toString(); //output result
                console.log({Hash});
                saveAs(blob); 

            };
    });

}


  printPdf();

}

export default CertGen;

