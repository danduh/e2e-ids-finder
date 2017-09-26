var defaultStyle = '2px solid #000';
var hoveredStyle = '2px solid red';
var defaultE2EAttr = "e2e_id";
var e2eAttr = defaultE2EAttr;

chrome.storage.sync.get({
    attributeId: defaultE2EAttr
}, function (items) {
    e2eAttr = items.attributeId;
    console.log(`[E2E HELPER] ${e2eAttr} attribute will be used`);
    showE2Areas();
});

function getAbsPosition(element) {
    let rect = element.getBoundingClientRect();
    return {x: rect.left, y: rect.top}
}

function addMarker(elem) {
    let marker = document.getElementById('e2e-searcher-helper');
    let isExists = true;

    if (!marker) {
        marker = document.createElement("div");
        isExists = false;
    }

    let _position = getAbsPosition(elem);
    marker.id = 'e2e-searcher-helper';
    marker.style.position = 'fixed';
    marker.style.display = 'block';
    marker.style.zIndex = 100000;
    marker.style.top = _position.y + 'px';
    marker.style.left = _position.x + 'px';
    marker.style.background = 'grey';
    marker.style.color = '#FFF';
    marker.style.fontSize = '12px';
    marker.style.padding = '5px';
    marker.textContent = elem.getAttribute(e2eAttr);

    if (!isExists) {
        document.body.appendChild(marker);
    }
}

var highLiteElem = function (elem, event) {
    event.stopPropagation();
    elem.style.border = hoveredStyle;
    addMarker(elem);
};

var unHighLiteElem = function (elem, event) {
    elem.style.border = defaultStyle;
};

function showE2Areas() {
    console.log(`[E2E HELPER] show elements with ${e2eAttr} attribute`);
    let elements = document.querySelectorAll(`[${e2eAttr}]`);
    if (elements.length === 0) {
        console.warn(`[E2E HELPER] no elements with ${e2eAttr} attribute was found!!!`);
        return
    }
    elements.forEach((elem) => {
        elem.style.border = defaultStyle;
        elem.onmouseenter = highLiteElem.bind(null, elem);
        elem.onmouseout = unHighLiteElem.bind(null, elem);
    });
}

function clearE2Areas() {
    console.log(`[E2E HELPER] clear elements with ${e2eAttr} attribute`);
    let elements = document.querySelectorAll(`[${e2eAttr}]`);
    if (elements.length === 0) {
        console.warn(`[E2E HELPER] no elements with ${e2eAttr} attribute was found!!!`);
        return
    }
    elements.forEach((elem) => {
        elem.style.border = 'initial';
        elem.onmouseenter = null;
        elem.onmouseout = null;
    });

    let marker = document.getElementById('e2e-searcher-helper');
    if (marker)
        marker.style.display = 'none';
}

