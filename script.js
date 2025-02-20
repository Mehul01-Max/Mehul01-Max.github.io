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
    textBoxContent.addEventListener('touchend', (e) => {
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

    const startDrag = (e) => {
        isDragging = true;
        // For touch events, we get the touch position.
        if (e.type === "touchstart") {
            offsetX = e.touches[0].radiusX;
            offsetY = e.touches[0].radiusY;
            console.log(e);
        } else { // For mouse events.
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            console.log(e);
        }
        e.preventDefault();
    };

    const drag = (e) => {

        if (isDragging) {
            const canvasWrapper = document.querySelector('#canvasWrapper');
            const wrapperRect = canvasWrapper.getBoundingClientRect();

            let mouseX, mouseY;

            if (e.type === "touchmove") {
                mouseX = e.touches[0].clientX - wrapperRect.left - offsetX;
                mouseY = e.touches[0].clientY - wrapperRect.top - offsetY;
            } else {
                mouseX = e.clientX - wrapperRect.left - offsetX;
                mouseY = e.clientY - wrapperRect.top - offsetY;
            }
            const maxX = canvasWrapper.clientWidth - element.offsetWidth;
            const maxY = canvasWrapper.clientHeight - element.offsetHeight;

            const newX = Math.max(0, Math.min(mouseX, maxX));
            const newY = Math.max(0, Math.min(mouseY, maxY));

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    };

    const endDrag = () => {
        isDragging = false;
    };

    element.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
    
    // Disable touch actions like scrolling while dragging
    element.style.touchAction = 'none';
}
const canvasWrapper = document.querySelector('#canvasWrapper'); // Ensure canvasWrapper is accessible

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing

    // Draw the uploaded image if there is one
    if (uploadedImage) {
        const imgWidth = uploadedImage.width;
        const imgHeight = uploadedImage.height;
        const scaleY = canvas.height / imgHeight;
        const scaleX = canvas.width / imgWidth;
        const scale = Math.min(scaleX, scaleY);
        const x = (canvas.width - imgWidth * scale) / 2;
        const y = (canvas.height - imgHeight * scale) / 2;
        ctx.drawImage(uploadedImage, 0, 0, imgWidth, imgHeight, x, y, imgWidth * scale, imgHeight * scale);
    }

    // Draw the text boxes with correct position scaling
    const textBoxes = document.querySelectorAll('.text-box');
    textBoxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const wrapperRect = canvasWrapper.getBoundingClientRect();

        // Adjust the position of the text box based on the canvas wrapper
        const x = (rect.left - wrapperRect.left) * (canvas.width / wrapperRect.width);
        const y = (rect.top - wrapperRect.top) * (canvas.height / wrapperRect.height) + 20;

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(box.innerText, x, y);
    });
}

// Ensure the canvas dimensions adjust based on the window size
function resizeCanvas() {
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    canvas.width = wrapperRect.width;
    canvas.height = wrapperRect.height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initialize the canvas size on page load

// Call drawCanvas() after elements are added or modified
downloadBtn.addEventListener('click', () => {
    drawCanvas();
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
});



