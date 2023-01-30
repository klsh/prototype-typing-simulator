var exampleTextForm = document.querySelector("#form__example");
var highlightedText = document.querySelector(".highlighted");
var userTextForm = document.querySelector("#form__input");

var newTryButton = document.querySelector("#new__try");
var newTryWrap = document.querySelector("#try__wrap");

var exampleText = exampleTextForm.value;
var userText = userTextForm.value;

var exampleTextArray = [];
var userTextArray = [];
var firstStartFlag = false;

highlightedText.hidden = true;
userTextForm.disabled = true;
exampleTextForm.focus();

newTryButton.addEventListener("click", () => {
    location.reload();
});

document.getElementById("form__example").addEventListener("paste", (event) => {
    event.preventDefault();
    const pasteText = event.clipboardData.getData("text");
    exampleText = pasteText;
    exampleTextForm.innerText = exampleText;
    exampleTextArray = Array.from(pasteText);
});

function insertText() {
    exampleTextForm.addEventListener("input", function () {
        if (
            event.data === null &&
            event.inputType !== "deleteContentBackward"
        ) {
            exampleTextForm.readOnly = true;
            exampleTextForm.hidden = true;
            highlightedText.innerHTML = exampleText;
            highlightedText.hidden = false;
            userTextForm.disabled = false;
            userTextForm.focus();
        } else if (event.inputType === "deleteContentBackward") {
            exampleTextArray.pop();
            exampleText = exampleTextArray.join("");
        } else if (event.inputType === "insertText") {
            exampleTextArray.push(event.data);
            exampleText = exampleTextArray.join("");
        }
    });
}

insertText();

function userType() {
    userTextForm.addEventListener("input", function () {
        userTextArray.push(event.data);
        if (event.data !== "null") {
            for (var i = 0; i < userTextArray.length; i++) {
                if (userTextArray[i] === exampleTextArray[i]) {
                    userTextForm.value = userTextArray.join("");
                } else {
                    userTextArray.pop();
                    userTextForm.value = userTextArray.join("");
                }
            }
            firstStartTimer();
            highlightText();
        }
        compareText();
        highlightText();
    });
}

userType();

function firstStartTimer() {
    if (userTextForm.value !== "" && !firstStartFlag) {
        startWatch();
        firstStartFlag = true;
    }
}

function compareText() {
    if (JSON.stringify(userTextArray) === JSON.stringify(exampleTextArray)) {
        userTextForm.readOnly = true;
        pauseWatch();
        statisticType();
    }
}

function statisticType() {
    let statSymbol = userTextArray.length;
    let statTimer = time.innerText;

    let minutes = parseInt(statTimer.slice(0, 2));
    let seconds = parseInt(statTimer.slice(-2));
    let statSeconds = minutes * 60 + seconds;
    let statMinutes = minutes + seconds / 60;
    let statSpeed = Math.round(statSymbol / statMinutes);
    userTextForm.value =
        "Готово! \nВы набрали " +
        statSymbol +
        " символов за " +
        minutes +
        " минут" +
        " и " +
        seconds +
        " секунд. \nСкорость набора составила " +
        statSpeed +
        " символов в минуту.";
    newTryWrap.hidden = false;
    newTryButton.focus();
}

function startWatch() {
    let time = document.getElementById("time");
    let current = 0;
    this.timer = setInterval(() => {
        time.innerText = current++;
        let minutes = parseInt(current / 60);
        let seconds = parseInt(current - minutes * 60);
        time.innerText =
            minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0");
    }, 1000);
}

function resetWatch() {
    clearInterval(this.timer);
    let time = document.getElementById("time");
    time.value = 0;
    time.innerText = "00:00";
}

function pauseWatch() {
    clearInterval(this.timer);
    let time = document.getElementById("time");
    time.value = parseInt(time.innerText);
}

function highlightText() {
    for (var i = 0; i < userTextArray.length; i++) {
        highlightedText.innerHTML = exampleTextArray;
        highlightedText.innerHTML =
            "<b>" +
            exampleText.slice(0, i + 1) +
            "</b>" +
            exampleText.slice(i + 1, exampleText.length);
    }
}
