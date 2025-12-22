const fs = require('fs');
const path = require('path');
const { initDatabase, saveUserProfilePhoto, closeDatabase } = require('./database');

async function uploadPhotos() {
  try {
    console.log('🔄 Initializing database connection...');
    await initDatabase();
    
    console.log('📸 Reading photos...');
    
    // Read veeru photo
    const veeruPath = path.join(__dirname, '../photos/veeru.jpeg');
    const veeruPhoto = fs.readFileSync(veeruPath);
    const veeruBase64 = veeruPhoto.toString('base64');
    const veeruDataUrl = `data:image/jpeg;base64,${veeruBase64}`;
    
    // Read madhu photo
    const madhuPath = path.join(__dirname, '../photos/madhu.jpeg');
    const madhuPhoto = fs.readFileSync(madhuPath);
    const madhuBase64 = madhuPhoto.toString('base64');
    const madhuDataUrl = `data:image/jpeg;base64,${madhuBase64}`;
    
    console.log('💾 Uploading photos to MongoDB...');
    
    // Save veerendra photo
    await saveUserProfilePhoto('veerendra', veeruDataUrl);
    console.log('✅ Veerendra photo uploaded');
    
    // Save madhu photo
    await saveUserProfilePhoto('madhu', madhuDataUrl);
    console.log('✅ Madhu photo uploaded');
    
    console.log('✅ All photos uploaded successfully!');
    
    await closeDatabase();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error uploading photos:', err);
    await closeDatabase();
    process.exit(1);
  }
}

uploadPhotos();

