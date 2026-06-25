/**
 * MockGenerativeAI — Intelligent educational mock with a real question bank.
 * Returns technology-specific, diverse MCQ questions with random selection.
 */

// ─────────────────────────────────────────────
// QUESTION BANK: 20+ technologies, 10+ Q each
// ─────────────────────────────────────────────
interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const QUESTION_BANK: Record<string, Question[]> = {
  java: [
    {
      questionText: "What is the output of: System.out.println(10 / 3); in Java?",
      options: ["3.33", "3", "3.0", "Compilation error"],
      correctAnswerIndex: 1,
      explanation: "Integer division in Java truncates the decimal. 10 / 3 = 3."
    },
    {
      questionText: "Which keyword is used to prevent method overriding in Java?",
      options: ["static", "abstract", "final", "private"],
      correctAnswerIndex: 2,
      explanation: "The 'final' keyword on a method prevents it from being overridden in subclasses."
    },
    {
      questionText: "What does JVM stand for?",
      options: ["Java Virtual Memory", "Java Virtual Machine", "Java Verified Module", "Java Variable Method"],
      correctAnswerIndex: 1,
      explanation: "JVM stands for Java Virtual Machine, which runs Java bytecode."
    },
    {
      questionText: "Which collection class allows null keys in Java?",
      options: ["Hashtable", "TreeMap", "HashMap", "ConcurrentHashMap"],
      correctAnswerIndex: 2,
      explanation: "HashMap allows one null key and multiple null values, unlike Hashtable."
    },
    {
      questionText: "What is the default value of an int array element in Java?",
      options: ["null", "undefined", "0", "-1"],
      correctAnswerIndex: 2,
      explanation: "Primitive int arrays are initialized to 0 by default in Java."
    },
    {
      questionText: "Which Java interface must be implemented to sort objects using Collections.sort()?",
      options: ["Comparable", "Comparator", "Serializable", "Iterable"],
      correctAnswerIndex: 0,
      explanation: "Implementing Comparable and overriding compareTo() allows natural ordering via Collections.sort()."
    },
    {
      questionText: "What is the purpose of the 'transient' keyword in Java?",
      options: ["To make a variable thread-safe", "To skip serialization of a field", "To declare a constant", "To mark a class as abstract"],
      correctAnswerIndex: 1,
      explanation: "Transient fields are not included during Java object serialization."
    },
    {
      questionText: "Which of the following is NOT a valid Java access modifier?",
      options: ["public", "private", "internal", "protected"],
      correctAnswerIndex: 2,
      explanation: "'internal' is a C# access modifier; Java uses public, private, protected, and package-private (default)."
    },
    {
      questionText: "What is autoboxing in Java?",
      options: ["Converting a String to int", "Automatic conversion between primitives and wrapper classes", "Creating objects with new keyword", "Using generics in collections"],
      correctAnswerIndex: 1,
      explanation: "Autoboxing is the automatic conversion between primitive types (int) and their wrapper classes (Integer)."
    },
    {
      questionText: "Which Java keyword is used to create an instance of a class?",
      options: ["create", "instantiate", "new", "class"],
      correctAnswerIndex: 2,
      explanation: "The 'new' keyword allocates memory and creates a new object instance in Java."
    },
    {
      questionText: "What is the difference between == and .equals() in Java?",
      options: ["No difference", "== checks reference equality; .equals() checks value equality", "== checks value; .equals() checks type", ".equals() works only with primitives"],
      correctAnswerIndex: 1,
      explanation: "== compares object references (memory address); .equals() compares logical content/value."
    },
    {
      questionText: "Which exception is thrown when dividing by zero with integers in Java?",
      options: ["NullPointerException", "ArithmeticException", "RuntimeException", "NumberFormatException"],
      correctAnswerIndex: 1,
      explanation: "Integer division by zero throws ArithmeticException: / by zero."
    }
  ],

  python: [
    {
      questionText: "What is the output of: print(type([])) in Python?",
      options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"],
      correctAnswerIndex: 1,
      explanation: "[] creates an empty list; type([]) returns <class 'list'>."
    },
    {
      questionText: "Which keyword is used to define a generator function in Python?",
      options: ["return", "async", "yield", "generate"],
      correctAnswerIndex: 2,
      explanation: "The 'yield' keyword makes a function a generator that produces values lazily."
    },
    {
      questionText: "What does the '__init__' method do in a Python class?",
      options: ["Destroys the object", "Initializes the object's attributes", "Imports a module", "Defines a static method"],
      correctAnswerIndex: 1,
      explanation: "__init__ is the constructor method called when a new object is created."
    },
    {
      questionText: "Which of these Python data types is IMMUTABLE?",
      options: ["list", "dict", "set", "tuple"],
      correctAnswerIndex: 3,
      explanation: "Tuples are immutable — their elements cannot be changed after creation."
    },
    {
      questionText: "What does the 'lambda' keyword create in Python?",
      options: ["A class method", "An anonymous function", "A module import", "A loop"],
      correctAnswerIndex: 1,
      explanation: "lambda creates a small, anonymous function: lambda x: x * 2."
    },
    {
      questionText: "What is the output of: print(2 ** 3) in Python?",
      options: ["6", "8", "9", "5"],
      correctAnswerIndex: 1,
      explanation: "** is the exponentiation operator. 2 ** 3 = 2³ = 8."
    },
    {
      questionText: "How do you open a file in write mode in Python?",
      options: ["open('file.txt', 'r')", "open('file.txt', 'w')", "open('file.txt', 'a')", "open('file.txt', 'x')"],
      correctAnswerIndex: 1,
      explanation: "'w' mode opens the file for writing, creating it if not exists and truncating if it does."
    },
    {
      questionText: "Which Python module is used for regular expressions?",
      options: ["regex", "re", "regexp", "pattern"],
      correctAnswerIndex: 1,
      explanation: "The built-in 're' module provides regular expression support in Python."
    },
    {
      questionText: "What is a list comprehension in Python?",
      options: ["A way to document lists", "A concise syntax to create lists from iterables", "A method to sort lists", "A way to copy lists"],
      correctAnswerIndex: 1,
      explanation: "Example: [x*2 for x in range(5)] creates [0,2,4,6,8] concisely."
    },
    {
      questionText: "What does 'pip' stand for in Python?",
      options: ["Python Installation Package", "Pip Installs Packages", "Python Import Protocol", "Package Index Protocol"],
      correctAnswerIndex: 1,
      explanation: "pip is a recursive acronym meaning 'Pip Installs Packages'."
    },
    {
      questionText: "Which built-in function converts a string to an integer in Python?",
      options: ["toInt()", "int()", "convert()", "parse()"],
      correctAnswerIndex: 1,
      explanation: "int('42') converts the string '42' to the integer 42."
    },
    {
      questionText: "What does the 'self' parameter represent in a Python class method?",
      options: ["The class itself", "The current instance of the class", "A static reference", "The parent class"],
      correctAnswerIndex: 1,
      explanation: "'self' refers to the instance calling the method, giving access to its attributes."
    }
  ],

  javascript: [
    {
      questionText: "What is the output of: console.log(typeof null) in JavaScript?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      correctAnswerIndex: 2,
      explanation: "typeof null returns 'object' — a well-known legacy bug in JavaScript."
    },
    {
      questionText: "Which method removes the last element from a JavaScript array?",
      options: ["shift()", "unshift()", "pop()", "splice()"],
      correctAnswerIndex: 2,
      explanation: "pop() removes and returns the last element of an array."
    },
    {
      questionText: "What does '===' check in JavaScript?",
      options: ["Value only", "Type only", "Both value and type", "Object reference"],
      correctAnswerIndex: 2,
      explanation: "=== is strict equality — it checks both value AND type without type coercion."
    },
    {
      questionText: "What is a closure in JavaScript?",
      options: ["A way to end a function", "A function that remembers its outer scope variables", "An error handling mechanism", "A class constructor"],
      correctAnswerIndex: 1,
      explanation: "A closure is a function that retains access to variables from its enclosing lexical scope."
    },
    {
      questionText: "Which keyword declares a block-scoped variable in modern JavaScript?",
      options: ["var", "let", "function", "scope"],
      correctAnswerIndex: 1,
      explanation: "'let' and 'const' are block-scoped; 'var' is function-scoped."
    },
    {
      questionText: "What does the Promise.all() method do?",
      options: ["Runs promises sequentially", "Returns first resolved promise", "Waits for all promises to resolve, fails if any reject", "Ignores rejected promises"],
      correctAnswerIndex: 2,
      explanation: "Promise.all() resolves when all promises resolve, or rejects if any single promise rejects."
    },
    {
      questionText: "What is event bubbling in JavaScript?",
      options: ["Creating multiple events", "An event propagating from child to parent elements", "An event triggered by hover", "A method to stop events"],
      correctAnswerIndex: 1,
      explanation: "Event bubbling: when an event fires on a child, it propagates up through parent elements."
    },
    {
      questionText: "What does JSON.stringify() do?",
      options: ["Parses JSON string to object", "Converts JavaScript object to JSON string", "Validates JSON format", "Sends JSON to server"],
      correctAnswerIndex: 1,
      explanation: "JSON.stringify() serializes a JavaScript object into a JSON-formatted string."
    },
    {
      questionText: "Which array method creates a new array with all elements that pass a test?",
      options: ["map()", "reduce()", "filter()", "forEach()"],
      correctAnswerIndex: 2,
      explanation: "filter() returns a new array with only elements that satisfy the provided condition."
    },
    {
      questionText: "What is the output of: console.log(0.1 + 0.2 === 0.3) in JavaScript?",
      options: ["true", "false", "undefined", "NaN"],
      correctAnswerIndex: 1,
      explanation: "false — floating-point precision makes 0.1+0.2 = 0.30000000000000004, not exactly 0.3."
    },
    {
      questionText: "What does 'async/await' do in JavaScript?",
      options: ["Creates synchronous code only", "Provides syntactic sugar for working with Promises", "Prevents execution delays", "Runs code in parallel automatically"],
      correctAnswerIndex: 1,
      explanation: "async/await lets you write asynchronous Promise-based code in a synchronous-looking style."
    }
  ],

  react: [
    {
      questionText: "What hook is used to manage local state in a React functional component?",
      options: ["useEffect", "useContext", "useState", "useReducer"],
      correctAnswerIndex: 2,
      explanation: "useState returns a state variable and a setter function for local component state."
    },
    {
      questionText: "What is the Virtual DOM in React?",
      options: ["A server-side database", "A lightweight in-memory copy of the real DOM", "A CSS styling engine", "A testing framework"],
      correctAnswerIndex: 1,
      explanation: "React's Virtual DOM is a JS object representation of the real DOM, used for efficient diffing and updates."
    },
    {
      questionText: "When does useEffect run with an empty dependency array []?",
      options: ["Every render", "Only on unmount", "Only once after the initial render", "Never"],
      correctAnswerIndex: 2,
      explanation: "useEffect with [] runs only once after the first render, like componentDidMount."
    },
    {
      questionText: "What is JSX in React?",
      options: ["A JavaScript library", "A database query language", "A syntax extension allowing HTML-like code in JavaScript", "A CSS preprocessor"],
      correctAnswerIndex: 2,
      explanation: "JSX lets you write HTML-like syntax inside JS, which Babel transpiles to React.createElement() calls."
    },
    {
      questionText: "What is prop drilling in React?",
      options: ["A debugging technique", "Passing props through multiple nested components unnecessarily", "A performance optimization", "A type of React hook"],
      correctAnswerIndex: 1,
      explanation: "Prop drilling means passing data through many component layers even if intermediate components don't use it."
    },
    {
      questionText: "Which React hook is used for side effects like API calls?",
      options: ["useState", "useCallback", "useEffect", "useMemo"],
      correctAnswerIndex: 2,
      explanation: "useEffect is designed for side effects: fetching data, subscriptions, DOM manipulation."
    },
    {
      questionText: "What is the purpose of React.memo()?",
      options: ["To store data in memory", "To memoize a component and prevent unnecessary re-renders", "To create ref objects", "To manage context"],
      correctAnswerIndex: 1,
      explanation: "React.memo() wraps a component and only re-renders it if its props have changed."
    },
    {
      questionText: "In React, what is the correct way to render a list of items?",
      options: ["Using a for loop inside JSX", "Using array.map() with a unique key prop", "Using array.forEach()", "Using while loop"],
      correctAnswerIndex: 1,
      explanation: "array.map() with a unique 'key' prop is the standard React pattern for rendering lists."
    },
    {
      questionText: "What does the useContext hook do?",
      options: ["Creates context", "Subscribes a component to a React context value", "Provides routing", "Manages global state"],
      correctAnswerIndex: 1,
      explanation: "useContext lets a component consume a Context value without prop drilling."
    },
    {
      questionText: "What is a controlled component in React?",
      options: ["A component with no props", "A component whose form input value is controlled by React state", "A component wrapped by a HOC", "A class component"],
      correctAnswerIndex: 1,
      explanation: "In controlled components, form data is handled by React state via onChange and value props."
    }
  ],

  css: [
    {
      questionText: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
      correctAnswerIndex: 1,
      explanation: "CSS stands for Cascading Style Sheets — used for styling HTML elements."
    },
    {
      questionText: "Which CSS property controls the text size?",
      options: ["text-size", "font-style", "font-size", "text-scale"],
      correctAnswerIndex: 2,
      explanation: "font-size sets the size of the font, in px, em, rem, %, etc."
    },
    {
      questionText: "What is the CSS Box Model made up of?",
      options: ["content, padding, border, margin", "width, height, color, font", "display, position, float, clear", "top, right, bottom, left"],
      correctAnswerIndex: 0,
      explanation: "The Box Model: content → padding → border → margin, from inside out."
    },
    {
      questionText: "Which value of 'position' takes an element out of normal document flow relative to the viewport?",
      options: ["relative", "absolute", "static", "fixed"],
      correctAnswerIndex: 3,
      explanation: "position: fixed positions an element relative to the browser window, not the document."
    },
    {
      questionText: "What does z-index control in CSS?",
      options: ["Zoom level of elements", "The stacking order of positioned elements", "Element transparency", "Z-axis rotation"],
      correctAnswerIndex: 1,
      explanation: "z-index controls which positioned element appears on top when elements overlap."
    },
    {
      questionText: "Which CSS flexbox property aligns items along the cross axis?",
      options: ["justify-content", "align-items", "flex-direction", "flex-wrap"],
      correctAnswerIndex: 1,
      explanation: "align-items aligns flex items along the cross axis (perpendicular to main axis)."
    },
    {
      questionText: "What is the specificity order of CSS selectors from lowest to highest?",
      options: ["element, class, ID, inline", "inline, ID, class, element", "class, element, inline, ID", "ID, class, element, inline"],
      correctAnswerIndex: 0,
      explanation: "Specificity order: element (0,0,1) < class (0,1,0) < ID (1,0,0) < inline styles."
    },
    {
      questionText: "What does 'display: flex' do?",
      options: ["Makes element invisible", "Creates a block-level flex container", "Floats the element", "Removes the element from the DOM"],
      correctAnswerIndex: 1,
      explanation: "display: flex makes an element a flex container, enabling flexbox layout for its children."
    },
    {
      questionText: "Which CSS property adds space inside an element's border?",
      options: ["margin", "spacing", "padding", "border-spacing"],
      correctAnswerIndex: 2,
      explanation: "padding adds space between the element's content and its border."
    },
    {
      questionText: "What does 'em' unit refer to in CSS?",
      options: ["The viewport width", "The font-size of the root element", "The font-size of the parent element", "Exact pixels"],
      correctAnswerIndex: 2,
      explanation: "em is relative to the font-size of the element's own parent element."
    }
  ],

  html: [
    {
      questionText: "Which HTML tag is used to define an internal style sheet?",
      options: ["<css>", "<style>", "<script>", "<link>"],
      correctAnswerIndex: 1,
      explanation: "The <style> tag defines CSS styles directly within the HTML <head> section."
    },
    {
      questionText: "What does the 'alt' attribute in <img> do?",
      options: ["Sets image alignment", "Defines image height", "Provides alternative text if image fails to load", "Links to another image"],
      correctAnswerIndex: 2,
      explanation: "alt text is displayed when an image can't load and is essential for accessibility."
    },
    {
      questionText: "Which HTML element is used for the largest heading?",
      options: ["<h6>", "<h1>", "<heading>", "<title>"],
      correctAnswerIndex: 1,
      explanation: "<h1> is the largest and most important heading, used once per page for SEO."
    },
    {
      questionText: "What is the purpose of the <meta charset='UTF-8'> tag?",
      options: ["Sets page language", "Specifies the character encoding for the HTML document", "Links CSS file", "Defines viewport"],
      correctAnswerIndex: 1,
      explanation: "charset='UTF-8' tells browsers how to encode/decode characters in the document."
    },
    {
      questionText: "Which attribute makes a form input required before submission?",
      options: ["mandatory", "validate", "required", "must"],
      correctAnswerIndex: 2,
      explanation: "The required attribute prevents form submission if the field is empty."
    },
    {
      questionText: "What does the HTML <canvas> element do?",
      options: ["Displays video content", "Provides a drawing surface for 2D graphics via JavaScript", "Creates a table layout", "Embeds external content"],
      correctAnswerIndex: 1,
      explanation: "<canvas> provides a pixel-based drawing surface, used with the Canvas API via JavaScript."
    },
    {
      questionText: "Which tag defines a hyperlink in HTML?",
      options: ["<link>", "<href>", "<a>", "<url>"],
      correctAnswerIndex: 2,
      explanation: "The <a> (anchor) tag creates hyperlinks using the href attribute."
    },
    {
      questionText: "What is semantic HTML?",
      options: ["HTML with inline styles", "Using HTML elements that convey meaning about their content", "HTML without CSS", "Minified HTML code"],
      correctAnswerIndex: 1,
      explanation: "Semantic elements like <header>, <nav>, <main>, <article> describe the purpose of content."
    },
    {
      questionText: "Which input type is used for date selection in HTML5?",
      options: ["type='calendar'", "type='datetime'", "type='date'", "type='picker'"],
      correctAnswerIndex: 2,
      explanation: "<input type='date'> renders a native date picker in supporting browsers."
    },
    {
      questionText: "What does the 'viewport' meta tag control?",
      options: ["Page background color", "How the page scales on mobile devices", "The page title", "Font loading"],
      correctAnswerIndex: 1,
      explanation: "<meta name='viewport'> controls layout scaling on mobile, crucial for responsive design."
    }
  ],

  sql: [
    {
      questionText: "Which SQL clause filters records AFTER grouping?",
      options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
      correctAnswerIndex: 1,
      explanation: "HAVING filters groups after GROUP BY; WHERE filters rows before grouping."
    },
    {
      questionText: "What does the SQL INNER JOIN return?",
      options: ["All rows from both tables", "Only matching rows from both tables", "All rows from left table", "All rows from right table"],
      correctAnswerIndex: 1,
      explanation: "INNER JOIN returns only rows where there is a match in both joined tables."
    },
    {
      questionText: "Which SQL command is used to remove all rows from a table without logging individual row deletions?",
      options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
      correctAnswerIndex: 2,
      explanation: "TRUNCATE removes all rows quickly without logging individual deletions; DROP removes the table itself."
    },
    {
      questionText: "What does the GROUP BY clause do in SQL?",
      options: ["Sorts records", "Groups rows with the same values for aggregate functions", "Joins tables", "Filters results"],
      correctAnswerIndex: 1,
      explanation: "GROUP BY groups rows sharing a common value, typically used with COUNT, SUM, AVG, etc."
    },
    {
      questionText: "Which SQL aggregate function counts the number of rows?",
      options: ["SUM()", "AVG()", "COUNT()", "MAX()"],
      correctAnswerIndex: 2,
      explanation: "COUNT(*) counts all rows; COUNT(column) counts non-null values in that column."
    },
    {
      questionText: "What is a PRIMARY KEY in SQL?",
      options: ["A foreign key reference", "A unique, non-null identifier for each row in a table", "An index on multiple columns", "An encrypted column"],
      correctAnswerIndex: 1,
      explanation: "PRIMARY KEY uniquely identifies each row; it cannot be NULL and must be unique."
    },
    {
      questionText: "Which SQL keyword is used to avoid duplicate rows in results?",
      options: ["UNIQUE", "DISTINCT", "DIFFERENT", "FILTER"],
      correctAnswerIndex: 1,
      explanation: "SELECT DISTINCT returns only unique rows, removing duplicates."
    },
    {
      questionText: "What does a LEFT JOIN return in SQL?",
      options: ["Only matching rows", "All rows from left table and matching rows from right table", "All rows from right table only", "All rows from both tables"],
      correctAnswerIndex: 1,
      explanation: "LEFT JOIN returns all rows from the left table; NULLs fill unmatched columns from right table."
    },
    {
      questionText: "Which SQL statement is used to create a new table?",
      options: ["NEW TABLE", "ADD TABLE", "CREATE TABLE", "MAKE TABLE"],
      correctAnswerIndex: 2,
      explanation: "CREATE TABLE defines a new table with specified columns and constraints."
    },
    {
      questionText: "What is an index in a SQL database used for?",
      options: ["To store backup data", "To speed up data retrieval queries", "To encrypt data", "To define relationships"],
      correctAnswerIndex: 1,
      explanation: "Indexes improve query performance by allowing the database to find rows faster without full table scans."
    }
  ],

  "data structures": [
    {
      questionText: "What is the time complexity of accessing an element in an array by index?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswerIndex: 2,
      explanation: "Array index access is O(1) — constant time, since memory address is calculated directly."
    },
    {
      questionText: "Which data structure follows LIFO (Last In, First Out) order?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswerIndex: 1,
      explanation: "A Stack follows LIFO — the last item pushed is the first popped (like a stack of plates)."
    },
    {
      questionText: "What is the worst-case time complexity of Binary Search?",
      options: ["O(1)", "O(n)", "O(n log n)", "O(log n)"],
      correctAnswerIndex: 3,
      explanation: "Binary search halves the search space each step, giving O(log n) worst-case complexity."
    },
    {
      questionText: "Which traversal visits left subtree, root, then right subtree in a binary tree?",
      options: ["Pre-order", "Post-order", "In-order", "Level-order"],
      correctAnswerIndex: 2,
      explanation: "In-order traversal (Left → Root → Right) produces sorted output for Binary Search Trees."
    },
    {
      questionText: "What is a Hash Table's average time complexity for search?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswerIndex: 2,
      explanation: "Hash tables provide O(1) average-case search by computing a hash to find bucket directly."
    },
    {
      questionText: "Which data structure is best for implementing a BFS algorithm?",
      options: ["Stack", "Queue", "Heap", "Array"],
      correctAnswerIndex: 1,
      explanation: "BFS uses a Queue (FIFO) to process nodes level by level."
    },
    {
      questionText: "What is the main advantage of a Linked List over an Array?",
      options: ["O(1) random access", "Better cache locality", "Dynamic size and efficient insertions/deletions", "Less memory usage"],
      correctAnswerIndex: 2,
      explanation: "Linked lists support O(1) insertions/deletions at known positions; arrays have O(n) for these."
    },
    {
      questionText: "What property must a Min-Heap satisfy?",
      options: ["Parent is always greater than children", "Parent is always smaller than or equal to children", "All leaves are at the same level", "Left child is always greater than right"],
      correctAnswerIndex: 1,
      explanation: "In a Min-Heap, every parent node's value ≤ its children, making the minimum at the root."
    },
    {
      questionText: "What is a Graph's adjacency matrix space complexity?",
      options: ["O(V)", "O(E)", "O(V²)", "O(V + E)"],
      correctAnswerIndex: 2,
      explanation: "An adjacency matrix requires V×V space, where V is the number of vertices."
    },
    {
      questionText: "Which data structure is used to implement recursion internally?",
      options: ["Queue", "Stack", "Heap", "Graph"],
      correctAnswerIndex: 1,
      explanation: "Recursion uses the call stack — function calls push frames, returns pop them (LIFO)."
    }
  ],

  algorithms: [
    {
      questionText: "What is the time complexity of Merge Sort?",
      options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
      correctAnswerIndex: 1,
      explanation: "Merge Sort divides the array into halves recursively, giving O(n log n) in all cases."
    },
    {
      questionText: "Which algorithm finds the shortest path in an unweighted graph?",
      options: ["Dijkstra's", "Bellman-Ford", "BFS", "DFS"],
      correctAnswerIndex: 2,
      explanation: "BFS guarantees the shortest path (fewest edges) in unweighted graphs."
    },
    {
      questionText: "What does Dynamic Programming primarily aim to solve?",
      options: ["Sorting problems", "Problems with overlapping subproblems using memoization/tabulation", "Graph traversal only", "String formatting"],
      correctAnswerIndex: 1,
      explanation: "DP breaks problems into overlapping subproblems and caches results to avoid redundant computation."
    },
    {
      questionText: "Which sorting algorithm has O(1) space complexity?",
      options: ["Merge Sort", "Quick Sort (in-place)", "Counting Sort", "Heap Sort"],
      correctAnswerIndex: 1,
      explanation: "In-place Quick Sort uses O(log n) stack space for recursion but O(1) extra auxiliary space."
    },
    {
      questionText: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswerIndex: 2,
      explanation: "Bubble Sort compares adjacent pairs repeatedly — O(n²) comparisons in worst case."
    },
    {
      questionText: "A greedy algorithm makes decisions based on:",
      options: ["Global optimization using all data", "Random selection", "Locally optimal choices at each step", "Backtracking all possibilities"],
      correctAnswerIndex: 2,
      explanation: "Greedy algorithms pick the best local choice at each step, hoping for a global optimum."
    },
    {
      questionText: "What does Big-O notation describe?",
      options: ["Exact runtime in seconds", "Best-case performance", "Upper bound on algorithm growth rate", "Memory allocation strategy"],
      correctAnswerIndex: 2,
      explanation: "Big-O describes the upper bound — worst-case growth rate as input size increases."
    },
    {
      questionText: "Which algorithm uses a 'divide and conquer' strategy?",
      options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
      correctAnswerIndex: 2,
      explanation: "Quick Sort partitions around a pivot and recursively sorts sub-arrays (divide and conquer)."
    },
    {
      questionText: "What is memoization in the context of algorithms?",
      options: ["Storing data in external databases", "Caching results of expensive function calls for reuse", "Sorting memory addresses", "Compressing code"],
      correctAnswerIndex: 1,
      explanation: "Memoization stores previously computed results so they don't need to be recalculated."
    },
    {
      questionText: "Dijkstra's algorithm is used for:",
      options: ["Minimum spanning tree", "Shortest path in weighted graphs with non-negative weights", "Topological sorting", "Finding cycles"],
      correctAnswerIndex: 1,
      explanation: "Dijkstra's finds the shortest path from a source in graphs with non-negative edge weights."
    }
  ],

  typescript: [
    {
      questionText: "What is the 'any' type in TypeScript?",
      options: ["A strict type constraint", "A type that disables type checking for a variable", "A union of all types", "An error type"],
      correctAnswerIndex: 1,
      explanation: "'any' opts out of type checking — use sparingly as it defeats TypeScript's purpose."
    },
    {
      questionText: "What is a TypeScript interface used for?",
      options: ["Defining function logic", "Declaring the shape/contract of an object", "Creating class instances", "Importing modules"],
      correctAnswerIndex: 1,
      explanation: "Interfaces define the structure (shape) that objects or classes must conform to."
    },
    {
      questionText: "What does the '?' operator mean in TypeScript property declarations?",
      options: ["The property is required", "The property is optional", "The property is readonly", "The property is private"],
      correctAnswerIndex: 1,
      explanation: "{ name?: string } makes 'name' optional — it can be string or undefined."
    },
    {
      questionText: "What is a generic in TypeScript?",
      options: ["A built-in type", "A way to write reusable code that works with multiple types", "An any type alias", "A JavaScript feature"],
      correctAnswerIndex: 1,
      explanation: "Generics like <T> allow writing type-safe reusable functions/classes for multiple types."
    },
    {
      questionText: "What does 'readonly' do to a property in TypeScript?",
      options: ["Makes it private", "Makes it optional", "Prevents reassignment after initialization", "Makes it static"],
      correctAnswerIndex: 2,
      explanation: "readonly properties can be set during initialization but cannot be reassigned afterward."
    },
    {
      questionText: "What is a union type in TypeScript?",
      options: ["A type that combines multiple types into one using |", "A class that inherits from multiple classes", "An interface merger", "A type alias for any"],
      correctAnswerIndex: 0,
      explanation: "Union type: string | number means a value can be either a string or a number."
    },
    {
      questionText: "What TypeScript utility type makes all properties of a type optional?",
      options: ["Required<T>", "Readonly<T>", "Partial<T>", "Optional<T>"],
      correctAnswerIndex: 2,
      explanation: "Partial<T> makes all properties of type T optional (adds '?' to each property)."
    },
    {
      questionText: "What is type inference in TypeScript?",
      options: ["Manually specifying all types", "TypeScript automatically deducing types from values", "Converting types at runtime", "Importing type definitions"],
      correctAnswerIndex: 1,
      explanation: "TypeScript infers the type of 'let x = 5' as 'number' without explicit annotation."
    }
  ],

  nodejs: [
    {
      questionText: "What is Node.js primarily built on?",
      options: ["Python interpreter", "Chrome's V8 JavaScript engine", "Mozilla SpiderMonkey", "Java Virtual Machine"],
      correctAnswerIndex: 1,
      explanation: "Node.js runs JavaScript using Google Chrome's V8 engine outside the browser."
    },
    {
      questionText: "What does the 'require()' function do in Node.js?",
      options: ["Creates a new module", "Imports a module synchronously", "Exports a function", "Executes async code"],
      correctAnswerIndex: 1,
      explanation: "require() synchronously loads a CommonJS module and returns its exports."
    },
    {
      questionText: "What is the event loop in Node.js?",
      options: ["A loop that repeats a function forever", "A mechanism that handles asynchronous operations on a single thread", "A debugging tool", "A DOM manipulation API"],
      correctAnswerIndex: 1,
      explanation: "Node's event loop processes callbacks from async operations, enabling non-blocking I/O."
    },
    {
      questionText: "Which built-in module handles file system operations in Node.js?",
      options: ["http", "path", "fs", "os"],
      correctAnswerIndex: 2,
      explanation: "The 'fs' (File System) module provides APIs for reading, writing, and manipulating files."
    },
    {
      questionText: "What is npm in Node.js?",
      options: ["Node Performance Monitor", "Node Package Manager — manages dependencies", "Network Protocol Manager", "Native Platform Module"],
      correctAnswerIndex: 1,
      explanation: "npm (Node Package Manager) installs, manages, and shares JavaScript packages."
    },
    {
      questionText: "What does 'process.env' access in Node.js?",
      options: ["CPU usage metrics", "Environment variables of the current process", "File system paths", "HTTP request headers"],
      correctAnswerIndex: 1,
      explanation: "process.env is an object containing environment variable key-value pairs."
    },
    {
      questionText: "Which Node.js module creates an HTTP server?",
      options: ["net", "https", "http", "server"],
      correctAnswerIndex: 2,
      explanation: "The built-in 'http' module's createServer() method creates an HTTP server."
    },
    {
      questionText: "What is middleware in Express.js?",
      options: ["A database layer", "A function that has access to req, res, and next in the request cycle", "A frontend rendering engine", "A load balancer"],
      correctAnswerIndex: 1,
      explanation: "Middleware functions process requests in the pipeline; calling next() passes control to the next middleware."
    }
  ],

  "machine learning": [
    {
      questionText: "What is overfitting in machine learning?",
      options: ["Model performs poorly on training data", "Model memorizes training data and fails to generalize to new data", "Training takes too long", "Model uses too little data"],
      correctAnswerIndex: 1,
      explanation: "Overfitting: model learns noise in training data, performing well on training but poorly on test data."
    },
    {
      questionText: "Which algorithm is used for classification problems?",
      options: ["Linear Regression", "Logistic Regression", "K-Means Clustering", "PCA"],
      correctAnswerIndex: 1,
      explanation: "Logistic Regression outputs probabilities and classifies into discrete categories."
    },
    {
      questionText: "What does 'supervised learning' mean?",
      options: ["Learning without any data", "Training on labeled data with known outputs", "Clustering similar data points", "Training without teacher supervision"],
      correctAnswerIndex: 1,
      explanation: "Supervised learning uses labeled training data (input-output pairs) to learn a mapping function."
    },
    {
      questionText: "What is the purpose of a train/test split in ML?",
      options: ["To reduce dataset size", "To evaluate model performance on unseen data", "To balance classes", "To normalize features"],
      correctAnswerIndex: 1,
      explanation: "Splitting data ensures the model is evaluated on data it hasn't learned from."
    },
    {
      questionText: "What does a confusion matrix show?",
      options: ["Model training speed", "True/False Positives and Negatives for classification evaluation", "Feature importance", "Loss curve over epochs"],
      correctAnswerIndex: 1,
      explanation: "A confusion matrix shows TP, TN, FP, FN counts, used to compute accuracy, precision, and recall."
    },
    {
      questionText: "What is a neural network's activation function used for?",
      options: ["To initialize weights", "To introduce non-linearity into the network", "To split training data", "To normalize inputs"],
      correctAnswerIndex: 1,
      explanation: "Activation functions (ReLU, sigmoid, tanh) add non-linearity, enabling complex pattern learning."
    },
    {
      questionText: "What is gradient descent used for in machine learning?",
      options: ["Data preprocessing", "Minimizing the loss function by adjusting model weights", "Selecting features", "Cross-validating results"],
      correctAnswerIndex: 1,
      explanation: "Gradient descent iteratively adjusts weights in the direction that reduces loss."
    },
    {
      questionText: "K-Means is an example of which type of learning?",
      options: ["Supervised learning", "Reinforcement learning", "Unsupervised learning", "Semi-supervised learning"],
      correctAnswerIndex: 2,
      explanation: "K-Means is unsupervised — it groups data into K clusters without labeled data."
    }
  ],

  "c++": [
    {
      questionText: "What is a pointer in C++?",
      options: ["A variable storing a value", "A variable storing the memory address of another variable", "A function return type", "A data structure"],
      correctAnswerIndex: 1,
      explanation: "A pointer holds the memory address of another variable: int* ptr = &x;"
    },
    {
      questionText: "What does the '&' operator do when used with a variable declaration in C++?",
      options: ["Bitwise AND", "Address-of operator — gets the memory address", "Reference operator in declaration", "Both B and C"],
      correctAnswerIndex: 3,
      explanation: "& means address-of in expressions (&x) and creates a reference in declarations (int& ref = x)."
    },
    {
      questionText: "What is the difference between 'new' and 'malloc' in C++?",
      options: ["No difference", "new calls constructors; malloc only allocates raw memory", "malloc is faster", "new is a C function"],
      correctAnswerIndex: 1,
      explanation: "new allocates memory AND calls the constructor; malloc only allocates raw bytes."
    },
    {
      questionText: "What is a virtual function in C++?",
      options: ["A function with no return value", "A function that enables runtime polymorphism through overriding", "A static class function", "An inline function"],
      correctAnswerIndex: 1,
      explanation: "virtual enables late binding — the derived class version is called through a base class pointer."
    },
    {
      questionText: "What is a destructor in C++?",
      options: ["A function that creates objects", "A special method called when an object goes out of scope to release resources", "A copy constructor", "A template function"],
      correctAnswerIndex: 1,
      explanation: "Destructors (~ClassName()) are called automatically when objects are destroyed, for cleanup."
    },
    {
      questionText: "What does 'const' mean in a C++ function parameter?",
      options: ["The parameter can be modified", "The parameter cannot be modified inside the function", "The function returns a constant", "The parameter is static"],
      correctAnswerIndex: 1,
      explanation: "const on a parameter prevents the function from modifying that value."
    }
  ]
};

