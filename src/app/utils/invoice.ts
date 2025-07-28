import PDFDocument from 'pdfkit';

interface IInvoice {
    customerName: string,
    customerEmail: string,
    transactionId: string
    date: Date,
    total: number
}
export async function generateInvoice(invoice: IInvoice) {
    new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 })
        const buffer: Uint8Array[] = [];

        doc.on("data", (chunk) => buffer.push(chunk))
        doc.on("end", () => resolve(Buffer.concat(buffer)))
        doc.on("error", (err) => reject(err))

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
    })
}
