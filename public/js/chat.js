const socket = io.connect('http://localhost:8080/');
const message = document.getElementById('message'),
      output = document.getElementById('output');

if (socket !== undefined) {
    message.addEventListener('keydown', (e) => {
        if (e.which === 13 && e.shiftKey == false) {
            if (room == false) {
                socket.emit('chat', {
                    message: message.value,
                    user: username,
                    room: false 
                });
            } else {
                socket.emit('chat', {
                    message: message.value,
                    user: username,
                    room: room
                });
            }
            message.value = '';
            e.preventDefault();
        }
    });

    socket.on('output', (data) => {
        if (data.length == undefined) {
            output.innerHTML += `<p><strong> ${data.username}</strong>: ${data.message}`; 
        } else {
            if (!output.innerHTML) {
                for (let i = 0; i < data.length; i++) {
                    output.innerHTML += `<p><strong> ${data[i].username}</strong>: ${data[i].message}`;
                }
            }
        }
        output.scrollTop = output.scrollHeight - output.clientHeight;
    });
    if (room == false) {
        socket.emit('output', {
            room: false
        });
    } else {
        socket.emit('output', {
            room: room
        });
    }
}