// ─────────────────────────────────────────────
// Fuzzy topic matcher
// ─────────────────────────────────────────────
function matchTopicToBank(subject: string): Question[] | null {
  const lower = subject.toLowerCase();
  
  // Direct key match
  for (const key of Object.keys(QUESTION_BANK)) {
    if (lower.includes(key) || key.includes(lower)) {
      return QUESTION_BANK[key];
    }
  }
  
  // Alias matching
  const aliases: Record<string, string> = {
    'js': 'javascript', 'ts': 'typescript', 'py': 'python', 'ds': 'data structures',
    'ml': 'machine learning', 'node': 'nodejs', 'express': 'nodejs', 'react js': 'react',
    'reactjs': 'react', 'cpp': 'c++', 'c plus plus': 'c++', 'structured query': 'sql',
    'database': 'sql', 'db': 'sql', 'algo': 'algorithms', 'dsa': 'data structures',
    'neural': 'machine learning', 'deep learning': 'machine learning', 'ai': 'machine learning',
    'artificial intelligence': 'machine learning', 'hooks': 'react', 'next': 'react',
    'vue': 'javascript', 'angular': 'javascript', 'jvm': 'java', 'spring': 'java', 'jv': 'java',
    'django': 'python', 'flask': 'python', 'numpy': 'python', 'pandas': 'python',
    'jquery': 'javascript', 'ajax': 'javascript', 'async': 'javascript',
    'flexbox': 'css', 'grid': 'css', 'sass': 'css', 'scss': 'css',
    'semantic': 'html', 'dom': 'html', 'forms': 'html'
  };
  
  for (const [alias, bankKey] of Object.entries(aliases)) {
    if (lower.includes(alias)) {
      return QUESTION_BANK[bankKey] || null;
    }
  }
  
  return null;
}

