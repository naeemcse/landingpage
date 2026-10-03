/**
 * =========================================================================
 * GOOGLE APPS SCRIPT FOR EGG SHOP (ডিম বাড়ি) ORDER RECEIVER
 * =========================================================================
 * 
 * Instructions (২ মিনিটের সেটআপ):
 * --------------------------------
 * ১. আপনার গুগল ড্রাইভে যান (https://drive.google.com)
 * ২. একটি নতুন Google Sheet তৈরি করুন (নাম দিন: "ডিম বাড়ি - অর্ডার ডাটা")
 * ৩. গুগল শিটের ওপরের মেনু থেকে Extensions > Apps Script-এ ক্লিক করুন।
 * ৪. সেখানে বিদ্যমান কোডগুলো মুছে দিয়ে নিচের সম্পূর্ণ কোডটি পেস্ট করুন।
 * ৫. ওপরের ডানপাশে "Deploy" > "New deployment" বাটনে ক্লিক করুন।
 * ৬. গিয়ার আইকন (⚙️) ক্লিক করে "Web app" সিলেক্ট করুন:
 *    - Description: "Egg Order Receiver"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (এটি অবশ্যই Anyone দিবেন, যাতে ওয়েবসাইট ডাটা পাঠাতে পারে)
 * ৭. "Deploy" বাটনে ক্লিক করে "Authorize Access" দিয়ে পারমিশন দিন।
 * ৮. একটি "Web app URL" পাবেন (যেমন: https://script.google.com/macros/s/AKfycb.../exec)
 * ৯. এই URL-টি কপি করে আপনার `data/site-config.json` ফাইলের "googleSheetScriptUrl"-এ বসিয়ে দিন!
 * 
 * ব্যস! এখন থেকে ওয়েবসাইটে কেউ অর্ডার করলেই স্বয়ংক্রিয়ভাবে আপনার গুগল শিটে জমা হয়ে যাবে।
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if header row exists, if not create header row automatically
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Date",
        "Time",
        "Customer Name",
        "Phone",
        "Address",
        "Product",
        "Quantity",
        "Unit Price (BDT)",
        "Subtotal (BDT)",
        "Delivery Area",
        "Delivery Fee (BDT)",
        "Total Bill (BDT)",
        "Notes",
        "Order Status"
      ]);
      
      // Styling the header
      var headerRange = sheet.getRange(1, 1, 1, 15);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#15803d");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    // Parse received order JSON
    var data = JSON.parse(e.postData.contents);
    
    // Append the order row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.date || "",
      data.time || "",
      data.customerName || "",
      "'" + (data.customerPhone || ""), // Leading single quote preserves 01... as text
      data.customerAddress || "",
      data.productName || "",
      data.quantity || 1,
      data.unitPrice || 0,
      data.subtotal || 0,
      data.deliveryLocation || "",
      data.deliveryFee || 0,
      data.total || 0,
      data.notes || "",
      "নতুন অর্ডার (Pending)"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Order saved" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
