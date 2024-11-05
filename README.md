#### 1. **Introduction**
   - Brief overview of the repository and its purpose.
   - Importance of memory management in Node.js applications.

---

#### 2. **Background on Memory Management**
   - **Traditional Memory Leaks in Languages like C**  
     - How languages without garbage collection (like C) handle memory.
     - Common pitfalls of manual memory management and how it compares to garbage-collected languages.

---

#### 3. **Understanding Memory Leaks in Node.js**
   - **What is a Memory Leak in Node.js?**  
     - Definition and consequences of memory leaks in JavaScript/Node.js applications.
   
   - **How the Garbage Collector (GC) Works in Node.js**  
     - Explanation of Node.js’s garbage collection process.
     - Concepts of mark-and-sweep, generational garbage collection, and memory retention.

---

#### 4. **Common Causes of Memory Leaks in Node.js**
   - **Uncleared Listeners and Event Emitters**  
     - How event listeners, especially in server-based applications, can lead to memory leaks.
   
   - **Global Variables and Caching**  
     - Risks of caching too much data or keeping references to large objects in global scope.
   
   - **Closures and Function Scopes**  
     - Issues arising from closures and retaining variables longer than needed.
   
   - **Unoptimized Data Structures (e.g., Arrays, Maps)**  
     - Potential for memory leaks due to large, long-lived collections.

---

#### 5. **Using `WeakMap` and FinalizationRegistry to Detect Garbage Collection (GC) Activity**
   - **Introduction to `WeakMap`**  
     - Explanation of how `WeakMap` works in JavaScript.
   
   - **Tracking Object Collection with `WeakMap`**  
     - Using `WeakMap` to see if objects are garbage-collected, providing insight into potential memory leaks.
  - FinalizationRegistry
   
---

#### 6. **Forcing Garbage Collection in Node.js (Manual GC Trigger)**
   - **How to Trigger Garbage Collection in Node.js**  
     - Using the `--expose-gc` flag and calling `global.gc()` for debugging purposes.
   
   - **When and Why to Use Manual GC**  
     - Guidelines for using manual GC for memory testing only, not in production.

---

#### 7. **Using the Snip3 Hunt Method**
   - **Introduction to Snip3 Hunt Methodology**  
     - Brief overview of the “three-snapshot” comparison technique.
   
   - **Taking and Comparing Snapshots**  
     - Step-by-step guide on capturing memory snapshots with Node.js tools (e.g., Chrome DevTools, `node --inspect`).
     - Analyzing and comparing snapshots to isolate memory leaks over time.
   
   - **Example Workflow for Snip3 Hunt**  
     - A simple example to demonstrate the method in practice.

---

#### 8. **Case Study: Jest’s Memory Leak Detection Using `WeakMap`**
   - **How Jest Uses `FinalizationRegistry` for Leak Detection**  
     - Explanation of how Jest leverages `FinalizationRegistry` to detect memory leaks in tests.
   
   - **Applying the secret Jest Approach in Your Code or Tests**  
     - Practical steps to integrate a similar `FinalizationRegistry` strategy for tracking leaks in your own testing setup.

---

#### 9. **Tools and Techniques for Memory Leak Detection**
   - **Node.js Native Tools**  
     - Brief on tools like Chrome DevTools, `node --inspect`, and `node-heapdump`.
   
   - **Additional Utilities**  
     - Mention of tools like `clinic.js`, `memwatch-next`, or any other preferred memory profiling utilities.

---

#### 10. **Best Practices for Preventing Memory Leaks in Node.js**
   - **Guidelines for Managing Event Listeners and Closures**  
   - **Efficient Use of Global Variables and Caches**  
   - **Regularly Profiling and Monitoring Memory Usage**
   - **allways run your jest with --detectLeaks**

---

#### 11. **Conclusion**
   - Recap of key points.
   - Encouragement to incorporate memory management strategies into routine development and testing.
#### Refs
https://jestjs.io/blog/2017/12/18/jest-22#experimental-leak-detection
https://github.com/jestjs/jest/pull/12973
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
https://v8.dev/blog/trash-talk
https://v8.dev/blog/tracing-js-dom

https://nodejs.org/en/learn/diagnostics/memory/using-gc-traces

### relevant
https://dev.to/codux/experiments-with-the-javascript-garbage-collector-2ae3

### memory leak in nodejs
https://github.com/nodejs/node/issues/53335
https://github.com/nodejs/node/blob/main/test/parallel/test-primitive-timer-leak.js#L15
https://github.com/nodejs/node/blob/main/test/common/gc.js

### Research
check if global.gc call minor or mijor gc