#### 1. **Introduction**
   - Brief overview of the repository and its purpose.
   - Importance of memory management in Node.js applications.
   The purpose of this repo is to provide tools and tips to debug and prevent memory leaks in node js

   This repo  will mainly talk about node js But it's also relevant to js On the browser Which is usually less a concern because websites die quite Young And some techniques maybe will apply to other languages as well
   Especially heep snapshots Comparison

   Important note In this readme, sometimes I will simplify things Just because we don't need to To dive To deep into them 
   If you really want to go deep into things I attached list of references the end of this file 

---

#### 2. **What is a memory leak**
I heard somewhere that memory leak
"It's like not checking out of the room when you leave the hotel. The room is there and you are no longer using it, but it wasn't actually freed and other guests can't use it until it is freed."
In low level languages like C Only memory leaks is when you allocate memory
And you forget to release it When it's no longer needed

After John McCarthy invented the garbage collector This is no longer the case since  developers don't need to Allocate or release the memory manualy

What is garbage collector GC?
Garbage collector is a piece of code that responsible to track memory that is not used by the program anymore And reclaim it for Usage of this memory in the future, or Releasing the memory to the operation system


 what the garbage collector consider is memory that the program doesn't need anymore?
  an object a variable or a function Or anything else that consume memory that no one holds a reference to it
  If the program doesn't have a reference to it It means the program cannot use it, and therefore needs to be reclaimed, Which means as long as you have a reference to an object it should never be collected by your garbage collector

  Our job as developers It's very easy(or at least it seems that way) Don't hold reference to Anything that you don't need anymore 

  So what is a memory leak?

  Usually People calling memory leaks to Describe the situation when A program Consumption of memory grows over time 

  When your memory usage graph look Like Warren Buffett investment portfolio Grass looks like 
   
  The problem in this case is very obvious. If you run your program for long enough, you will get out of memory error


---

#### 3. **Understanding Memory Leaks in Node.js**
In order to understand, better memory, leaks, and how to handle them first of all, we need to understand how the garbage collector V8 works
 v8 gc Is responsible Deduction of unused Memory And reuse the memory occupied by dead objects

 The algorithm V8 GC (Orinoco) uses is (The tracing algorithm)[https://en.wikipedia.org/wiki/Tracing_garbage_collection]
 Which basically means In order to know which objects are not in use aka Dead objects and need to be Reclaimed for reuse in the future 
 We trace a set of root objects Every object that is reachable From those root objects Is an object that can be used by the program and therefore a cold alive

 Any other object is a dead object that no one needs anymore

 In a V8, those objects are the stack end global object 
 *** First tip Any object that is attached, directly or indirectly (by his parent or grandparent object) to the global is going to be alive for the entire time of the application, and there for never be released 
Don't attach anything (that you don't actually need) to the global 

Functions in the stack can Hold reference to objects by closure 
If you don't know what closure is, that's the time to go read about that




   
   - **How the Garbage Collector (GC) Works in Node.js**  

   In garbage collection there is an important term: “The Generational Hypothesis”. This basically states that most objects die young. In other words, most objects are allocated and then almost immediately become unreachable, from the perspective of the GC. This holds not only for V8 or JavaScript, but for most dynamic languages.

   Leveraging this fact are two GCs in V8 
     - Minor GC (Scavenger)
     - Major GC (Mark-Compact)Leveraging
    the Scavenger is Quicker And handles only new objects 


    the Major GC Is slower Consume more resources And responsible for the entire heep

the Minor GC runs more often then the majro gc
    
v8 will promote objects, not garbage collected after two Scavenge operations to the old space.
```
        young generation         |   old generation
                                 |
  nursery     |  intermediate    |
              |                  |
 +--------+   |     +--------+   |     +--------+
 | object |---GC--->| object |---GC--->| object |
 +--------+   |     +--------+   |     +--------+
              |                  |
```




---

#### 4. **Common Causes of Memory Leaks in Node.js**
   - **Uncleared Listeners and Event Emitters**  
     - Every listenr there in JavaScript is a potential memory leak As long as you don't clear the listener All the objects hold reference by closure And all the objects they are referencing to Will not be collected 

Best practice

Every time you write a listener Also write the code that clear is this listener when it's no longer needed 

Currently the listen, Eric, and all the reference to Some small object
But in the future, someone can attach to this object, bigger object, and you're fucked
   
   - **Global Variables and Caching**  
     - Risks of caching too much data or keeping references to large objects in global scope.
   
   - **Closures and Function Scopes**  
     - Issues arising from closures and retaining variables longer than needed.
   

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
heepdumb analysis Will not help you to find
 where you have a memory leak in the code rether to find what is leaking

The biggest problem In heepdump comparison In memory leak detection
Is to get rid of the noise
Anyone that tried To debug memory leak with heep dump in real app knows that It's very hard to find what is leaking
Before we even talking About finding where it's leaking

For some reason A lot of Memory leaks advisers say that you need to Create a snapshot when that location is up run the application For a long time Then create another snapshot
compere those snapshots and try to find Biggest objects that are leaking

This method only works for a very simple example
To give simple example of cold in the memory comparison

But in the real world
When you're a little look like this

And you're gonna look like this

And then after running your app for a few days to try to "trigger" The memory leak, that's where you end up with 

Usually, that's the point, where developers Come with Genius, ideas like
Let's just restart the server after every 10 calls You can even configure Kubernetes's to do that for you




I have a better idea hopefully
Let's look how memories are alocated For the lifetime of our Application




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
   Always use the function names
   Trying not to use at all anonymous function Because if any time in the future you will need to use cpu Profiler or memory Profiler, the only thing you will see is anonymous -> anonymous -> fuckmylife -> anonymous
   If you Will use classes. Instead of anonymous objects. It will be much easier to track memory lakes in the future. 

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
check if global.gc call minor or Major gc