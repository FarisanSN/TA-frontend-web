import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
} from "pdf-lib";
import signer from "node-signpdf";
import { Buffer } from "buffer";
import PDFArrayCustom from "./PDFArrayCustom.js";
global.Buffer = Buffer;

export default class SignPDF {
  /**
   * @param {string} pdfFile
   * @param {string} certFile
   */
  constructor(pdfFile, certFile, pass) {
    this.pdfDoc = pdfFile;
    this.certificate = Buffer.from(certFile);
    this.passphrase = pass;
  }

  /**
   * @return Promise<Buffer>
   */
  async signPDF(reason) {
    let newPDF = await this.#addPlaceholder(reason);
    newPDF = signer.sign(newPDF, this.certificate, {passphrase: this.passphrase});

    return newPDF;
  }

  /**
   * @see https://github.com/Hopding/pdf-lib/issues/112#issuecomment-569085380
   * @return Promise<Buffer>
   */
  async #addPlaceholder(reason) {
    const loadedPdf = await PDFDocument.load(this.pdfDoc);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';
    const SIGNATURE_LENGTH = 8192;
    const pages = loadedPdf.getPages();

    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = loadedPdf.context.obj({
      Type: 'Sig',
      Filter: 'Adobe.PPKLite',
      SubFilter: 'adbe.pkcs7.detached',
      ByteRange,
      Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of(reason),
      M: PDFString.fromDate(new Date()),
    });

    const signatureDictRef = loadedPdf.context.register(signatureDict);

    const widgetDict = loadedPdf.context.obj({
      Type: 'Annot',
      Subtype: 'Widget',
      FT: 'Sig',
      Rect: [0, 0, 0, 0], // Signature rect size
      V: signatureDictRef,
      T: PDFString.of('test signature'),
      F: 4,
      P: pages[0].ref,
    });

    const widgetDictRef = loadedPdf.context.register(widgetDict);

    // Add signature widget to the first page
    pages[0].node.set(PDFName.of('Annots'), loadedPdf.context.obj([widgetDictRef]));

    loadedPdf.catalog.set(
      PDFName.of('AcroForm'),
      loadedPdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );

    // Allows signatures on newer PDFs
    // @see https://github.com/Hopding/pdf-lib/issues/541
    const pdfBytes = await loadedPdf.save({ useObjectStreams: false });

    return SignPDF.unit8ToBuffer(pdfBytes);
  }

  /**
   * @param {Uint8Array} unit8
   */
  static unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);

    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
