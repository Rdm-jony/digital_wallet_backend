"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = generateInvoice;
const pdfkit_1 = __importDefault(require("pdfkit"));
function generateInvoice(invoice) {
    return __awaiter(this, void 0, void 0, function* () {
        new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // Header
            doc
                .fontSize(20)
                .text("INVOICE", { align: "right" })
                .moveDown();
            // Company Info
            doc
                .fontSize(10)
                .text("Tour Management", 50, 50)
                .text("123 Road St.", 50, 65)
                .text("City, Country", 50, 80)
                .text("Email: support@phtour.com", 50, 95)
                .moveDown();
            // Customer Info
            doc
                .text(`Invoice To: ${invoice.customerName}`, 50, 140)
                .text(`Email: ${invoice.customerEmail}`, 50, 155)
                .moveDown();
            // Invoice Details
            doc
                .text(`Invoice Number: ${invoice.transactionId}`, { align: "right" })
                .text(`Date: ${invoice.date}`, { align: "right" })
                .moveDown();
            // Table headers
            const tableTop = 200;
            const itemX = 50;
            const priceX = 400;
            doc
                .fontSize(12)
                .text("Item", itemX, tableTop)
                .text("Price", priceX, tableTop);
            const position = tableTop + 25;
            // Total
            doc
                .fontSize(12)
                .text("Total:", itemX, position + 10)
                .text(`$${invoice.total.toFixed(2)}`, priceX, position + 10)
                .moveDown();
            // Footer
            doc
                .fontSize(10)
                .text("Thank you for your business!", 50, position + 60, {
                align: "center",
            });
            doc.end();
        });
    });
}
