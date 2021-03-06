function startClock() {
  const WeekNames = "일월화수목금토일";
  const $Body = document.body;
  const $hhMM = document.getElementById("hhMM");
  const $ss = document.getElementById("ss");
  const $Date = document.getElementById("Date");
  const state = {
    time: "",
    date: "",
    seconds: "",
  };
  const generator = {
    time: (now) => dateFns.format(now, "HH:mm"),
    seconds: (now) => dateFns.format(now, ".ss"),
    date: (now) =>
      dateFns.format(now, `M월 D일`) + ` (${WeekNames.charAt(now.getDay())})`,
  };

  function updateComponent(now, key, $element) {
    const next = generator[key](now);
    if (next !== state[key]) {
      state[key] = next;
      $element.innerText = next;
    }
  }

  function updateNow() {
    const now = new Date();
    updateComponent(now, "time", $hhMM);
    updateComponent(now, "date", $Date);
    if (now.getMinutes() >= 59) {
      updateComponent(now, "seconds", $ss);
      $ss.style.display = "";
    } else {
      $ss.style.display = "none";
    }
    if (now.getHours() >= 7 && now.getHours() < 19) {
      if (!$Body.classList.contains("Day")) {
        $Body.classList.add("Day");
        $Body.classList.remove("Night");
      }
    } else {
      if (!$Body.classList.contains("Night")) {
        $Body.classList.add("Night");
        $Body.classList.remove("Day");
      }
    }
  }

  updateNow();
  setInterval(updateNow, 1000);
}

let params = null;
function getParams() {
  if (params === null) {
    params = ((window.location.search || "").substring(1) || "")
      .split("&")
      .filter(Boolean)
      .map((kv) => kv.split("="))
      .map(([k, v]) => ({ [decodeURIComponent(k)]: decodeURIComponent(v) }))
      .reduce((map, kv) => Object.assign(map, kv), {});
  }
  return params;
}

function parseyyyyMMdd(yyyyMMdd) {
  return new Date(
    +yyyyMMdd.substring(0, 4),
    +yyyyMMdd.substring(4, 6) - 1,
    +yyyyMMdd.substring(6, 8)
  );
}

function startDday(paramKey, elementId) {
  if (!(paramKey in getParams())) {
    return;
  }

  const originDate = parseyyyyMMdd(getParams()[paramKey]);
  let lastState = "";

  function getDiffDays() {
    return dateFns.differenceInDays(new Date(), originDate) + 1;
  }

  const $Dday = document.getElementById(elementId);
  function updateDdays() {
    const diffDays = getDiffDays();
    const newState = `${diffDays > 0 ? "+" : ""}${diffDays}일`;
    if (lastState !== newState) {
      $Dday.innerText = newState;
      lastState = newState;
    }
  }

  updateDdays();
  setInterval(updateDdays, 1000);
}

function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;
  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;
  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

function setupFullScreen() {
  // const $Clock = document.getElementsByClassName("Clock")[0];
  document.ontouchend = toggleFullScreen;
  document.onmouseup = toggleFullScreen;
}

function main() {
  startClock();
  startDday("dday", "Dday1");
  startDday("dday2", "Dday2");
  setupFullScreen();
}

main();
