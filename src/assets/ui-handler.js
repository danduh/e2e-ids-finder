chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'isUiHandlerInjected') {
    sendResponse({ status: true });
  }
});

const defaultE2EAttr = "e2e-id";

const loadE2eId = async () => {
  return await chrome.storage.sync.get({
    attributeId: defaultE2EAttr
  })
    .then((resp) => {
      return resp["attributeId"]
    });
}

const loadUseShadowDom = async () => {
  return await chrome.storage.sync
    .get({
      includeShadowDom: false,
    })
    .then((resp) => {
      return resp["includeShadowDom"];
    });
}


function getAbsPosition(element) {
  let rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top }
}

function addMarker(elem, e2eAttr) {
  let marker = document.getElementById("e2e-searcher-helper");
  let isExists = true;

  if (!marker) {
    marker = document.createElement("div");
    isExists = false;
  }

  let _position = getAbsPosition(elem);
  marker.id = "e2e-searcher-helper";
  marker.style.top = _position.y + "px";
  marker.style.left = _position.x + "px";
  marker.style.display = "block";

  // TODO <Make this configurable>
  // marker.style.background = "grey";
  // marker.style.color = "#FFF";
  // marker.style.fontSize = "12px";
  // marker.style.padding = "5px";
  marker.textContent = elem.getAttribute(e2eAttr);

  if (!isExists) {
    document.body.appendChild(marker);
  }
}

const highLiteElem = function (elem, e2eAttr, event) {
  event.stopPropagation();
  addMarker(elem, e2eAttr);
};


const querySelectorAllWithShadow = (selector, root = document) => {
  let elements = [];

  // Search in the current root
  elements.push(...root.querySelectorAll(selector));

  // Search in Shadow DOMs
  root.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      elements.push(...querySelectorAllWithShadow(selector, el.shadowRoot));
    }
  });

  return elements;
}

const defaultStyle = "2px solid #000";

const showE2Areas = async () => {
  const e2eAttr = await loadE2eId()
  const useShadowDom = await loadUseShadowDom();
  console.log(`[E2E HELPER] show elements with ${e2eAttr} attribute`);
  let elements = !useShadowDom ? document.querySelectorAll(`[${e2eAttr}]`) : querySelectorAllWithShadow(`[${e2eAttr}]`);

  if (elements.length === 0) {
    console.warn(`[E2E HELPER] no elements with ${e2eAttr} attribute was found!!!`);
    return
  }
  elements.forEach((elem) => {
    elem.classList.add('e2e-helper-hover')
    elem.style.border = defaultStyle;
    elem.onmouseenter = highLiteElem.bind(null, elem, e2eAttr);
  });
}

const clearE2Areas = async () => {
  const e2eAttr = await loadE2eId()
  const useShadowDom = await loadUseShadowDom();
  console.log(`[E2E HELPER] clear elements with ${e2eAttr} attribute`);
  let elements = !useShadowDom ? document.querySelectorAll(`[${e2eAttr}]`) : querySelectorAllWithShadow(`[${e2eAttr}]`);

  if (elements.length === 0) {
    console.warn(`[E2E HELPER] no elements with ${e2eAttr} attribute was found!!!`);
    return
  }
  elements.forEach((elem) => {
    elem.classList.remove('e2e-helper-hover')
    elem.style.border = "none";
    elem.onmouseenter = null;
    elem.onmouseout = null;
  });

  let marker = document.getElementById("e2e-searcher-helper");
  if (marker)
    marker.style.display = "none";
}