// ─────────────────────────────────────────────
// Shuffle & pick n random questions
// ─────────────────────────────────────────────
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  // Fisher-Yates shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// ─────────────────────────────────────────────
// Generic question generator for unknown topics
// ─────────────────────────────────────────────
function generateGenericQuestions(subject: string, count: number): Question[] {
  const genericPool: Question[] = [
    {
      questionText: `Which of the following best describes the core purpose of ${subject}?`,
      options: [
        `A legacy technology no longer in active use`,
        `A systematic approach to solving domain-specific problems`,
        `A hardware specification standard`,
        `An operating system component`
      ],
      correctAnswerIndex: 1,
      explanation: `${subject} provides structured methods and patterns to address domain-specific challenges.`
    },
    {
      questionText: `What is a primary benefit of mastering ${subject}?`,
      options: [
        `It eliminates the need for any other skills`,
        `It has limited real-world application`,
        `It builds transferable problem-solving skills applicable across many domains`,
        `It only applies in academic settings`
      ],
      correctAnswerIndex: 2,
      explanation: `${subject} builds foundational skills that transfer across many real-world domains.`
    },
    {
      questionText: `Which approach is most effective when learning ${subject}?`,
      options: [
        `Passive reading without practice`,
        `Memorizing definitions without understanding context`,
        `Active hands-on practice combined with conceptual understanding`,
        `Skipping fundamentals and jumping to advanced topics`
      ],
      correctAnswerIndex: 2,
      explanation: `Active practice and conceptual understanding together lead to effective mastery of ${subject}.`
    },
    {
      questionText: `What distinguishes an expert in ${subject} from a beginner?`,
      options: [
        `Experts memorize more facts`,
        `Experts can only work in specific environments`,
        `Experts understand underlying principles and can adapt to novel problems`,
        `Experts rely entirely on tools and never on fundamentals`
      ],
      correctAnswerIndex: 2,
      explanation: `Expertise in ${subject} means understanding principles deeply enough to solve novel problems.`
    },
    {
      questionText: `Which practice helps retain knowledge in ${subject} long-term?`,
      options: [
        `Studying intensively only before deadlines`,
        `Spaced repetition and active recall over time`,
        `Reading the same material repeatedly`,
        `Avoiding self-testing until fully prepared`
      ],
      correctAnswerIndex: 1,
      explanation: `Spaced repetition and active recall are scientifically proven techniques for long-term retention.`
    },
    {
      questionText: `What does a structured study plan for ${subject} typically include?`,
      options: [
        `Random topics studied in no particular order`,
        `Only theoretical readings with no exercises`,
        `Progressive stages from fundamentals to advanced topics with practice`,
        `A single marathon study session`
      ],
      correctAnswerIndex: 2,
      explanation: `Structured learning progresses from basics to advanced material with regular practice.`
    },
    {
      questionText: `Why is problem-solving practice important in ${subject}?`,
      options: [
        `It is not important; theory is sufficient`,
        `It reinforces concepts and builds intuition for real-world scenarios`,
        `It replaces the need to understand theory`,
        `It only benefits competitive programmers`
      ],
      correctAnswerIndex: 1,
      explanation: `Practice reinforces theoretical knowledge and builds the intuition needed for real applications.`
    },
    {
      questionText: `Which mindset is most important when studying ${subject}?`,
      options: [
        `Fixed mindset — believing ability is innate and cannot grow`,
        `Growth mindset — believing skills can be developed through effort`,
        `Passive mindset — waiting for knowledge to come naturally`,
        `Avoidance mindset — working around difficult concepts`
      ],
      correctAnswerIndex: 1,
      explanation: `A growth mindset drives persistence through challenges, which is essential for mastering ${subject}.`
    }
  ];
  
  return pickRandom(genericPool, Math.min(count, genericPool.length));
}

