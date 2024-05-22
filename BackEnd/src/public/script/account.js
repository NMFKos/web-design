document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('upload-avatar').click();
});
document.getElementById('upload-avatar').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('avatar').src = reader.result;
        console.log(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
    const files = e.target.files;
  for (const file of files) {
      const reader = new FileReader();
      reader.onload = function() {
          const img = document.createElement('img');
          img.src = reader.result;
          img.style.width = '100px';
          img.style.height = '100px';
          document.querySelector('.image-preview').appendChild(img);
      }
      reader.readAsDataURL(file);
  }
});