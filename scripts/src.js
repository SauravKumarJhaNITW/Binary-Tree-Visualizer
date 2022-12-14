import { Queue } from './ds/Queue.js';
import { TreeNode } from './ds/TreeNode.js';


let root = null;
let selectedNode = null;
let selectedNodeId;
let mapping = [];
let maxCharLen = 1;

const height = (cur) => {
    if (cur == null) return -1;
    return 1 + Math.max(height(cur.left), height(cur.right))
}

const renderTree = () => {
    document.getElementById('drawing-area').innerHTML = ""
    let cur = [root, 0, 0];
    const ht = height(root);
    if (ht == -1) return;
    let q = new Queue();
    q.enque(cur);
    let level = 0;
    const highest_width_of_circle = 20 + 8 * (maxCharLen - 1);
    const unit_separation = 1 * highest_width_of_circle;
    while (!q.empty()) {
        cur = q.Front();
        q.deque();

        if (cur[0].left != null)
            q.enque([cur[0].left, cur[1] + 1, cur[2] - Math.pow(2, ht - level)]);
        if (cur[0].right != null)
            q.enque([cur[0].right, cur[1] + 1, cur[2] + Math.pow(2, ht - level)]);

        if (cur[1] == level) {
            document.getElementById('drawing-area').appendChild(getTreeLevelDiv(cur[1]));
            level++;
        }

        const ele = getNodeCircle(cur[0], cur[2] * unit_separation);
        document.getElementById('tree-level-' + cur[1]).appendChild(ele);
    }
    adjustSelectedNodeView();
    adjustBtnsVisibility();
}

const getTreeLevelDiv = (level) => {
    const ele = document.createElement('div');
    ele.id = "tree-level-" + level;
    ele.classList.add("tree-level"); //define align center style for this div
    return ele;
}

const insert = (val, left, right) => {
    if (val && val.length > maxCharLen) maxCharLen = val.length;
    let t = null;
    if (root == null) {
        t = new TreeNode(val);
        root = t;
    } else if (selectedNode && left && (!selectedNode.left)) {
        t = new TreeNode(val);
        selectedNode.left = t;
    } else if (selectedNode && right && (!selectedNode.right)) {
        t = new TreeNode(val);
        selectedNode.right = t;
    }
    return t;
}

//first create node in tree, then getCircle
const getNodeCircle = (node, displacement_from_left) => {
    const ind = mapping.findIndex(ele => ele === node);
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.textContent = node.data;
    circle.addEventListener('click', nodeSelectionHandler);
    circle.style.cursor = 'pointer'
    circle.style.left = displacement_from_left + 'px';
    circle.id = ind;
    return circle;
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

const showssbtn = () => {
    document.getElementById('s-shot').style.display = 'inline';
}

document.getElementById('insert-root').addEventListener('click', (e) => {
    const inpEle = document.getElementById('dataVal')
    const val = inpEle.value;
    if (!validateValue(val)) return;
    let t = insert(val, false, false);
    if (t == null) return;
    mapping.push(t);
    renderTree();
    inpEle.value = '';
    adjustBtnsVisibility();
    showHint();
    showssbtn();
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
    renderTree();
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
    renderTree();
    inpEle.value = ''
    adjustBtnsVisibility();
})

document.getElementById('s-shot').addEventListener('click', (e) => {
    getScreenShot();
})

document.getElementById('clear-selection').addEventListener('click', (e) => {
    clearSelection();
})

const adjustBtnsVisibility = () => {
    let s = document.getElementById('insert-root'),
        l = document.getElementById('insert-left'),
        r = document.getElementById('insert-right'),
        cls = document.getElementById('clear-selection');
    s.style.display = 'none';
    l.style.display = 'none';
    r.style.display = 'none';
    cls.style.display = 'none';
    if (root == null) {
        s.style.display = 'inline';
    } else if (selectedNode) {
        cls.style.display = 'inline';
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
    adjustBtnsVisibility();
}

const adjustSelectedNodeView = () => {
    if (selectedNodeId) {
        document.getElementById(selectedNodeId).classList.add('selected-circle');
    }
}

const nodeSelectionHandler = (e) => {
    clearSelection();
    e.target.classList.add('selected-circle');
    selectedNode = mapping[e.target.id];
    selectedNodeId = e.target.id;
    adjustBtnsVisibility();
    hideErr();
}

const getScreenShot = () => {
    let c = document.getElementById('drawing-area');
    html2canvas(c).then((canvas) => {
        var t = canvas.toDataURL().replace("data:image/png;base64,", "");
        downloadBase64File('image/png', t, 'image');
    })
}

const downloadBase64File = (contentType, base64Data, fileName) => {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}