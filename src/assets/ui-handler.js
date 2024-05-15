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

function extractHTML(node) {

  // return a blank string if not a valid node
  if (!node) return ''

  // if it is a text node just return the trimmed textContent
  if (node.nodeType===3) return node.textContent.trim()

  //beyond here, only deal with element nodes
  if (node.nodeType!==1) return ''

  if (node.tagName.toLowerCase() === 'style') return '';
  if (node.tagName.toLowerCase() === 'svg') return '';

  let html = ''

  // clone the node for its outer html sans inner html
  let outer = node.cloneNode()

  // if the node has a shadowroot, jump into it
  node = node.shadowRoot || node

  if (node.children.length) {

    // we checked for children but now iterate over childNodes
    // which includes #text nodes (and even other things)
    for (let n of node.childNodes) {

      // if the node is a slot
      if (n.assignedNodes) {

        // an assigned slot
        if (n.assignedNodes()[0]){
          // Can there be more than 1 assigned node??
          html += extractHTML(n.assignedNodes()[0])

          // an unassigned slot
        } else { html += n.innerHTML }

        // node is not a slot, recurse
      } else { html += extractHTML(n) }
    }

    // node has no children
  } else { html = node.innerHTML }

  // insert all the (children's) innerHTML
  // into the (cloned) parent element
  // and return the whole package
  outer.innerHTML = html
  return outer.outerHTML

}

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`[E2E HELPER] ${request.action} was called`);
  const e2eAttr = request.e2eAttr || defaultE2EAttr;
  const useShadowDom = true
  // const useShadowDom = await loadUseShadowDom();
  // const e2eAttr = await loadE2eId()
  if (request.action === "findAllActionElements") {
    let elements = !useShadowDom ? document.querySelectorAll(`[${e2eAttr}]`) : querySelectorAllWithShadow(`[${e2eAttr}]`);
    const htmls = Array.from(elements).map((elem) => extractHTML(elem));

    if (htmls) {
      sendResponse({ html: htmls });
    } else {
      sendResponse({ error: "Element not found" });
    }
  }
});
