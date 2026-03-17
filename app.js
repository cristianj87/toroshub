// ==========================================
// 1. LÓGICA DEL CLIMA (OpenWeather API)
// ==========================================
const weatherInfo = document.getElementById('weather-info');
const API_KEY = '05b9c68c23a6fdfb1d565c97acc05c74'; // Recuerda pegar tu API Key de OpenWeatherMap aquí

function getWeather(lat, lon) {
    weatherInfo.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando al cielo...';
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description;
            let city = data.name;
            
            // Filtro para corregir la geolocalización fronteriza (San Elizario, etc.)
            const ciudadesFronterizas = ["San Elizario", "Manuel F. Martínez", "El Paso", "Socorro", "Sunland Park"];
            if (ciudadesFronterizas.some(frontera => city.includes(frontera))) {
                city = "Ciudad Juárez";
            }
            
            let iconCode = 'fa-cloud';
            const mainWeather = data.weather[0].main.toLowerCase();
            if (mainWeather.includes('clear')) iconCode = 'fa-sun';
            if (mainWeather.includes('cloud')) iconCode = 'fa-cloud-sun';
            if (mainWeather.includes('rain')) iconCode = 'fa-cloud-rain';
            
            weatherInfo.innerHTML = `
                <div style="font-size: 2.8rem; color: var(--accent); margin-bottom: 5px;">
                    <i class="fa-solid ${iconCode}"></i> ${temp}°C
                </div>
                <div style="font-size: 0.9rem; text-transform: capitalize; color: var(--text-muted);">
                    ${desc} en ${city}
                </div>
            `;
        })
        .catch(err => {
            weatherInfo.innerHTML = '<div style="font-size: 0.9rem; color: #ff4757;"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar el clima.</div>';
        });
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => getWeather(position.coords.latitude, position.coords.longitude),
        (error) => { weatherInfo.innerHTML = '<div style="font-size: 0.9rem; color: var(--text-muted);">Permiso de ubicación denegado.</div>'; }
    );
}

// ==========================================
// 2. LÓGICA DEL CHATBOT Y LA INTERFAZ
// ==========================================
function toggleChat() {
    const chatWindow = document.getElementById('floating-chat-window');
    chatWindow.classList.toggle('hidden');
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const chatBox = document.getElementById('chat-box');
    
    // Imprimir mensaje del usuario
    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Respuestas automáticas (ToroBot)
    // Respuestas automáticas (ToroBot UTCJ con conocimiento de la universidad)
    setTimeout(() => {
        let reply = "Soy el ToroBot virtual. Aún estoy aprendiendo, pero puedo ayudarte con información general de la UTCJ, admisiones, o accesos a plataformas. 🐂";
        
        // Convertimos el mensaje a minúsculas y quitamos acentos
        const msgLower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // 1. Ubicación y Contacto
        if(msgLower.includes('ubicacion') || msgLower.includes('direccion') || msgLower.includes('donde') || msgLower.includes('telefono')) {
            reply = "La UTCJ está ubicada en Av. Universidad Tecnológica No. 3051, Col. Lote Bravo II, Ciudad Juárez. El conmutador principal es (656) 649 0600.";
        } 
        // 2. Carreras y Oferta Educativa
        else if(msgLower.includes('carrera') || msgLower.includes('licenciatura') || msgLower.includes('ingenieria') || msgLower.includes('tsu')) {
            reply = "Ofrecemos programas de nivel Técnico Superior Universitario (TSU) e Ingenierías/Licenciaturas. Destacan áreas como Tecnologías de la Información, Mecatrónica, Mantenimiento, Energías Renovables y Negocios. Puedes ver la oferta completa en el sitio oficial.";
        }
        // 3. Fichas y Admisiones
        else if(msgLower.includes('ficha') || msgLower.includes('admision') || msgLower.includes('inscripcion') || msgLower.includes('entrar')) {
            reply = "El proceso para tramitar fichas de nuevo ingreso se publica periódicamente en el sitio web de la UTCJ. Te recomiendo estar atento a la sección de 'Últimas Noticias' en esta aplicación para conocer las fechas exactas.";
        }
        // 4. SISE y Calificaciones
        else if(msgLower.includes('sise') || msgLower.includes('calificacion') || msgLower.includes('horario') || msgLower.includes('kardex')) {
            reply = "Puedes revisar tu carga académica, kardex y calificaciones entrando al portal SISE desde la sección de 'Accesos Rápidos'.";
        } 
        // 5. Correo Institucional
        else if(msgLower.includes('correo') || msgLower.includes('microsoft') || msgLower.includes('teams') || msgLower.includes('password')) {
            reply = "Para acceder a tu correo institucional (@alumnos.utcj.edu.mx) o Microsoft Teams, utiliza el botón 'Correo MS' en la pantalla principal. Recuerda que tu usuario suele ser tu matrícula.";
        } 
        // 6. Laboratorios e Infraestructura de TI
        else if(msgLower.includes('tecnologias de la informacion') || msgLower.includes('sistemas') || msgLower.includes('programacion') || msgLower.includes('laboratorio')) {
            reply = "Los laboratorios de cómputo para la carrera de Tecnologías de la Información están equipados para tus prácticas de desarrollo de software, redes y bases de datos. ¡Aprovecha al máximo tus clases y proyectos!";
        } 
        // 7. Saludo
        else if(msgLower.includes('hola') || msgLower.includes('buenos dias') || msgLower.includes('buenas tardes')) {
            reply = "¡Hola, Toro Bravo! 🐂 ¿En qué te puedo ayudar hoy con información sobre la universidad, el SISE o tus clases?";
        }
        
        // Imprimir la respuesta del bot en la interfaz
        chatBox.innerHTML += `<div class="message bot">${reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});
