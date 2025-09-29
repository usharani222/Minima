document.getElementById('compressBtn').addEventListener('click', async () => {
  const files = document.getElementById('fileInput').files;
  const level = document.getElementById('compressionLevel').value;

  for (let file of files) {
    let output;
    if (file.type.includes("image")) {
      output = await compressImage(file, level === "low" ? 0.3 : level === "medium" ? 0.5 : 0.7);
    } else if (file.type.includes("pdf")) {
      output = await compressPDF(file, level);
    }

    // Create download link
    const blob = new Blob([output], { type: file.type });
    const url = URL.createObjectURL(blob);

    document.getElementById('output').innerHTML += 
      `<a href="${url}" download="compressed-${file.name}">Download ${file.name}</a><br>`;
  }
});