// ─────────────────────────────────────────────
// Build quiz JSON response
// ─────────────────────────────────────────────
function buildQuizJson(subject: string, difficulty: string, numQuestions: number): string {
  const bankQuestions = matchTopicToBank(subject);
  
  let selectedQuestions: Question[];
  if (bankQuestions && bankQuestions.length >= numQuestions) {
    selectedQuestions = pickRandom(bankQuestions, numQuestions);
  } else if (bankQuestions && bankQuestions.length > 0) {
    // Use all bank questions and fill rest with generics
    const remaining = numQuestions - bankQuestions.length;
    selectedQuestions = [...pickRandom(bankQuestions, bankQuestions.length), ...generateGenericQuestions(subject, remaining)];
  } else {
    selectedQuestions = generateGenericQuestions(subject, numQuestions);
  }
  
  return JSON.stringify({
    quizTitle: `${subject} Quiz (${difficulty})`,
    questions: selectedQuestions.map((q, i) => ({
      id: i + 1,
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }))
  });
}

// ─────────────────────────────────────────────
// Intent & topic detection
// ─────────────────────────────────────────────
function detectIntent(input: string): string {
  const text = input.toLowerCase();
  if (/career.pathway.roadmap|career_navigator|role.*salary.*stages/i.test(text)) return 'career_path';
  if (/analyze.the.following.student.study.notes|document_analysis|weaknessesorgaps|essay/i.test(text)) return 'analyze';
  if (/quiz|test|assess|question|mcq|multiple.choice/.test(text)) return 'quiz';
  if (/study.?plan|schedule|roadmap|week.*plan|day.*plan|timeline|curriculum/.test(text)) return 'study_plan';
  if (/career|job|role|salary|hire|profession|industry|market/.test(text)) return 'career';
  if (/explain|what.?is|how.?does|define|describe|tell.?me.?about|concept|understand/.test(text)) return 'explain';
  if (/hello|hi|hey|greet|help|start|begin/.test(text)) return 'greeting';
  if (/search|find|resource|course|book|tutorial|link|website/.test(text)) return 'resources';
  return 'general';
}

