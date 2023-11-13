function addNumbers() {
    const num1 = document.getElementById('number1').value;
    const num2 = document.getElementById('number2').value;

    fetch(`/api/add?number1=${num1}&number2=${num2}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = `Result: ${data.result}`;
        })
        .catch(error => console.error('Error:', error));
}



