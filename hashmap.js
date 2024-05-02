const LinkedList = require('@adharmic/linked_list');
const MapNode = require('./mapnode');

module.exports = class HashMap {

    constructor(max_capacity = 16, load_factor = .75, hash_function) {
        this._buckets = [];
        this._max_capacity = max_capacity;
        this._capacity = 0;
        this._load_factor = load_factor;
        this._hash_function = hash_function;
    }

    get buckets() {
        return this._buckets;
    }

    set buckets(newBuckets) {
        this._buckets = newBuckets;
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

    get hash_function() {
        return this._hash_function;
    }

    set hash_function(newFunc) {
        this._hash_function = newFunc;
    }

    checkIndex(index) {
        if (index < 0 || index >= this.max_capacity) {
            throw new Error("trying to access out of bound index");
        }
    }

    hash(key) {
        let hashCode = 0;

        if (this.hash_function !== undefined) {
            return this.hash_function(key) % this.max_capacity;
        }

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

    get(key) {
        let keyHash = this.hash(key);
        let bucket = this.buckets[keyHash];
        if (bucket === undefined) {
            return null;
        }
        return bucket.traverse((node, index) => {
            if (node.value.key == key) {
                return node.value.value;
            }
            return null;
        });
    }

    has(key) {
        return this.get(key) !== null;
    }

    remove(key) {
        let keyHash = this.hash(key);
        let bucket = this.buckets[keyHash];
        if (bucket === undefined) {
            return false;
        }
        let index = bucket.traverse((node, index) => {
            if (node.value.key == key) {
                return index;
            }
            return null;
        })
        if (index === null) return false;
        bucket.removeAt(index);
        return true;
    }

    length() {
        return this.capacity;
    }

    clear() {
        this.buckets = [];
        this.capacity = 0;
    }

    entries() {
        let entries_arr = [];
        this.buckets.forEach(element => {
            element.traverse((node, index) => {
                entries_arr.push(node.value);
                return null;
            })
        });
        return entries_arr;
    }

    keys() {
        let keys_arr = [];
        this.entries().forEach(element => {
            keys_arr.push(element.key);
        });
        return keys_arr;
    }

    values() {
        let values_arr = [];
        this.entries().forEach(element => {
            values_arr.push(element.value);
        });
        return values_arr;
    }

    checkCapacity() {
        let load = this.capacity / this.max_capacity;
        if (load >= this.load_factor) {
            let entries = this.entries();
            this.clear();
            this.max_capacity *= 2;
            entries.forEach((element) => {
                this.set(element.key, element.value);
            });
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