function extractTopic(input: string): string {
  let text = input;
  if (text.includes('You are')) {
    const lines = text.split('\n');
    const userLines = lines.filter(l => l.toLowerCase().includes('user:') || l.toLowerCase().includes('student:'));
    if (userLines.length > 0) {
      text = userLines[userLines.length - 1];
    }
  }

  let clean = text
    .replace(/\b\d+\s*(?:mcq|mcqs|question|questions|quiz|test|q\b)s?/gi, '')
    .replace(/\b(?:quiz|test|explain|study\s*plan|career|what\s*is|how\s*does|tell\s*me\s*about|help\s*me|create|generate|make|give\s*me|a|an|the)\b/gi, '')
    .replace(/\b(?:for|on|about|of|in|to|with)\b/gi, '')
    .replace(/[?.,!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length < 2) {
    const words = text.trim().split(/\s+/);
    clean = words[words.length - 1].replace(/[?.,!]/g, '').trim();
  }

  return clean.length >= 2 ? clean : 'General Subject';
}

function extractSubjectFromPrompt(prompt: string): { subject: string; difficulty?: string; numQuestions?: number; query?: string } {
  const lowercase = prompt.toLowerCase();
  
  if (lowercase.includes('multiple choice quiz about')) {
    const quizMatch = prompt.match(/multiple choice quiz about\s+["']?([^"'\r\n]+)/i);
    const diffMatch = prompt.match(/at a\s+["']?([^"'\r\n]+)/i);
    const numMatch = prompt.match(/exactly\s+(\d+)\s+questions/i);
    return {
      subject: quizMatch ? quizMatch[1].replace(/["']/g, '').trim() : 'General Topic',
      difficulty: diffMatch ? diffMatch[1].replace(/["']/g, '').trim() : 'Medium',
      numQuestions: numMatch ? parseInt(numMatch[1], 10) : 5
    };
  }
  
  if (lowercase.includes('fetching textbook summary content for:')) {
    const sumMatch = prompt.match(/content for:\s+["']?([^"'\r\n]+)/i);
    return { subject: sumMatch ? sumMatch[1].replace(/["']/g, '').trim() : 'General Subject' };
  }
  
  if (lowercase.includes('structured search results page for the query:')) {
    const searchMatch = prompt.match(/for the query:\s+["']?([^"'\r\n]+)/i);
    return { 
      subject: searchMatch ? searchMatch[1].replace(/["']/g, '').trim() : 'Search Query', 
      query: searchMatch ? searchMatch[1].replace(/["']/g, '').trim() : '' 
    };
  }
  
  if (lowercase.includes('analyze the following student study notes')) {
    const focusMatch = prompt.match(/focus area:\s+["']?([^"'\r\n]+)/i);
    return { subject: focusMatch ? focusMatch[1].replace(/["']/g, '').trim() : 'General Analysis' };
  }

  // Extract number of questions if present (e.g., "3 mcq", "5 questions", "10 q")
  let numQuestions = 5;
  const numMatch = prompt.match(/\b(\d+)\s*(?:mcq|mcqs|question|questions|quiz|test|q\b)s?/i);
  if (numMatch) {
    numQuestions = parseInt(numMatch[1], 10);
  }

  // Extract difficulty if present (e.g., "easy", "medium", "hard")
  let difficulty = 'Medium';
  if (lowercase.includes('easy')) difficulty = 'Easy';
  else if (lowercase.includes('hard')) difficulty = 'Hard';

  const subject = extractTopic(prompt);

  return { subject, difficulty, numQuestions };
}

// ─────────────────────────────────────────────
// Dynamic Document / Essay / Notes Analyzer (Grammarly + Fact Check Mock)
// ─────────────────────────────────────────────
function performMockDocumentAnalysis(rawInput: string, subject: string): string {
  // Extract the actual student document content from the prompt wrapper if possible
  const contentMatch = rawInput.match(/Document Content:\s*"""([\s\S]+?)"""/i) || rawInput.match(/Document Content:\s*([\s\S]+)/i);
  const content = contentMatch ? contentMatch[1].trim() : rawInput;
  
  const lowercaseContent = content.toLowerCase();
  
  let summary = "";
  let keyConceptsIdentified: string[] = [];
  let weaknessesOrGaps: string[] = [];
  let recommendations: string[] = [];

  // 1. Analyze for Spelling & Grammar ("Grammarly" check)
  const grammarIssues: string[] = [];
  const spellingIssues: string[] = [];

  // Spelling mistakes dictionary
  const spellingDict: Record<string, string> = {
    'resonse': 'response',
    'resonses': 'responses',
    'propely': 'properly',
    'scholl': 'school',
    'contetn': 'content',
    'html?': 'HTML',
    'mcq': 'MCQ'
  };

  for (const [wrong, right] of Object.entries(spellingDict)) {
    if (lowercaseContent.includes(wrong)) {
      spellingIssues.push(`Spelling mistake: Found "${wrong}", did you mean "${right}"?`);
    }
  }

  // Sentence capitalization check
  const sentences = content.split(/[.!?]+/);
  let lowercaseStartCount = 0;
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 0 && trimmed[0] === trimmed[0].toLowerCase() && isNaN(Number(trimmed[0])) && trimmed[0] !== trimmed[0].toUpperCase()) {
      lowercaseStartCount++;
    }
  }
  if (lowercaseStartCount > 1) {
    grammarIssues.push(`Sentence capitalization: ${lowercaseStartCount} sentences start with a lowercase letter.`);
  }

  // 2. Check for Misleading or Incorrect Information & Topic Specifics
  if (lowercaseContent.includes('java') && lowercaseContent.includes('html')) {
    summary = "Analysis of study notes questioning the relationship between Java and HTML.";
    keyConceptsIdentified = ["Java Programming Language", "HTML Markup Language", "Backend vs Frontend Architectures"];
    
    weaknessesOrGaps = [
      "CRITICAL MISCONCEPTION: Confusing Java (an object-oriented, compiled backend programming language) with HTML (a frontend markup language for defining webpage structure). Java and HTML are completely different technologies.",
      ...spellingIssues,
      ...grammarIssues
    ];
    if (weaknessesOrGaps.length === 1) {
      weaknessesOrGaps.push("Lacks explanation of client-server request/response flows.");
    }

    recommendations = [
      "Clarify your definitions: HTML is for document markup/structure. Java is for server-side programming, databases, and application logic.",
      "Read an introductory article on the Client-Server architecture to understand how a Java server communicates with a browser rendering HTML.",
      "Try building a simple webpage with HTML to understand its tag-based structure, and compare it to a Java class file.",
      "Fix any spelling/grammar issues in your notes (e.g. check casing of HTML/Java)."
    ];
  } 
  else if (lowercaseContent.includes('promise') || lowercaseContent.includes('async') || lowercaseContent.includes('await')) {
    summary = "Analysis of JavaScript asynchronous programming notes covering Promises and Async/Await.";
    keyConceptsIdentified = ["JavaScript Promises", "Async/Await Syntax", "Asynchronous Control Flow"];
    
    // Check for errors/gaps in async notes
    const hasErrorHandling = lowercaseContent.includes('try') || lowercaseContent.includes('catch');
    
    if (!hasErrorHandling) {
      weaknessesOrGaps.push("CRITICAL GAP: The notes do not mention error handling (try/catch blocks) for Async/Await, which can lead to uncaught promise rejections.");
    }
    if (lowercaseContent.includes('event loop') || lowercaseContent.includes('not sure')) {
      weaknessesOrGaps.push("CONCEPTUAL WEAKNESS: Uncertainty around the JavaScript Event Loop mechanism and microtask queue priorities.");
    }
    
    weaknessesOrGaps.push(...spellingIssues);
    weaknessesOrGaps.push(...grammarIssues);

    if (weaknessesOrGaps.length === 0) {
      weaknessesOrGaps.push("Lacks coverage of concurrent execution using Promise.all or Promise.race.");
    }

    recommendations = [
      "Always wrap your 'await' calls inside 'try/catch' blocks to handle asynchronous errors gracefully.",
      "Study the event loop: understand that promise resolutions are queued as microtasks, which execute before macrotasks (such as setTimeout).",
      "Add a concrete code snippet demonstrating a fetch request using async/await with complete error handling.",
      "Correct formatting and casing of keywords (e.g., 'Promise', 'async', 'await')."
    ];
  }
  else if (lowercaseContent.includes('python') || lowercaseContent.includes('list comprehension') || lowercaseContent.includes('lambda')) {
    summary = "Analysis of Python programming notes covering list comprehensions and functional structures.";
    keyConceptsIdentified = ["Python List Comprehensions", "Lambda Functions", "Mutability vs Immutability"];
    
    weaknessesOrGaps = [
      "Lacks discussion of readability tradeoffs when using complex, multi-line list comprehensions.",
      ...spellingIssues,
      ...grammarIssues
    ];
    
    recommendations = [
      "Keep list comprehensions concise and readable. If logic gets complex, use standard for-loops.",
      "Add examples of mutable types (lists, dicts) vs immutable types (tuples, strings) to improve notes comprehensiveness.",
      "Verify code syntax for lambda functions (e.g. lambda arguments: expression)."
    ];
  }
  else {
    // General fallback but dynamically built based on input!
    summary = `Analysis of study notes regarding ${subject}.`;
    keyConceptsIdentified = [`${subject} Core Concepts`, "Logical structure", "Methodological application"];
    
    weaknessesOrGaps = [
      "The notes are very brief and lack detailed explanations of the underlying mechanisms.",
      "No practical examples, diagrams, or code snippets are provided to demonstrate application.",
      ...spellingIssues,
      ...grammarIssues
    ];
    
    recommendations = [
      `Expand your notes on ${subject} with specific use cases and practical examples.`,
      "Add a summary section at the end of your notes to reinforce active recall.",
      "Make sure all technical terms are spelled correctly and defined clearly."
    ];
  }

  return JSON.stringify({
    summary,
    keyConceptsIdentified,
    weaknessesOrGaps,
    recommendations
  });
}

// ─────────────────────────────────────────────
// Dynamic Career Pathway Generator (JSON representation)
// ─────────────────────────────────────────────
function buildCareerPathJson(role: string): string {
  const lowerRole = role.toLowerCase();
  
  let salary = "$85,000 - $135,000";
  if (lowerRole.includes('senior') || lowerRole.includes('lead') || lowerRole.includes('manager') || lowerRole.includes('architect') || lowerRole.includes('principal')) {
    salary = "$135,000 - $195,000";
  } else if (lowerRole.includes('junior') || lowerRole.includes('intern') || lowerRole.includes('associate') || lowerRole.includes('entry')) {
    salary = "$55,000 - $80,000";
  }

  // 1. Data Scientist / Machine Learning Engineer
  if (lowerRole.includes('data science') || lowerRole.includes('datascience') || lowerRole.includes('machine learning') || lowerRole.includes('ml') || lowerRole.includes('ai') || lowerRole.includes('deep learning')) {
    return JSON.stringify({
      role: "Data Scientist & AI Practitioner",
      salary: salary,
      description: "Extracts value from complex datasets and designs machine learning models, neural networks, and generative AI systems to solve complex business challenges.",
      stages: [
        {
          title: "Stage 1: Math, Statistics & Scripting Core",
          skills: [
            { name: "Python (Pandas & NumPy)", type: "language", status: "mandatory" },
            { name: "SQL & Database Queries", type: "language", status: "mandatory" },
            { name: "Probability & Statistics", type: "concept", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Machine Learning Foundations",
          skills: [
            { name: "Scikit-Learn models", type: "framework", status: "mandatory" },
            { name: "Regression & Classification", type: "concept", status: "mandatory" },
            { name: "Data Visualization (Seaborn & Matplotlib)", type: "tool", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Deep Learning & AI Systems",
          skills: [
            { name: "TensorFlow or PyTorch", type: "framework", status: "recommended" },
            { name: "Neural Networks (CNN/RNN/Transformers)", type: "concept", status: "recommended" },
            { name: "LLM Fine-tuning & Prompt Engineering", type: "concept", status: "optional" }
          ]
        }
      ]
    });
  }

  // 2. DevOps / Site Reliability Engineer
  if (lowerRole.includes('devops') || lowerRole.includes('sre') || lowerRole.includes('site reliability') || lowerRole.includes('cloud') || lowerRole.includes('infrastructure')) {
    return JSON.stringify({
      role: "DevOps / Site Reliability Engineer",
      salary: salary,
      description: "Bridges software development and systems operations. Automates deployments, manages cloud infrastructure, and monitors application reliability.",
      stages: [
        {
          title: "Stage 1: System & Network Foundations",
          skills: [
            { name: "Linux Command Line / Bash", type: "concept", status: "mandatory" },
            { name: "Git & Version Control", type: "tool", status: "mandatory" },
            { name: "Networking Basics (DNS, HTTP/S, TCP)", type: "concept", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Containers & Pipeline Automation",
          skills: [
            { name: "Docker Containerization", type: "tool", status: "mandatory" },
            { name: "GitHub Actions & CI/CD Pipelines", type: "tool", status: "recommended" },
            { name: "Cloud Platforms (AWS or GCP)", type: "concept", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Scale & Infrastructure as Code",
          skills: [
            { name: "Kubernetes Orchestration", type: "tool", status: "mandatory" },
            { name: "Terraform (Infrastructure as Code)", type: "tool", status: "recommended" },
            { name: "Prometheus & Grafana monitoring", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 3. C++ Systems & Game Developer
  if (lowerRole.includes('c++') || lowerRole.includes('cpp') || lowerRole.includes('systems') || lowerRole.includes('game') || lowerRole.includes('embedded')) {
    return JSON.stringify({
      role: "C++ Systems & Game Engineer",
      salary: salary,
      description: "Engineers high-performance, resource-constrained software systems, game engines, graphics pipelines, or embedded devices using C++.",
      stages: [
        {
          title: "Stage 1: Language & Memory Basics",
          skills: [
            { name: "C++ Syntax & Object-Oriented Design", type: "language", status: "mandatory" },
            { name: "Pointers & Manual Memory Management", type: "concept", status: "mandatory" },
            { name: "CMake & Compilation Build Tools", type: "tool", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Standard Library & Concurrency",
          skills: [
            { name: "C++ Standard Template Library (STL)", type: "framework", status: "mandatory" },
            { name: "Multithreading & Concurrency", type: "concept", status: "recommended" },
            { name: "Debugging with GDB or LLDB", type: "tool", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Advanced Optimization & Rendering",
          skills: [
            { name: "Low-Level Performance Tuning", type: "concept", status: "recommended" },
            { name: "DirectX, OpenGL, or Vulkan APIs", type: "framework", status: "optional" },
            { name: "Real-time Architecture Patterns", type: "concept", status: "optional" }
          ]
        }
      ]
    });
  }

  // 4. SQL / Database Engineer
  if (lowerRole.includes('sql') || lowerRole.includes('database') || lowerRole.includes('db') || lowerRole.includes('dba') || lowerRole.includes('postgres') || lowerRole.includes('mysql') || lowerRole.includes('mongodb') || lowerRole.includes('oracle')) {
    return JSON.stringify({
      role: "Database Administrator & Architect",
      salary: salary,
      description: "Designs, optimizes, and maintains relational and non-relational database systems, ensuring data integrity, security, and high availability.",
      stages: [
        {
          title: "Stage 1: SQL & Schema Fundamentals",
          skills: [
            { name: "SQL (SELECT, JOINs, Subqueries)", type: "language", status: "mandatory" },
            { name: "Relational Schema Design (DDL/DML)", type: "concept", status: "mandatory" },
            { name: "PostgreSQL or MySQL Administration", type: "tool", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Query Tuning & Transaction Safety",
          skills: [
            { name: "Database Indexing & B-Trees", type: "concept", status: "mandatory" },
            { name: "Query Execution Plan Analysis", type: "tool", status: "recommended" },
            { name: "Transaction Isolation & ACID Properties", type: "concept", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Advanced Storage & Scale",
          skills: [
            { name: "Database Replication & Clustering", type: "concept", status: "recommended" },
            { name: "NoSQL Systems (MongoDB & Redis)", type: "framework", status: "recommended" },
            { name: "Data Warehousing (Snowflake/BigQuery)", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 5. Node.js / JavaScript Backend Developer
  if (lowerRole.includes('node') || lowerRole.includes('express') || lowerRole.includes('nest') || (lowerRole.includes('backend') && lowerRole.includes('javascript'))) {
    return JSON.stringify({
      role: "Node.js Backend Developer",
      salary: salary,
      description: "Builds high-throughput, non-blocking network applications, web APIs, and distributed microservices using JavaScript or TypeScript on Node.js.",
      stages: [
        {
          title: "Stage 1: Server-Side JavaScript Core",
          skills: [
            { name: "JavaScript ES6+ & Event Loop mechanics", type: "language", status: "mandatory" },
            { name: "Node.js Core Modules (fs, path, http)", type: "framework", status: "mandatory" },
            { name: "NPM & Yarn Package Managers", type: "tool", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Web APIs & Databases",
          skills: [
            { name: "Express.js or NestJS framework", type: "framework", status: "mandatory" },
            { name: "MongoDB or PostgreSQL Integration", type: "tool", status: "recommended" },
            { name: "RESTful API Design & JWT Auth", type: "concept", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Production & Performance Scale",
          skills: [
            { name: "TypeScript for Backend Safety", type: "language", status: "recommended" },
            { name: "Docker Containerization", type: "tool", status: "recommended" },
            { name: "Redis Caching & Celery/BullMQ queues", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 6. Python Full-Stack & Backend Developer
  if (lowerRole.includes('python') || lowerRole.includes('django') || lowerRole.includes('flask') || lowerRole.includes('fastapi')) {
    return JSON.stringify({
      role: "Python Backend Developer",
      salary: salary,
      description: "Architects and develops backend APIs, microservices, and server-side business logic using Python and its modern web ecosystems.",
      stages: [
        {
          title: "Stage 1: Python Core & Scripting",
          skills: [
            { name: "Python Advanced Syntax & OOP", type: "language", status: "mandatory" },
            { name: "Pip & Virtual Environments (venv/poetry)", type: "tool", status: "mandatory" },
            { name: "SQL Databases & Object-Relational Mapping", type: "concept", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Modern Web Frameworks & APIs",
          skills: [
            { name: "FastAPI or Django framework", type: "framework", status: "mandatory" },
            { name: "PyTest & Automated Testing", type: "tool", status: "recommended" },
            { name: "RESTful API Development", type: "concept", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Advanced Ecosystem & Cloud",
          skills: [
            { name: "Docker Containerization", type: "tool", status: "recommended" },
            { name: "Asynchronous Python (Asyncio)", type: "concept", status: "recommended" },
            { name: "Redis Caching & Celery task queues", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 7. Android / Kotlin Mobile Developer
  if (lowerRole.includes('android') || lowerRole.includes('kotlin') || (lowerRole.includes('mobile') && (lowerRole.includes('google') || lowerRole.includes('java')))) {
    return JSON.stringify({
      role: "Android Application Developer",
      salary: salary,
      description: "Builds and deploys native mobile experiences for the Android ecosystem using Kotlin, Jetpack Compose, and modern architecture paradigms.",
      stages: [
        {
          title: "Stage 1: Kotlin & Android Core",
          skills: [
            { name: "Kotlin Programming Language", type: "language", status: "mandatory" },
            { name: "Android Studio IDE & Gradle", type: "tool", status: "mandatory" },
            { name: "Android Activity Lifecycle & Intents", type: "concept", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Modern UI & Network Integration",
          skills: [
            { name: "Jetpack Compose declarative UI", type: "framework", status: "mandatory" },
            { name: "Retrofit HTTP Client & REST APIs", type: "tool", status: "recommended" },
            { name: "Room Database Local Storage", type: "framework", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Enterprise Architecture & Concurrency",
          skills: [
            { name: "MVVM / Clean Architecture Patterns", type: "concept", status: "recommended" },
            { name: "Kotlin Coroutines & Flow API", type: "concept", status: "recommended" },
            { name: "Hilt Dependency Injection", type: "framework", status: "optional" }
          ]
        }
      ]
    });
  }

  // 8. Preset: iOS/Swift Developer
  if (lowerRole.includes('ios') || lowerRole.includes('swift') || lowerRole.includes('apple') || lowerRole.includes('iphone') || lowerRole.includes('ipad')) {
    return JSON.stringify({
      role: "iOS Application Developer",
      salary: salary,
      description: "Responsible for designing, building, and maintaining high-performance mobile applications for Apple platforms (iOS, iPadOS, watchOS).",
      stages: [
        {
          title: "Stage 1: Swift Core Fundamentals",
          skills: [
            { name: "Swift Programming Language", type: "language", status: "mandatory" },
            { name: "UIKit & Auto Layout", type: "framework", status: "mandatory" },
            { name: "Xcode IDE basics", type: "tool", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Modern Mobile Architecture",
          skills: [
            { name: "SwiftUI declarative UI", type: "framework", status: "mandatory" },
            { name: "CoreData & SwiftData", type: "framework", status: "recommended" },
            { name: "CocoaPods & Swift Package Manager", type: "tool", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Professional iOS Engineering",
          skills: [
            { name: "Combine & Async/Await", type: "concept", status: "recommended" },
            { name: "MVVM Architecture Pattern", type: "concept", status: "recommended" },
            { name: "XCTest & UI Testing", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 9. Preset: Cybersecurity
  if (lowerRole.includes('cyber') || lowerRole.includes('security') || lowerRole.includes('penetration') || lowerRole.includes('hacking') || lowerRole.includes('infosec')) {
    return JSON.stringify({
      role: "Cybersecurity Analyst / Engineer",
      salary: salary,
      description: "Monitors, analyzes, and protects computer networks, systems, and digital assets from unauthorized access, cyber attacks, and security breaches.",
      stages: [
        {
          title: "Stage 1: Network & OS Foundations",
          skills: [
            { name: "TCP/IP Networking & Protocols", type: "concept", status: "mandatory" },
            { name: "Linux System Administration", type: "concept", status: "mandatory" },
            { name: "Python scripting for automation", type: "language", status: "recommended" }
          ]
        },
        {
          title: "Stage 2: Security Assessment & Tools",
          skills: [
            { name: "Wireshark Packet Analysis", type: "tool", status: "mandatory" },
            { name: "Nmap Network Scanning", type: "tool", status: "mandatory" },
            { name: "CompTIA Security+ concepts", type: "concept", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Advanced Defense & Penetration",
          skills: [
            { name: "Metasploit Penetration Testing", type: "tool", status: "recommended" },
            { name: "SIEM Systems (Splunk)", type: "tool", status: "recommended" },
            { name: "Ethical Hacking Methodologies", type: "concept", status: "optional" }
          ]
        }
      ]
    });
  }

  // 10. Preset: Java Backend / Spring Boot
  if (lowerRole.includes('java') || lowerRole.includes('spring')) {
    return JSON.stringify({
      role: "Java Backend Software Engineer",
      salary: salary,
      description: "Designs and implements robust, scalable backend server architectures, RESTful APIs, and microservices using Java and enterprise frameworks.",
      stages: [
        {
          title: "Stage 1: Java Language Mastery",
          skills: [
            { name: "Java Core (OOP, Multithreading)", type: "language", status: "mandatory" },
            { name: "SQL Databases & JDBC", type: "language", status: "mandatory" },
            { name: "Maven / Gradle Build Tools", type: "tool", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Enterprise Frameworks",
          skills: [
            { name: "Spring Boot framework", type: "framework", status: "mandatory" },
            { name: "Hibernate / JPA ORM", type: "framework", status: "mandatory" },
            { name: "RESTful API Design", type: "concept", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Distributed Systems & Scale",
          skills: [
            { name: "Microservices Architecture", type: "concept", status: "recommended" },
            { name: "Docker Containerization", type: "tool", status: "recommended" },
            { name: "RabbitMQ / Apache Kafka", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 11. Preset: Frontend Developer
  if (lowerRole.includes('front') || lowerRole.includes('web') || lowerRole.includes('react') || lowerRole.includes('html') || lowerRole.includes('css') || lowerRole.includes('javascript') || lowerRole.includes('typescript')) {
    return JSON.stringify({
      role: "Frontend Web Engineer",
      salary: salary,
      description: "Responsible for building client-facing web application interfaces. Focuses on responsiveness, usability, and smooth visual performance.",
      stages: [
        {
          title: "Stage 1: Core Fundamentals",
          skills: [
            { name: "HTML5 Semantic markup", type: "concept", status: "mandatory" },
            { name: "CSS3 (Flexbox/Grid)", type: "language", status: "mandatory" },
            { name: "JavaScript ES6+", type: "language", status: "mandatory" }
          ]
        },
        {
          title: "Stage 2: Modern Frameworks & Bundlers",
          skills: [
            { name: "React.js & State Management", type: "framework", status: "mandatory" },
            { name: "TypeScript", type: "language", status: "recommended" },
            { name: "Vite & ESBuild", type: "tool", status: "recommended" }
          ]
        },
        {
          title: "Stage 3: Advanced Skills",
          skills: [
            { name: "Next.js (Server Components)", type: "framework", status: "recommended" },
            { name: "Performance Optimization", type: "concept", status: "recommended" },
            { name: "E2E Testing (Playwright)", type: "tool", status: "optional" }
          ]
        }
      ]
    });
  }

  // 12. Smart Dynamic Procedural Generator for any other custom role!
  const cleanRole = role.replace(/career|path|roadmap|navigator/gi, '').trim();
  const formattedRole = cleanRole.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const displayRole = formattedRole.length > 2 ? formattedRole : "Specialized Technology";
  
  // Custom salary depending on role properties
  let customSalary = "$85,000 - $140,000";
  if (lowerRole.includes('architect') || lowerRole.includes('principal') || lowerRole.includes('lead') || lowerRole.includes('senior') || lowerRole.includes('director')) {
    customSalary = "$140,000 - $210,000";
  } else if (lowerRole.includes('junior') || lowerRole.includes('intern') || lowerRole.includes('associate') || lowerRole.includes('entry')) {
    customSalary = "$50,000 - $75,000";
  } else if (lowerRole.includes('data') || lowerRole.includes('cloud') || lowerRole.includes('security') || lowerRole.includes('systems') || lowerRole.includes('ai') || lowerRole.includes('compiler')) {
    customSalary = "$95,000 - $155,000"; // Higher starting for specialized technical roles
  }

  // Diverse description templates
  const descriptionTemplates = [
    `Master the core technical skills, design paradigms, and advanced tools required to design and deploy state-of-the-art solutions as a ${displayRole} professional.`,
    `A comprehensive roadmap designed to take you from foundational concepts to expert-level execution in ${displayRole} engineering and deployment.`,
    `Equips developers and engineering professionals with the necessary skills to build, optimize, and scale high-performance projects using ${displayRole}.`
  ];
  // Simple hash function to select template deterministically based on role name
  let hash = 0;
  for (let i = 0; i < displayRole.length; i++) {
    hash = displayRole.charCodeAt(i) + ((hash << 5) - hash);
  }
  const description = descriptionTemplates[Math.abs(hash) % descriptionTemplates.length];

  return JSON.stringify({
    role: `${displayRole} Specialist`,
    salary: customSalary,
    description: description,
    stages: [
      {
        title: `Stage 1: ${displayRole} Foundational Core`,
        skills: [
          { name: `${displayRole} Core Syntax & Primitives`, type: "language", status: "mandatory" },
          { name: `${displayRole} Development Environment`, type: "tool", status: "mandatory" },
          { name: `Foundational ${displayRole} Design Patterns`, type: "concept", status: "mandatory" }
        ]
      },
      {
        title: `Stage 2: ${displayRole} Tooling & Ecosystem`,
        skills: [
          { name: `${displayRole} Standard Libraries & APIs`, type: "framework", status: "mandatory" },
          { name: `Intermediate ${displayRole} Project Design`, type: "concept", status: "recommended" },
          { name: "Git Version Control & Collaboration", type: "tool", status: "recommended" }
        ]
      },
      {
        title: `Stage 3: Advanced ${displayRole} Systems & Scaling`,
        skills: [
          { name: `${displayRole} Performance & Memory Tuning`, type: "concept", status: "recommended" },
          { name: `Automated Testing & QA for ${displayRole}`, type: "tool", status: "recommended" },
          { name: `High-Availability & Production Deployments`, type: "concept", status: "optional" }
        ]
      }
    ]
  });
}

// ─────────────────────────────────────────────
// Main response builder
// ─────────────────────────────────────────────
function buildResponse(intent: string, topic: string, rawInput: string): string {
  const needsJson = rawInput.toLowerCase().includes('json');
  
  if (needsJson) {
    const details = extractSubjectFromPrompt(rawInput);
    const cleanSubject = details.subject || topic;
    const cleanDifficulty = details.difficulty || 'Medium';
    const numQuestions = details.numQuestions || 5;

    switch (intent) {
      case 'quiz':
        return buildQuizJson(cleanSubject, cleanDifficulty, numQuestions);
      case 'career_path':
        return buildCareerPathJson(cleanSubject);
      case 'resources':
        return JSON.stringify({
          summary: `Overview and helpful search results for ${cleanSubject}.`,
          results: [
            { title: `${cleanSubject} Documentation`, url: `https://developer.mozilla.org/search?q=${encodeURIComponent(cleanSubject)}`, description: `Official documentation and core guide for ${cleanSubject}.` },
            { title: `Introduction to ${cleanSubject}`, url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(cleanSubject)}`, description: `Comprehensive tutorials and practice exercises.` },
            { title: `${cleanSubject} on GitHub`, url: `https://github.com/trending`, description: `Community guides and open-source references.` }
          ]
        });
      case 'explain':
        return JSON.stringify({
          subject: cleanSubject,
          topic: 'General Overview',
          keyConcepts: [
            { concept: `${cleanSubject} Fundamentals`, description: `Understanding the core definitions and underlying rules of ${cleanSubject}.` },
            { concept: `Practical Application`, description: `How ${cleanSubject} principles are applied in real-world scenarios.` },
            { concept: `Best Practices`, description: `Key strategies for optimizing implementations and avoiding common pitfalls.` }
          ],
          contentSummary: `${cleanSubject} is a foundational domain that combines theoretical principles with practical application. Mastery requires understanding core concepts, practicing with real problems, and iteratively refining your approach through project work.`
        });
      case 'analyze':
      default:
        return performMockDocumentAnalysis(rawInput, cleanSubject);
    }
  }

  // ── Plain-text responses ──────────────────────────────────────────────────
  switch (intent) {
    case 'greeting':
      return `# 👋 Welcome to EduAssist AI!

I'm your personal AI-powered educational assistant. Here's what I can help you with:

- 📚 **Learn any topic** — Ask me to explain concepts, theories, or subjects
- 🗓️ **Study plans** — Get personalized day-by-day learning schedules
- 📝 **Quizzes** — Test your knowledge with multiple-choice assessments
- 💼 **Career guidance** — Explore career paths, skill gaps, and roadmaps

**Try asking:**
- *"Explain React hooks to me"*
- *"Create a 7-day Python study plan"*
- *"Quiz me on Data Structures"*
- *"What career path suits a software engineer?"*

How can I help you today? 🎓`;

    case 'quiz': {
      const qDetails = extractSubjectFromPrompt(rawInput);
      const subject = qDetails.subject || topic;
      const numQuestions = qDetails.numQuestions || 5;
      const bankQs = matchTopicToBank(subject);
      const picked = bankQs ? pickRandom(bankQs, Math.min(numQuestions, bankQs.length)) : generateGenericQuestions(subject, numQuestions);
      const letters = ['A', 'B', 'C', 'D'];

      const questionBlocks = picked.map((q, i) => {
        const opts = q.options.map((o, oi) => `- **${letters[oi]})** ${o}${oi === q.correctAnswerIndex ? ' ✅' : ''}`).join('\n');
        return `**Question ${i + 1}:** ${q.questionText}\n${opts}\n\n*💡 ${q.explanation}*`;
      }).join('\n\n---\n\n');

      return `# 📝 ${subject} Quiz\n\n${questionBlocks}\n\n---\n*Score yourself: ${numQuestions}/${numQuestions} = Expert | ${Math.floor(numQuestions * 0.8)}/${numQuestions} = Proficient | ${Math.floor(numQuestions * 0.6)}/${numQuestions} = Developing | <${Math.floor(numQuestions * 0.6)} = Keep practicing!*`;
    }

    case 'study_plan':
      return `# 🗓️ 7-Day Study Plan: ${topic}

A structured, progressive learning plan to master **${topic}**.

---

## 📅 Day 1 — Foundations & Overview
- ✅ Introduction to **${topic}**: history, purpose, and relevance
- ✅ Read beginner-level articles and watch 1–2 introductory videos
- ✅ Write a summary of what you learned (300 words)
- ⏱️ Estimated time: **2 hours**

## 📅 Day 2 — Core Concepts
- ✅ Study the 5 most important concepts in **${topic}**
- ✅ Create flashcards for key terms and definitions
- ✅ Complete 5 practice problems or exercises
- ⏱️ Estimated time: **2.5 hours**

## 📅 Day 3 — Deep Dive & Application
- ✅ Explore real-world applications of **${topic}**
- ✅ Work through a guided tutorial or case study
- ✅ Build or analyze a simple example from scratch
- ⏱️ Estimated time: **3 hours**

## 📅 Day 4 — Advanced Topics
- ✅ Study intermediate-to-advanced aspects of **${topic}**
- ✅ Compare different approaches and methods in this domain
- ✅ Read one technical article or research summary
- ⏱️ Estimated time: **2.5 hours**

## 📅 Day 5 — Practice & Problem Solving
- ✅ Solve 10 varied exercises related to **${topic}**
- ✅ Identify areas where you feel less confident
- ✅ Review mistakes and revisit weak areas
- ⏱️ Estimated time: **3 hours**

## 📅 Day 6 — Project / Mini-Assessment
- ✅ Apply knowledge in a mini-project or assignment
- ✅ Take a practice quiz on **${topic}**
- ✅ Explain the topic to someone else (Feynman technique)
- ⏱️ Estimated time: **3 hours**

## 📅 Day 7 — Review & Next Steps
- ✅ Full review of all notes and flashcards
- ✅ Final self-assessment quiz
- ✅ Plan next advanced topics in **${topic}**
- ⏱️ Estimated time: **2 hours**

---
**📚 Recommended Resources:**
- Khan Academy (free courses) | Coursera / edX (structured courses)
- YouTube educational channels | Official documentation`;

    case 'career':
    case 'career_path': {
      const details = extractSubjectFromPrompt(rawInput);
      const cleanSubject = details.subject || topic;
      try {
        const data = JSON.parse(buildCareerPathJson(cleanSubject));
        const stagesStr = data.stages.map((s: any) => {
          const skillsStr = s.skills.map((sk: any) => `- **${sk.name}** (${sk.type}) — *${sk.status}*`).join('\n');
          return `### 📍 ${s.title}\n${skillsStr}`;
        }).join('\n\n');
        return `# 💼 Career Path: ${data.role}
        
**Expected Average Salary:** ${data.salary}

${data.description}

---

${stagesStr}

---
*💡 Pro Tip: Study these topics systematically and build 2-3 mini-projects to reinforce your hands-on experience!*`;
      } catch {
        return `# 💼 Career Guidance: ${cleanSubject}
        
Understanding the career pathway for **${cleanSubject}** provides a strong foundation for setting learning milestones and aligning with industry expectations.

## Key Recommendations
- Master the fundamental syntax and core primitives of ${cleanSubject}.
- Build small, runnable tools or projects to apply your learning.
- Study standard architecture patterns used in professional production environments.`;
      }
    }

    case 'explain':
      return `# 📖 Explanation: ${topic}

## What is ${topic}?

**${topic}** is an important concept that plays a central role in modern technology and professional practice. Understanding it thoroughly provides a strong foundation for further learning.

---

## 🔑 Core Principles

### 1. Foundation
**${topic}** is built on fundamental principles developed and refined through research and real-world application.

### 2. How It Works
The mechanism involves:
- **Input/Context** — What information or conditions are considered
- **Processing** — How the system handles that information
- **Output/Result** — What outcomes or conclusions are produced

### 3. Why It Matters
- ✅ Solves real problems in practice
- ✅ Provides structured frameworks for thinking
- ✅ Is foundational to advanced topics in its domain
- ✅ Is widely applied across industries

---

## 💡 Practical Example
To apply **${topic}**:
1. Identify the problem or goal
2. Gather relevant information
3. Apply the principles step-by-step
4. Evaluate and refine your approach

---

## 📚 To Learn More
- Search **"${topic} introduction"** on Khan Academy or Coursera
- Practice with real problems to build intuition`;

    case 'analyze':
      return `# 📝 Document Analysis: ${topic}

## Summary
The provided study notes on **${topic}** present a good overview of the subject area but would benefit from further elaboration of key parameters and edge cases.

## Identified Concepts
- **Core Principles:** Foundational rules governing ${topic}.
- **Implementation Strategy:** How concepts translate to structural applications.
- **Methodology:** Standard operational patterns and procedures.

## Missing Gaps / Weaknesses
- ⚠️ Needs more specific, real-world practical examples to build intuition.
- ⚠️ Lacks detail on advanced concepts and performance optimizations.
- ⚠️ Event-loop coordination or structural exception handling is not fully specified.

## Actionable Recommendations
1. **Add Examples:** Supplement these notes with concrete exercises or code snippets.
2. **Consult References:** Read the official documentation or search on Khan Academy.
3. **Self-Assessment:** Generate a quiz on ${topic} to verify your understanding.`;

    case 'resources':
      return `# 🔍 Learning Resources: ${topic}

## 🌐 Free Online Resources

| Resource | Description | URL |
|----------|-------------|-----|
| Khan Academy | Free structured courses | khanacademy.org |
| MIT OpenCourseWare | University-level lectures | ocw.mit.edu |
| Coursera (audit) | Professional courses | coursera.org |
| freeCodeCamp | Project-based learning | freecodecamp.org |
| YouTube Edu | Video explanations | youtube.com |

---

## 📘 Recommended Books
1. **"Introduction to ${topic}"** — Beginner-friendly fundamentals
2. **"${topic}: Theory and Practice"** — Bridges theory to real application
3. **"Mastering ${topic}"** — Advanced guide for depth

---

## 🛠️ Practice Platforms
- **LeetCode / HackerRank** — Coding challenges
- **GitHub** — Open-source projects to study
- **Kaggle** — Data-driven projects
- **Quizlet** — Flashcards and self-testing`;

    default:
      return `# 🎓 EduAssist AI Response

Thank you for your question about **${topic}**!

## Key Points to Understand

1. **Context & Background** — Understanding the broader context of **${topic}** frames your learning effectively.
2. **Core Concepts** — Focus on mastering fundamentals before advancing to complex topics.
3. **Practical Application** — Hands-on practice and real-world problem solving are essential.
4. **Continuous Learning** — Fields evolve; staying updated through reputable sources is important.

---

## My Recommendations
- Break the topic into smaller, manageable subtopics
- Set clear weekly learning milestones
- Use active recall (testing yourself) rather than passive reading
- Find a community of learners for motivation

Would you like me to:
- 📝 **Create a quiz** on this topic?
- 🗓️ **Build a study plan** for you?
- 💼 **Explore career paths** related to this?
- 📖 **Explain a specific concept** in more detail?`;
  }
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
export class MockGenerativeAI {
  constructor() {}

  getGenerativeModel(_options: { model: string; systemInstruction?: string; generationConfig?: any }) {
    return {
      async generateContent(input: any) {
        let rawText = '';
        if (typeof input === 'string') {
          rawText = input;
        } else if (input?.contents) {
          for (const c of input.contents) {
            for (const p of c.parts || []) {
              if (p.text) rawText += p.text + ' ';
            }
          }
        }
        rawText = rawText.trim();

        const intent = detectIntent(rawText);
        const topic = extractTopic(rawText);
        const responseText = buildResponse(intent, topic, rawText);

        return {
          candidates: [
            {
              content: {
                role: 'model',
                parts: [{ text: responseText }],
              },
              finishReason: 'STOP',
            },
          ],
          response: {
            text: () => responseText,
          },
        } as any;
      },
    };
  }
}
