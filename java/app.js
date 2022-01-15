
const btn = document.getElementById("talk")
const content = document.getElementById('content')


const SpeechRecog = window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = new SpeechRecog();

recog.lang = "en-US";
recog.interimResults = false;
recog.maxAlternatives = 1;

recog.onstart = function () {
    btn.innerHTML = "Start Talking";
    btn.setAttribute("disabled", "disabled");
    console.log('voice is activated,speak');
};

recog.onend = function () {
    btn.innerHTML = "Speak UP!";
    btn.removeAttribute("disabled");
};

recog.onresult = function (event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
};

btn.addEventListener('click', () => {
    recog.start();
    console.log('clicked')
})
