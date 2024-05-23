document.querySelector('.update-image-input').addEventListener('change', function(e) {
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