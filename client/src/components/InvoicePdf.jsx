import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../assets/logo.png';
import signature from '../assets/signature.png'; // Import the signature image

const generatePDF = (data) => {
    console.log(data);
    
  const doc = new jsPDF();

  // Add Gradient Rectangle
  const gradientHeight = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = pageWidth * 0.07;
  const topMargin = pageHeight * 0.030; // 10% margin from the top
  const gradientWidth = pageWidth - 2 * margin;
  for (let i = 0; i <= gradientWidth; i++) {
    const colorValue = Math.floor((i / gradientWidth) * 60); // Adjust color range for black
    doc.setFillColor(colorValue, colorValue, colorValue);
    doc.rect(margin + i, topMargin, 1, gradientHeight, 'F');
  }

  // Add Logo
  const imgWidth = 50;
  const xOffset = 15;
  doc.addImage(logo, "PNG", 15, 12, imgWidth, 35); // Use imported logo

  // Add Header Information
  doc.setTextColor(255,255,255);
  doc.setFontSize(27);
    doc.setFont("Playfair Display", "bold");
  doc.text("The Adorners", 100, 23);
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text("E-522 Model Colony, Walton Road Lahore Cantt, Lahore", 85, 29);
  doc.text("Phone: 0301-4860300  |  Email: theadorners123@gmail.com", 80, 34);
  doc.text("www.theadorners.pk  |  NTN # 7244215-7", 90, 39);


  // Invoice Details
    doc.setFont("Playfair Display", "italic");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text(`Invoice # ${data.index} `, xOffset, 60);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${data.date}`, xOffset, 67);

  // Invoice To Section
    doc.setFont("Playfair Display", "italic");
    doc.setFontSize(20);
  doc.text("Invoice to", xOffset, 83);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
//   doc.text(`Name: ${data.customerName}`, xOffset, 80);
  doc.text(`Company | ${data.company}`, xOffset, 88);
  doc.text(`Phone | ${data.phone_no}`, xOffset, 93);
  doc.text(`NTN |`, xOffset, 98);

  // Event Details
    doc.setFont("Playfair Display", "italic");
    doc.setFontSize(20);
  doc.text("Event Detail", 120, 65);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  const eventDetailLines = doc.splitTextToSize(data.details, 70); // Set fixed width and wrap text
  doc.text(eventDetailLines, 120, 70);

  // Table: Items
  const tableColumn = ["Item Description", "Quantity", "Unit Price", "Amount"];
  const tableRows = data?.invoice?.items.map((item) => [
    item.itemsName,
    item.quantity,
    item.pricePerItem.toFixed(2)+"/-",
    (item.quantity * item.pricePerItem).toFixed(2)+ "/-",
  ]);

  doc.autoTable({
    startY: 110,
    head: [tableColumn],
    body: tableRows,
    styles: { halign: "center", fontSize: 10 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [0, 0, 0] },
  });

  // Add Total Section
  const finalY = doc.lastAutoTable.finalY || 100;
  doc.setFont("Helvetica", "bold");
  doc.text("Subtotal:", 140, finalY + 10);
  doc.text(`${data?.invoice?.total.toFixed(2)}/-`, 185, finalY + 10, { align: "right" });
  doc.setFillColor(230, 230, 230);
  doc.rect(135, finalY + 15, 60, 8, "F");
  doc.text("Tax Rate:", 140, finalY + 20);
  doc.text(`${data?.taxRate || 0}%`, 185, finalY + 20, { align: "right" });

  doc.text("Adv. Amount:", 140, finalY + 30);
  doc.text(`${data?.advAmount || 0.00}/-`, 185, finalY + 30, { align: "right" });

  doc.rect(135, finalY + 40, 60, 10, "F");
  doc.setFillColor(0, 0, 0);
  doc.setTextColor(255, 255, 255);
  doc.text("Total Cost:", 143, finalY + 47);
  doc.text(`${data?.invoice?.total.toFixed(2)}/-`, 185, finalY + 47, { align: "right" });

  // Add Terms and Conditions
  doc.setTextColor(0, 0, 0);
  doc.setFont("Helvetica", "normal");
  doc.text("Terms & Condition:", xOffset, finalY + 60);
  doc.text("No", xOffset, finalY + 65);

  // Add Signature
  doc.addImage(signature, "PNG", 16, finalY + 75, 50, 22); // Use imported signature
  doc.text("Thank you for your Business!", 15, finalY + 105);


  // Save PDF
  doc.save(`Invoice_${data.index}.pdf`);
};

// // Example Usage
// const App = () => {
//   const invoiceData = {
//     logo: logo,
//     date: "12/13/2024",
//     customerName: "Imran Akhtar",
//     customerCompany: "Faisal Bank Industrial Area Kot Lakhpat",
//     customerPhone: "03334314955",
//     eventDetail: "Industrial Area Kot Lakhpat - Branch Opening",
//     items: [
//       { description: "Balloons Décor", quantity: "500", unitPrice: "10", amount: "5000.00 Rs" },
//       { description: "Balloons Décor", quantity: "500", unitPrice: "10", amount: "5000.00 Rs" },
//       { description: "Balloons Décor", quantity: "500", unitPrice: "10", amount: "5000.00 Rs" },
//     ],
//     subtotal: "5000.00 Rs",
//     taxRate: "0%",
//     advAmount: "0 Rs",
//     totalCost: "5000.00 Rs",
//     termsAndConditions: "Non",
//     // signature: signature, // Use imported signature
//   };

//   return (
//     <button className="mt-20 ml-30 bg-black" onClick={() => generatePDF(invoiceData)}>Generate Invoice</button>
//   );
// };

// export default App;

export default generatePDF;
