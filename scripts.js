const showsList = document.getElementById("shows-list");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const buildShowCard = (show) => {
  const card = document.createElement("article");
  card.className = "show";

  const date = document.createElement("div");
  date.className = "show__date";
  date.textContent = formatDate(show.date);

  const details = document.createElement("div");
  details.className = "show__details";
  details.innerHTML = `
    <h3>${show.city}</h3>
    <p>${show.venue} · ${show.time}</p>
  `;

  card.append(date, details);

  if (show.tickets) {
    const link = document.createElement("a");
    link.className = "button button--small";
    link.href = show.tickets;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Tickets";
    card.append(link);
  } else {
    const span = document.createElement("span");
    span.className = "show__note";
    span.textContent = "Thank you for the energy";
    card.append(span);
  }

  return card;
};

const renderShows = (shows) => {
  showsList.innerHTML = "";
  shows.forEach((show) => {
    showsList.append(buildShowCard(show));
  });
};

const loadShows = async () => {
  const response = await fetch("shows.yaml");
  const yamlText = await response.text();
  const data = jsyaml.load(yamlText);
  const page = document.body.dataset.page;

  if (page === "past") {
    renderShows(data.past || []);
  } else {
    renderShows(data.upcoming || []);
  }
};

loadShows();
