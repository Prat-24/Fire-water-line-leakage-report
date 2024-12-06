document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("saveAsPdf").addEventListener("click",  async function(event) {
        event.preventDefault(); // Prevent form submission

        const formData = {
           // JavaScript to capture form data as an objectonst formData = {
    DateOfLeak: document.querySelector('input[name="Date"]').value,
    TimeOfLeak: document.querySelector('input[name="Time"]').value,
    InformationGivenBy: document.querySelector('select[name="information"]').value,
    NameOfPerson: document.querySelector('input[name="name"]').value,
    LineSize: document.querySelector('input[name="linesize"]').value,
    LeakLocation: document.querySelector('input[name="location"]').value,
    NotificationNo: document.querySelector('input[name="notification"]').value,
    RouteTo: document.querySelector('input[name="routeto"]').value,
    TotalHydt: document.querySelector('input[name="total_hydt"]').value,
    TotalMoni: document.querySelector('input[name="total_moni"]').value,
    WSSLines: document.querySelector('input[name="wss_lines"]').value,
    FoamLines: document.querySelector('input[name="foam_lines"]').value,
    UnitArea: document.querySelector('input[name="Unit"]').value,
    Department: document.querySelector('input[name="Department"]').value,
    ActionByOperation: document.querySelector('select[name="operation"]').value,
    ActionByFireSafety: document.querySelector('select[name="fire"]').value,
    ImmediateActionFireSafety: document.querySelector('input[name="safety"]').value,
    AffectedEquipmentsTagged: document.querySelector('select[name="equipments"]').value,
    ActionByMaintenance: document.querySelector('input[name="maint"]').value,
    TotalBVClosed: document.querySelector('input[name="total"]').value,
    InformedTo: document.querySelector('select[name="informed"]').value,
    PersonName: document.querySelector('input[name="Person"]').value,

    Description: document.querySelector('textarea[name="description"]').value,
    // Images (captured as Data URLs)
    LeakLocationPic1: document.querySelector('input[name="profile"]').files[0],
    //LeakLocationPic2: document.querySelector('input[name="profilepic"]').files[0],
    SubmittedBy: document.querySelector('input[name="submitted"]').value,
    Designation: document.querySelector('input[name="designation"]').value
};

 // Function to convert an image file to a Data URL
 function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

 // For testing purposes, log formData to verify all values are correctly captured
         console.log("Form Data:", formData);

         const { jsPDF } = window.jspdf;
         const pdf = new jsPDF();
         
         const margin = 5;
         const pageWidth = pdf.internal.pageSize.getWidth();
         const pageHeight = pdf.internal.pageSize.getHeight();
         pdf.setDrawColor(0, 0, 0);
         pdf.setLineWidth(0.5);
         pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
 
      // Function to add header
      function addHeader() {
        const titleY = 30;
        const headingY = 20;
        const subtitleY = 35; // Adjusted position for subtitle
        const gap = 10; // Adjust this value for desired gap
  
        
        // Draw box for the title
        pdf.setFillColor(173, 216, 230);
        pdf.rect(5, headingY - 10, 20, 30, 'S'); // Valid parameters: x, y, width, height, style
        pdf.setFontSize(8);
        // Add image to PDF
        const imageData = 'data:image/png;base64,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'; // Truncated for brevity
        pdf.addImage(imageData, 'PNG', 5, 10.3, 20, 29.6); // Adjust x, y, width, height
  
        //pdf.text('HP', 20, headingY + 5, { align: 'center' }); // Placeholder logo text
        
           // Draw main heading box
           pdf.setFillColor(255, 255, 255); // White color
      pdf.rect(25, headingY - 10, 130, 25, 'FD'); // Ensure all arguments are valid
      pdf.setFontSize(12);
      pdf.text('Hindustan Petroleum Corporation Limited', 95, headingY, { align: 'center' });
      pdf.text('Mumbai Refinery', 95, headingY + 7, { align: 'center' });
  
         // Draw subtitle box
      pdf.setFillColor(255,255,255); // Light blue color
      pdf.rect(25, subtitleY - 4, 130, 8.8, 'FD'); // Subtitle box
      pdf.setFontSize(12);
      pdf.text('Fire Water Line Leakage Report', 95, subtitleY + 2, { align: 'center' });
      
  
      // Set fill color to white
  pdf.setFillColor(255, 255, 255); // White color
  
  // Draw rectangular box on the right side
  const boxWidth = 52;  // Width of the rectangular box
  const boxHeight = 30; // Height of the rectangular box
  const boxX = 153;     // Position from the left edge (right side of the page)
  const boxY = 9.8; // Position vertically, adjusting with titleY
  
  // Create the rectangular box on the right side of the page
  pdf.rect(boxX, boxY, boxWidth, boxHeight, 'FD'); // 'FD' means fill and draw
  
  // Draw metadata text inside the box (aligned to the right)
  pdf.setFontSize(8);
  
  // Position the text within the square box
  const textX = boxX + 1 ; // X position for text, 10 units from the left of the box
  const textY = boxY + 3.5; // Starting Y position for text inside the box
  
  pdf.text('Issue No: 1', textX, textY);
  pdf.text('Issue Date: 6/11/2024', textX, textY + 5);
  pdf.text('Rev No: 0', textX, textY + 10);
  pdf.text('Rev Date:', textX, textY + 15);
  pdf.text('Doc No: HPCL MR/FRM/F&S/08200-10', textX, textY + 20);
  
  // Adjust position for next elements if needed
  // Example of increasing position for further content
  
        // Return updated position for fields
        return subtitleY + 4 + gap; // Move down for the next row with gap
    }
  

 
 // Function to add fields
 function fieldPair(label1, value1, label2, value2, positionY) {
     const label1Width = 49;
     const value1Width = 40;
     const label2Width = 46;
     const value2Width = 47;
 
 // Define a left margin
 const leftMargin = 14;
 
 // Calculate the positions for the label and value
 const xLabelCenter = leftMargin; // Start from the left margin
 const xValueCenter = xLabelCenter + label1Width; // Adjust to place value box directly after label box
 
 // Draw joined label and value boxes
 pdf.setDrawColor(0); // Set draw color for boxes
 pdf.setFillColor(255, 255, 255); // Set fill color for boxes
 pdf.rect(xLabelCenter - 5, positionY - 8, label1Width, 10); // Label box
 pdf.rect(xValueCenter - 5, positionY - 8, value1Width, 10); // Value box
 
// Define label text position with vertical adjustment for centering

const textVerticalOffset = 2; // Adjust this based on font style and size
// Define label text position with vertical adjustment for centering
const label1FontSize = 11; // Increased font size for label1


// Set font and size
pdf.setFont('Arial', 'B');
pdf.setFontSize(label1FontSize);


// Draw label text, with center alignment adjustment for vertical positioning
pdf.text(label1, xLabelCenter - 4, positionY - textVerticalOffset);

// Add value text
pdf.setFont('Arial', '', 12);
pdf.text(value1, xValueCenter , positionY - textVerticalOffset); // Add a small offset for value text

 // Draw second label and value if provided
 if (label2) {
     const xLabel2Center = 103; // Adjust to place second label box directly after first value box
     const xValue2Center = 149; // Adjust for second label box
 
     // Draw joined second label and value boxes
     pdf.rect(xLabel2Center - 5, positionY - 8, label2Width, 10); // Second label box
     pdf.rect(xValue2Center - 5, positionY - 8, value2Width, 10); // Second value box
 
    
     
     const textVerticalOffset = 2; // Adjust this based on font style and size
     
     // Define label text position with vertical adjustment for centering
const label2FontSize = 11; // Increased font size for label1


// Set font and size
pdf.setFont('Arial', 'B');
pdf.setFontSize(label2FontSize);
     
     // Draw label text, with center alignment adjustment for vertical positioning
     pdf.text(label2, xLabel2Center-4, positionY - textVerticalOffset);
     
         // Add second value text
         pdf.setFont('Arial', '', 12);
         pdf.text(value2, xValue2Center , positionY - textVerticalOffset); // Add a small offset for value text
     
     
 }
 
 return positionY + 12; // Move down for the next row and return updated positionY
 }


        
  // Add data to the PDF
  let positionY = addHeader(); // Add header for the page and get the new position
  positionY += 20; // Additional gap if needed


  // Create an array from the form data to loop through
  const data = [formData]; // Wrap formData in an array for processing
  for (const row of data) 
  {
    let positionY = addHeader(); // Add header for the page and get the new position
                    positionY = 30; // Additional gap if needed
                    
                    // Add the text outside the box, above it
                    const xText = 10;
                    
                
                    

                    // Use the nullish coalescing operator (??) to provide fallback values
positionY = 60; // Additional gap if needed

// Use the nullish coalescing operator (??) to provide fallback values

positionY = fieldPair('Date of Line Leaked:', formData.DateOfLeak ?? '', 'Time of Line Leaked:', formData.TimeOfLeak ?? '', positionY);
positionY = fieldPair('Information Given By:', formData.InformationGivenBy ?? '', 'Name of Person:', formData.NameOfPerson ?? '', positionY);
positionY = fieldPair('Line Size:', formData.LineSize ?? '', 'Leak Location:', formData.LeakLocation ?? '', positionY);
positionY = fieldPair('Notification NO.:', formData.NotificationNo ?? '', 'Route To:', formData.RouteTo ?? '', positionY);
positionY = fieldPair('Total Hydrants Affected:', formData.TotalHydt ?? '', 'Total Monitors Affected:', formData.TotalMoni ?? '', positionY);
positionY = fieldPair('WSS Lines Affected:', formData.WSSLines ?? '', 'Foam Lines Affected:', formData.FoamLines ?? '', positionY);
positionY = fieldPair('Unit Area:', formData.UnitArea ?? '', 'Department:', formData.Department ?? '', positionY);
positionY = fieldPair('Action Taken by Maintenance:', formData.ActionByMaintenance ?? '', 'Total B/V Closed:', formData.TotalBVClosed ?? '', positionY);
positionY = fieldPair('Action Taken by Operation:', formData.ActionByOperation ?? '', 'Action Taken by F & S:', formData.ActionByFireSafety ?? '', positionY);
positionY = fieldPair('Immediate Action by F & S:', formData.ImmediateActionFireSafety ?? '', 'Affected Equipments :', formData.AffectedEquipmentsTagged ?? '', positionY);

positionY = fieldPair('Informed To:', formData.InformedTo ?? '', 'Person Name:', formData.PersonName ?? '', positionY);


// Add an additional gap if needed

  }
  // Add the "Remarks" text
const descriptionText = 'Detailed Description';
const descriptionX = 10; // Adjust x position as needed
const descriptionY = 225; // Position below the Maintenance section
pdf.text(descriptionText, descriptionX, descriptionY - 20); // Adjust the y offset as needed

// Create the textarea for Remarks
const descriptionTextareaX = 9;
const descriptionTextareaY = 215;
const descriptionTextareaWidth = 182; // Adjust the width as needed
const descriptionTextareaHeight = 30; // Adjust the height as needed
pdf.rect(descriptionTextareaX, descriptionTextareaY, descriptionTextareaWidth, descriptionTextareaHeight);

// Add the Remarks value to the textarea
const descriptionValue = document.querySelector('textarea[name="description"]').value;
pdf.text(descriptionValue, descriptionTextareaX + 5, descriptionTextareaY + 15); // Adjust the offsets as needed


// Start a new page
{
    pdf.addPage();
    positionY = addHeader() + 20; // Reset positionY after adding a header on the new page
  }
  
  positionY = addHeader() + 20; 
  
  // Draw the border with a margin
  //const margin = 5; // Adjust the margin value as needed
  pdf.setLineWidth(0.5);
  pdf.setTextColor(0, 0, 0); // RGB for red
  pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  pdf.setFontSize(12);
  pdf.stroke();
 
  
        
        // Your existing PDF generation code

        async function addImages(pdf, label1, imageFile1, positionY) {
            const marginX = 12; // Left margin for the first image
            const gap = 30; // Gap between the two images
            const imageWidth = 175; // Width of each image
            const imageHeight = 100; // Height of each image

            // Add labels for the images
            if (label1) pdf.text(label1, marginX, positionY - 5);
            //if (label2) pdf.text(label2, marginX + imageWidth + gap, positionY - 5);

            // Convert images to Data URLs and add them
            if (imageFile1) {
                const dataURL1 = await readFileAsDataURL(imageFile1);
                pdf.addImage(dataURL1, 'JPEG', marginX, positionY, imageWidth, imageHeight);
            }
            //if (imageFile2) {
                //const dataURL2 = await readFileAsDataURL(imageFile2);
                //pdf.addImage(dataURL2, 'JPEG', marginX + imageWidth + gap, positionY, imageWidth, imageHeight);
            //}

            // Return the updated yPosition after the images
            return positionY + imageHeight + 10; // Add space below the images
        }

        positionY = await addImages(
            pdf,
            'Leak Location Pic:',
            formData.LeakLocationPic1,
            //'Leak Location Pic-2:',
            //formData.LeakLocationPic2,
            positionY
        );
        
    



positionY = 200;
// Display each field pair with fieldPair
// Use the nullish coalescing operator (??) to provide fallback values

positionY = fieldPair('Submitted By:', formData.SubmittedBy ?? '', 'Designation:', formData.Designation ?? '', positionY);


// Add Footer
const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
  }

        pdf.save("FIRE_WATER_LINE_LEAK_Report.pdf");

    });
});

        
