const readFile = require('../read');

class Node {
  constructor(value, parent = null) {
    this.parent = parent;
    this.value = value;
    this.children = [];
  }
  addChild(value) {
    this.children.push(new Node(value, this));
  }
  addChildNode(node) {
    node.parent = this;
    this.children.push(node);
  }
  find(value) {
    if (value === this.value) {
      return this;
    }
    for (let c of this.children) {
      const f = c.find(value);
      if (f) {
        return f;
      }
    }
    return null;
  }
  checksum() {
    const goThrough = (node, depth) => {
      return node.children.reduce((acc, c) => acc + goThrough(c, depth + 1), depth);
    };
    return goThrough(this, 0);
  }
}

const split = el => {
  const s = el.split(')');
  return {parent: s[0], child: s[1]};
};

const createTree = graph => {
  const n = new Node('1');
  n.addChild('2');
  n.addChild('3');
  n.children[1].addChild('4');
  n.children[1].children[0].addChild('5');

  const first = split(graph.shift());

  const roots = [new Node(first.parent)];
  roots[0].addChild(first.child);

  const findParent = value => {
    for (let r of roots) {
      const n = r.find(value);
      if (n) {
        return n;
      }
    }
    return null;
  };

  const findParentRoot = root => {
    for (let r of roots) {
      const n = r.find(root.value);
      if (n && n !== root) {
        return n;
      }
    }
    return null;
  };

  for (let e of graph) {
    const {parent, child} = split(e);
    const n = findParent(parent);
    if (n) {
      n.addChild(child);
    } else {
      const r = new Node(parent);
      r.addChild(child);
      roots.push(r);
    }
  }

  let fixed = [];
  for (let r of roots) {
    const parent = findParentRoot(r);

    if (parent) {
      for (let c of r.children) {
        parent.addChildNode(c);
      }
    } else {
      fixed.push(r);
    }
  }
  return fixed[0];
};

var mapA = `B)C
C)D
D)E
E)F
B)G
G)H
COM)B
D)I
E)J
J)K
K)L`.split('\n');

const checksum = map => {
  const tree = createTree(map);
  return tree.checksum();
};

async function runA() {
  const input = await readFile('input');
  console.log(checksum(mapA) === 42);
  console.log(checksum(input) === 253104);
}

//runA();

var mapB = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`.split('\n');

const up = node => {
  if (node.parent) {
    return [node, ...up(node.parent)];
  }
  return [node];
};

const getChain = (tree, start) => {
  const startNode = tree.find(start);
  if (startNode) {
    return up(startNode).map(n => n.value);
  }
};

const distance = (map, from, to) => {
  const tree = createTree(map);

  const fromChain = getChain(tree, from);

  const toChain = getChain(tree, to);

  for (let i = 0; i < fromChain.length; i++) {
    const match = toChain.indexOf(fromChain[i]);
    if (match > -1) {
      return match - 1 + i - 1;
    }
  }
};

async function runB() {
  const input = await readFile('input');
  console.log(distance(mapB, 'YOU', 'SAN'));
  console.log(distance(input, 'YOU', 'SAN'));
}

runB();
