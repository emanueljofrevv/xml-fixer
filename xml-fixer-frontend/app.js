// frontend/app.js
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('xmlFile', document.getElementById('xmlFile').files[0]);

    try {
        
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();
        document.getElementById('output').innerText = result;

    } catch (error) {
        document.getElementById('output').innerText = 'Error uploading file';
    }
});
