class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

let root = null;
let selectedNode = null;
let selectedNodeId;
let maxId = 0
let mapping = [];

const render = () => {

}

const insert = (val, left, right) => {
    let t = null;
    if (root == null) {
        t = new Node(val);
        root = t;
    } else if (selectedNode && left && (!selectedNode.left)) {
        t = new Node(val);
        selectedNode.left = t;
    } else if (selectedNode && right && (!selectedNode.right)) {
        t = new Node(val);
        selectedNode.right = t;
    }
    return t;
}

const getNodeCircle = (val) => {
    const node = document.createElement('div');
    node.classList.add('circle')
    node.textContent = val;
    node.addEventListener('click', nodeSelectionHandler);
    node.style.cursor = 'pointer'
    node.id = maxId++;
    return node;
}

const validateValue = (val) => {
    if (val === '') {
        showErr('Value must not be empty')
        return false
    } else {
        hideErr();
        return true;
    }
}

const showHint = () => {
    document.getElementById('hint').style.display = 'block'
}

const showErr = (msg) => {
    const err = document.getElementById('errMsg');
    err.textContent = msg
    err.style.display = 'block'
}

const hideErr = () => {
    const err = document.getElementById('errMsg');
    err.textContent = ''
    err.style.display = 'none'
}

document.getElementById('insert-root').addEventListener('click', (e) => {
    const inpEle = document.getElementById('dataVal')
    const val = inpEle.value;
    if (!validateValue(val)) return;
    let t = insert(val, false, false);
    if (t == null) return;
    mapping.push(t);
    document.getElementById('drawing-area').appendChild(getNodeCircle(val)); // to be replaced later by render function
    inpEle.value = '';
    adjustBtnsVisibility();
    showHint();
})

document.getElementById('insert-left').addEventListener('click', (e) => {
    if (selectedNode == null) {
        showErr("Click on a node to insert it's child")
        return;
    } else {
        hideErr();
    }
    const inpEle = document.getElementById('dataVal');
    const val = inpEle.value;
    if (!validateValue(val)) return;
    let t = insert(val, true, false);
    if (t == null) return;
    mapping.push(t);
    document.getElementById('drawing-area').appendChild(getNodeCircle(val)); // to be replaced later by render function
    inpEle.value = ''
    adjustBtnsVisibility();
})

document.getElementById('insert-right').addEventListener('click', (e) => {
    if (selectedNode == null) {
        showErr("Click on a node to insert it's child")
        return;
    } else {
        hideErr();
    }
    const inpEle = document.getElementById('dataVal');
    const val = inpEle.value;
    if (!validateValue(val)) return;
    let t = insert(val, false, true);
    if (t == null) return;
    mapping.push(t);
    document.getElementById('drawing-area').appendChild(getNodeCircle(val)); // to be replaced later by render function
    inpEle.value = ''
    adjustBtnsVisibility();
})

const adjustBtnsVisibility = () => {
    let s = document.getElementById('insert-root'),
        l = document.getElementById('insert-left'),
        r = document.getElementById('insert-right');
    s.style.display = 'none';
    l.style.display = 'none';
    r.style.display = 'none';
    if (root == null) {
        s.style.display = 'inline';
    } else if (selectedNode) {
        if (!(selectedNode.right))
            r.style.display = 'inline';
        if (!(selectedNode.left))
            l.style.display = 'inline';
    }
}

const clearSelection = () => {
    if (selectedNode) document.getElementById(selectedNodeId).classList.remove('selected-circle');
    selectedNode = null;
    selectedNodeId = null;
}

const nodeSelectionHandler = (e) => {
    clearSelection();
    e.target.classList.add('selected-circle');
    selectedNode = mapping[e.target.id];
    selectedNodeId = e.target.id;
    adjustBtnsVisibility();
    hideErr();
}