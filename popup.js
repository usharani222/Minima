// popup.js

// Import libraries if using bundler or include via <script> in HTML
// For example, browser-image-compression for images
// pdf-lib for PDF compression


const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
const compressionLevel = document.getElementById('compressionLevel');
const outputDiv = document.getElementById('output');

// Highlight upload area on drag
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = '#f0fff0';
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = '#fff';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = '#fff';
  const files = e.dataTransfer.files;
  handleCompression(files);
});

// Click on upload area triggers file input
uploadArea.addEventListener('click', () => fileInput.click());

// Map compression levels to quality
const qualityMap = {
  'low': 0.3,
  'medium': 0.5,
  'high': 0.7
};

// Utility function to compress images using browser-image-compression
async function compressImage(file, level) {
  const options = {
    maxSizeMB: 2, // Max size per image
    maxWidthOrHeight: 1920, // Resize if too large
    initialQuality: level,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (err) {
    console.error('Image compression error:', err);
    return null;
  }
}

// Utility function to compress PDFs using pdf-lib
async function compressPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    for (let page of pages) {
      // Optional: downsample images or optimize
      // Currently, leaving pages as-is for basic compression
    }

    const compressedBytes = await pdfDoc.save();
    return new Blob([compressedBytes], { type: 'application/pdf' });
  } catch (err) {
    console.error('PDF compression error:', err);
    return null;
  }
}

// Handle file compression
async function handleCompression(files) {
  outputDiv.innerHTML = '';

  for (let file of files) {
    const level = qualityMap[compressionLevel.value] || 0.5;
    let compressedBlob = null;

    // Determine file type
    if (file.type.startsWith('image/')) {
      compressedBlob = await compressImage(file, level);
    } else if (file.type === 'application/pdf') {
      compressedBlob = await compressPDF(file);
    } else {
      alert(`${file.name} is not a supported file type`);
      continue;
    }

    if (compressedBlob) {
      const url = URL.createObjectURL(compressedBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `compressed-${file.name}`;
      downloadLink.textContent = `Download ${file.name}`;
      downloadLink.style.display = 'block';

      outputDiv.appendChild(downloadLink);

      // Show file size info
      const originalSizeKB = (file.size / 1024).toFixed(1);
      const compressedSizeKB = (compressedBlob.size / 1024).toFixed(1);
      const sizeInfo = document.createElement('small');
      sizeInfo.textContent = `Original: ${originalSizeKB} KB → Compressed: ${compressedSizeKB} KB`;
      outputDiv.appendChild(sizeInfo);
      outputDiv.appendChild(document.createElement('hr'));
    }
  }
}

// Event listener for button
compressBtn.addEventListener('click', () => {
  const files = fileInput.files;
  if (!files.length) {
    alert('Please select files to compress!');
    return;
  }
  handleCompression(files);
});

// Optional: Drag & drop support
fileInput.parentElement.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileInput.parentElement.style.border = '2px dashed #4CAF50';
});

fileInput.parentElement.addEventListener('dragleave', (e) => {
  e.preventDefault();
  fileInput.parentElement.style.border = '';
});

fileInput.parentElement.addEventListener('drop', (e) => {
  e.preventDefault();
  fileInput.parentElement.style.border = '';
  const dt = e.dataTransfer;
  const files = dt.files;
  handleCompression(files);
});
