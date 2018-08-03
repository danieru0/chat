(function () {
    const socket = io.connect('http://localhost:8080/');
    const message = document.getElementById('message'),
          output = document.getElementById('output'),
          hamburger = document.getElementById('hamburger'),
          rooms = document.getElementById('rooms');

    hamburger.addEventListener('click', (req, res) => {
        if (rooms.classList.contains('active')) {
            rooms.classList.remove('active');
        } else {
            rooms.classList.add('active');
        }
    });

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
                if (data.username == username) {
                    output.innerHTML += `<p class="me"><strong> ${data.username}</strong>: ${data.message}`; 
                } else {
                    output.innerHTML += `<p><strong> ${data.username}</strong>: ${data.message}`; 
                }
            } else {
                if (!output.innerHTML) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].username == username) {
                            output.innerHTML += `<p class="me"><strong> ${data[i].username}</strong>: ${data[i].message}`;
                        } else {
                            output.innerHTML += `<p><strong> ${data[i].username}</strong>: ${data[i].message}`;
                        }
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
})();