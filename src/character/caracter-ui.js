import image from './images/lazy.png';

const createImage = (src) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => res(img);
  img.onerror = rej;
  img.src = src;
});

async function render() {
  const subHeader = document.createElement('h2');
  subHeader.innerHTML = 'This elements was created by js';
  const myImage = await createImage(image);
  const startButton = document.createElement('button');
  startButton.textContent = 'Fight!';
  
  document.body.appendChild(subHeader);
  document.body.appendChild(myImage);
  document.body.appendChild(startButton);
}

startButton.addEventListener('click', function() {
  window.location.href = 'setting.html';
});

render();