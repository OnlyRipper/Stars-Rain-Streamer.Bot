const ADDRESS = "127.0.0.1"; // IP of SB instance
const PORT = "8080"; // Port of SB instance
const ENDPOINT = "/"; // Endpoint of SB instance
const WEBSOCKET_URI = `ws://${ADDRESS}:${PORT}${ENDPOINT}`;
const EVENT_LISTENER_NAMEID = "Stars Rain"; 
const ws = new WebSocket(WEBSOCKET_URI);

let count, userName, args, response, subAction, userId;
const actionName = "{GAME} Rain Start"
const allArgs = ["count", "userName", "parentName", "args", "response", "subAction"];
const replayAction = "{GAME} Rain Response"
const mainTrigger = "{Websocket} Main Trigger"

function setupWebSocket() {
  console.log("Attempting to connect to Streamer.bot...");

  ws.addEventListener("open", (event) => {
    console.log("Connected to Streamer.bot");

    ws.send(
      JSON.stringify({
        request: "Subscribe",
        id: EVENT_LISTENER_NAMEID,
        events: {
          Raw: ["Action", "SubAction"], 
        },
      })
    );
  });
  ws.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event);
  });
}

function handleWebSocketMessages() {
  ws.addEventListener("message", (event) => {
    if (!event.data) return;

    const jsonData = JSON.parse(event.data);

    if (jsonData.id === EVENT_LISTENER_NAMEID) return;
    if (jsonData.id === "DoAction") return;

    const argumentsData = jsonData.data.arguments;

    args = jsonData.data.arguments;
    const currentParentName = jsonData.data.parentName;
    subAction = jsonData.name; 
    let startRain = argumentsData.startRain;
  
  if (argumentsData && "startRain" in args && currentParentName === mainTrigger) {
    if (startRain)
    {
      console.log("ARGS: ", argumentsData);
      let minimCount = argumentsData.minimCount;
      let maximCount = argumentsData.maximCount;
      let fallSpeed = argumentsData.fallSpeed;
      let gifImage = argumentsData.gifName;
      console.log('start rain');
      startStarGeneration(minimCount, maximCount, fallSpeed, gifImage);
      return;
    }
}

  });

 function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createStar(gifImage) {
  const star = document.createElement('div');
  star.classList.add('star');

  const starImage = document.createElement('img');
  starImage.src = `./img/${gifImage}.gif`;
  starImage.id = 'image';

  const size = getRandomNumber(20, 100);
  starImage.style.width = `${size}px`;
  starImage.style.height = `${size}px`;

  const containerWidth = document.getElementById('container').offsetWidth;
  const leftPosition = getRandomNumber(0, containerWidth - size);
  star.style.left = `${leftPosition}px`;

  const containerHeight = document.getElementById('container').offsetHeight;
  const topPosition = getRandomNumber(0, containerHeight - size);
  star.style.top = `${topPosition}px`;

  const duration = getRandomNumber(12, 20);
  star.style.animationDuration = `${duration}s`;

  star.appendChild(starImage);

  setTimeout(function () {
      document.getElementById('container').appendChild(star);
  }, 500);

  star.addEventListener('animationend', () => {
      star.remove();
  });
}

function generateStarsWithDelay(starCount, delay, gifImage) {
  for (let i = 0; i < starCount; i++) {
      setTimeout(() => {
          createStar(gifImage);
      }, i * delay); 
  }
}

function startStarGeneration(minimCount, maximCount, fallSpeed, gifImage) {
  console.log('startStarGeneration called'); 
  const starCount = getRandomNumber(minimCount, maximCount);
  back(starCount);
  const delayBetweenStars = fallSpeed; 
  generateStarsWithDelay(starCount, delayBetweenStars, gifImage);
}
  //Send Back to Streamer.Bot:
  function back(starCount) {
    ws.send(JSON.stringify({
      request: 'DoAction',
      id: 'DoAction',
      action: {
          name: replayAction,
      },
      args: {
        response: starCount,
      },
    }));
  }
}

setupWebSocket();
handleWebSocketMessages();
