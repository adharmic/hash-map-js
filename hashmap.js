const LinkedList = require('@adharmic/linked_list');
const MapNode = require('./mapnode');

module.exports = class HashMap {

    constructor(max_capacity = 16, load_factor = .75) {
        this._buckets = [];
        this._max_capacity = max_capacity;
        this._capacity = 0;
        this._load_factor = load_factor;
    }

    get buckets() {
        return this._buckets;
    }

    get max_capacity() {
        return this._max_capacity;
    }

    set max_capacity(newMax) {
        this._max_capacity = newMax;
    }

    get load_factor() {
        return this._load_factor;
    }

    get capacity() {
        return this._capacity;
    } 

    set capacity(newCapacity) {
        this._capacity = newCapacity;
    }

    checkIndex(index) {
        if (index < 0 || index >= this.max_capacity) {
            throw new Error("trying to access out of bound index");
        }
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode %= this.max_capacity;
        }

        return hashCode;
    }

    set(key, value) {
        let keyHash = this.hash(key);
        let bucket = this.buckets[keyHash];
        let hashNode = new MapNode(key, value);
        if (bucket === undefined) {
            this.buckets[keyHash] = new LinkedList(hashNode, null);
        }
        else {
            let search = bucket.traverse((node, index) => {
                if (node.value.key == key) {
                    node.value = hashNode;
                    return node;
                }
                return null;
            })
            if (search === null) bucket.append(hashNode);
        }
        this.capacity++;
        this.checkCapacity();
    }

    checkCapacity() {
        let load = this.capacity / this.max_capacity;
        if (load > this.load_factor) {
            // Resizing time

        }
    }

    toString() {
        let str = "{";
        this.buckets.forEach(element => {
            str += "\n  " + element.toString();
        });
        return str + "\n}";
    }
}