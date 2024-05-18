accept = document.querySelector('.Accept_button')
reeject = document.querySelector('.Reject_button')

document.querySelectorAll('.Accept_button, .Reject_button').forEach(button => {
    button.addEventListener('click, ()')
    {
        const row = this.closest('tr');
        const cells = row.querySelectorAll('td');
        const data = Array.from(cells).slice(0, -1).map(cell => cell.textContent);

        const payload = {
            id: data[0],
            username: data[1],
            type: data[2],
            title: data[3],
            description: data[4],
            price: data[5],
            phone_num: data[6],
            action: this.classList.contains('Accept_buttons') ? 'accept' : 'reject'
        }
    }
})