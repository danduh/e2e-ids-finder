var defaultStyle = "2px solid #000";
var hoveredStyle = "2px solid red";
var defaultE2EAttr = "e2e-id";


const loadE2eId = async () => {
  return await chrome.storage.sync.get({
    attributeId: "e2e-id"
  })
    .then((resp) => {
      return resp["attributeId"]
    });
}


function getAbsPosition(element){
  let rect = element.getBoundingClientRect();
  return {x: rect.left, y: rect.top}
}

function addMarker(elem, e2eAttr){
  let marker = document.getElementById("e2e-searcher-helper");
  let isExists = true;

  if (!marker) {
    marker = document.createElement("div");
    isExists = false;
  }

  let _position = getAbsPosition(elem);
  marker.id = "e2e-searcher-helper";
  marker.style.position = "fixed";
  marker.style.display = "block";
  marker.style.zIndex = "100000";
  marker.style.top = _position.y + "px";
  marker.style.left = _position.x + "px";
  marker.style.background = "grey";
  marker.style.color = "#FFF";
  marker.style.fontSize = "12px";
  marker.style.padding = "5px";
  marker.textContent = elem.getAttribute(e2eAttr);

  if (!isExists) {
    document.body.appendChild(marker);
  }
}

const highLiteElem = function (elem, e2eAttr, event){
  event.stopPropagation();
  elem.style.border = hoveredStyle;
  addMarker(elem, e2eAttr);
};

const unHighLiteElem = function (elem, event){
  elem.style.border = defaultStyle;
};

const showE2Areas = async () => {
  const e2eAttr = await loadE2eId()
  console.log(`[E2E HELPER] show elements with ${ e2eAttr } attribute`);
  let elements = document.querySelectorAll(`[${ e2eAttr }]`);
  if (elements.length === 0) {
    console.warn(`[E2E HELPER] no elements with ${ e2eAttr } attribute was found!!!`);
    return
  }
  elements.forEach((elem) => {
    elem.style.border = defaultStyle;
    elem.onmouseenter = highLiteElem.bind(null, elem, e2eAttr);
    elem.onmouseout = unHighLiteElem.bind(null, elem);
  });
}

const clearE2Areas = async () => {
  const e2eAttr = await loadE2eId()
  console.log(`[E2E HELPER] clear elements with ${ e2eAttr } attribute`);
  let elements = document.querySelectorAll(`[${ e2eAttr }]`);
  if (elements.length === 0) {
    console.warn(`[E2E HELPER] no elements with ${ e2eAttr } attribute was found!!!`);
    return
  }
  elements.forEach((elem) => {
    elem.style.border = "initial";
    elem.onmouseenter = null;
    elem.onmouseout = null;
  });

  let marker = document.getElementById("e2e-searcher-helper");
  if (marker)
    marker.style.display = "none";
}

