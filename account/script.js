const select = document.querySelector('.select');

select.addEventListener('change', ()=> {
const selectedOption = select.options[select.selectedIndex];
console.log(`Selected option: ${selectedOption.innerText}`);
});
const input = document.querySelector('#upload-video-input');
input.addEventListener('change', (event) => {
const file = event.target.files[0];
const fileName = file.name;
const fileSize = file.size;
const fileType = file.type;

console.log(`Selected file: ${fileName}, size: ${fileSize}, type: ${fileType}`);

  // Upload the video file here
});
