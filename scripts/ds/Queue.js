import { LLNode } from "./LLNode.js"

class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
    }

    enque(val) {
        if (this.rear == null) {
            this.front = new LLNode(val);
            this.rear = this.front;
            return;
        }
        this.rear.next = new LLNode(val);
        this.rear = this.rear.next;
    }

    Front() {
        if (this.front == null) {
            console.log("error, cannot call front on empty queue");
            return -1;
        }
        return this.front.data;
    }

    deque() {
        if (this.front == null) return;
        this.front = this.front.next;
        if (this.front == null) {
            this.rear = null;
        }
    }

    empty() {
        if (this.front == null)
            return true;
        else
            return false;
    }
}

export { Queue }