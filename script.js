const addImageBtn = document.querySelector("#addImageBtn");
const addTextBoxBtn = document.querySelector("#addTextBoxBtn")
const canvasDiv = document.querySelector('.canvasDiv');
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.querySelector('#downloadBtn');
canvas.height = 500;
canvas.width = 500;
let uploadedImage = null;
addImageBtn.addEventListener('change', (event) => {
    if (event.target.files.length === 1) {
        console.log("hello");
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.onload = function (e) {
                const imgWidth = image.width;
                const imgHeight = image.height;
                const scaleY = canvas.height / imgHeight;
                const scaleX = canvas.width / imgWidth;
                const scale = Math.min(scaleX, scaleY);
                const x = (canvas.width - imgWidth * scale) / 2;
                const y = (canvas.height - imgHeight * scale) / 2;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                console.log(imgWidth * scale);
                console.log(imgHeight * scale);
                ctx.drawImage(image, 0, 0, imgWidth, imgHeight, x, y, imgWidth * scale, imgHeight * scale);
                uploadedImage = image;
            }
            image.src = e.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }

})

let selectedTextBox = null;
addTextBoxBtn.addEventListener('click', () => {
    const textBoxWrapper = document.createElement('div');
    textBoxWrapper.classList.add('text-box-wrapper');
    textBoxWrapper.style.left = '50px';
    textBoxWrapper.style.top = '50px';

    const textBoxContent = document.createElement('div');
    textBoxContent.classList.add('text-box');
    textBoxContent.contentEditable = false;
    textBoxContent.innerText = 'Your Text';

    textBoxWrapper.appendChild(textBoxContent);
    canvasDiv.appendChild(textBoxWrapper);
    makeDraggable(textBoxWrapper);

    textBoxWrapper.addEventListener('mouseenter', (e) => {
        selectedTextBox = textBoxWrapper;

        e.stopPropagation();
    });
    textBoxWrapper.addEventListener('mouseleave', () => {
        console.log("hellow");
        if (selectedTextBox) {
            selectedTextBox.classList.remove('selected');
            selectedTextBox = null;
        }
    });

    textBoxContent.addEventListener('click', (e) => {
        textBoxContent.contentEditable = true;
        textBoxContent.focus();
        e.stopPropagation();
    });
    document.addEventListener('click', () => {
        if (textBoxContent.contentEditable === "true") {
            textBoxContent.contentEditable = false;
        }
    });
});
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const canvasWrapper = document.querySelector('#canvasWrapper');
            const wrapperRect = canvasWrapper.getBoundingClientRect();

            const mouseX = e.clientX - wrapperRect.left - offsetX;
            const mouseY = e.clientY - wrapperRect.top - offsetY;

            const maxX = canvasWrapper.clientWidth - element.offsetWidth;
            const maxY = canvasWrapper.clientHeight - element.offsetHeight;

            const newX = Math.max(0, Math.min(mouseX, maxX));
            const newY = Math.max(0, Math.min(mouseY, maxY));

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
document.addEventListener('keyup', (e) => {
    if (e.key === 'Backspace' && selectedTextBox) {
        selectedTextBox.remove();
        selectedTextBox = null;
    }
});

function drawCanvas() {
    // uploadedImage = image.
    if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const textBoxes = document.querySelectorAll('.text-box');
    textBoxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top + 20;

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(box.innerText, x, y);
    });
}

downloadBtn.addEventListener('click', () => {
    drawCanvas();
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
});


