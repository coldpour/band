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
    span.textContent = show.note || "Thank you for the energy";
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

const parseShowDate = (dateString) => new Date(`${dateString}T00:00:00`);

const parseShowsText = (text) =>
  text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.split("\n").map((line) => line.trim()))
    .map((lines) => lines.filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      const show = {};
      lines.forEach((line) => {
        if (!show.date && /^\d{4}-\d{2}-\d{2}$/.test(line)) {
          show.date = line;
        } else if (!show.tickets && /^https?:\/\//i.test(line)) {
          show.tickets = line;
        } else if (!show.time && /\b\d{1,2}:\d{2}\s?(AM|PM)\b/i.test(line)) {
          show.time = line;
        } else if (
          !show.note &&
          /\b(all ages|all-ages|18\+|21\+)\b/i.test(line)
        ) {
          show.note = line;
        } else if (!show.city && /,/.test(line)) {
          show.city = line;
        } else if (!show.venue) {
          show.venue = line;
        } else if (!show.city) {
          show.city = line;
        } else if (!show.note) {
          show.note = line;
        }
      });
      return show;
    });

const loadShows = async () => {
  const response = await fetch("shows.txt");
  const showsText = await response.text();
  const shows = parseShowsText(showsText);
  const page = document.body.dataset.page;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (page === "past") {
    const pastShows = shows
      .filter((show) => parseShowDate(show.date) < today)
      .sort((a, b) => parseShowDate(b.date) - parseShowDate(a.date));
    renderShows(pastShows);
  } else {
    const upcomingShows = shows
      .filter((show) => parseShowDate(show.date) >= today)
      .sort((a, b) => parseShowDate(a.date) - parseShowDate(b.date));
    renderShows(upcomingShows);
  }
};

loadShows();
