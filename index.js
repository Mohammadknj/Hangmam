let countdown;
let minDisplay = document.getElementById("minute");
let secDisplay = document.getElementById("second");
let startButton = document.getElementById("startButton");
let buttons = document.querySelectorAll(".button");
let finished = false;
buttons.forEach((button) => {
  button.disabled = true;
});
async function getRandomWord() {
  try {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching the random word:", error);
    return "Error fetching word";
  }
}
let word = "";
startButton.addEventListener("click", async () => {
  if (!finished) {
    while (word.length < 3 || word.length > 12) {
      word = await getRandomWord();
    }
    word = word.toUpperCase();
    let paragraph=document.getElementById('paragraph')
    document.getElementById('word').removeChild(paragraph)
    buttons.forEach((button) => {
      button.disabled = false;
    });
    for (let i = 0; i < word.length; i++) {
      const span = document.createElement("span");
      span.style.paddingTop = "29px";
      document.getElementById("word").appendChild(span);
    }
  }
});
startButton.addEventListener("click", () => {
  if (!finished) {
    startButton.style.display = "none";
    let timeLeft = secDisplay.textContent;
    clearInterval(countdown);
    countdown = setInterval(() => {
      if (!finished) {
        timeLeft--;
        if (timeLeft < 10) {
          secDisplay.textContent = "0" + timeLeft;
          if (minDisplay.textContent == 0) {
            document.getElementById("Timer").style.color = "#ff4646";
          }
        } else secDisplay.textContent = timeLeft;

        if (timeLeft == 0) {
          setTimeout(() => {
            if (minDisplay.textContent > 0) {
              if (minDisplay.textContent < 11) {
                let num = minDisplay.textContent - 1;
                minDisplay.textContent = "0" + num;
              } else minDisplay.textContent--;
            } else {
              minDisplay.textContent = "00";
              secDisplay.textContent = "00";
              clearInterval(countdown);
              alert("Time's up! You lost");
              Finisher();
            }
          }, 1000);
          if (minDisplay.textContent > 0) {
            if (minDisplay.textContent < 10) {
            }
            timeLeft = 60;
          }
        }
      }
    }, 1000);
  } else location.reload();
});

let counter = 0;
let cnt = 0;
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    let found = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i] == button.innerHTML) {
        found = true;
        document.getElementById("word").children[i].style.paddingTop = "0";
        document.getElementById("word").children[i].innerHTML = word[i];
        button.classList.add("correct");
        button.disabled = true;
        cnt++;
      }
    }
    if (!found) {
      button.classList.add("incorrect");
      button.disabled = true;
      counter++;
    }
    document.getElementById("state").src = `Images/Stage ${counter + 1}.png`;
    if (counter == 7) {
      alert("You lost!");
      Finisher();
    }
    if (cnt == word.length) {
      setTimeout(() => {
        alert("Hooora!! You won");
        document.getElementById("state").src = `Images/Stage 1.png`;
        Finisher();
      }, 500);
    }
  });
});

function Finisher() {
  finished = true;
  startButton.style.display = "inline-block";
  startButton.textContent = "Reload";
  startButton.style.letterSpacing = "1px";
  buttons.forEach((button) => {
    button.disabled = true;
  });
  setTimeout(() => {
    for (let i = 0; i < word.length; i++) {
      document.getElementById("word").children[i].style.paddingTop = "0";
      document.getElementById("word").children[i].innerHTML = word[i];
    }
  }, 500);
}
