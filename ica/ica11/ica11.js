const customName = document.getElementById("custom-name");
const generateBtn = document.querySelector(".generate");
const story = document.querySelector(".story");

// Updated arrays
const characters = ["Petunia Truffles", "Lebron James", "Helen Keller"];
const places = ["a spacecraft", "the magic school bus", " Wheres Waldo's fridge"];
const events = [
  "sang the national anthem while juggling pineapples shaped like spongebob",
  "turned into an angry Karen with a bob",
  "ate their dog's homework"
];

// Random helper
function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// Build the story
function returnRandomStoryString() {
  const randomCharacter = randomValueFromArray(characters);
  const randomPlace = randomValueFromArray(places);
  const randomEvent = randomValueFromArray(events);

  const storyText = `${randomCharacter} decided to go for a walk. When they got to ${randomPlace}, they ${randomEvent}. Bob saw the whole thing, but was not surprised — ${randomCharacter} weighs 300 pounds, and it was a hot day.`;

  return storyText;
}

// Generate story
function generateStory() {
  let newStory = returnRandomStoryString();

  if (customName.value !== "") {
    const name = customName.value;
    newStory = newStory.replace("Bob", name);
  }

  if (document.getElementById("uk").checked) {
    const weight = Math.round(300 / 14) + " stone";
    const temperature = Math.round((94 - 32) * (5 / 9)) + " Celsius";
    newStory = newStory.replace("300 pounds", weight);
    newStory = newStory.replace("94", temperature);
  }

  story.textContent = newStory;
  story.style.visibility = "visible";
}

generateBtn.addEventListener("click", generateStory);