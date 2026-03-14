import { TodoList } from "./todo.js";

const todoList = new TodoList();

todoList.add("TAKT の基本概念を学ぶ");
todoList.add("piece ファイルを書いてみる");
todoList.add("movement の流れを理解する");

console.log("=== Todo List Demo ===\n");
console.log("All todos:");
for (const todo of todoList.list()) {
  console.log(`  [${todo.completed ? "x" : " "}] #${todo.id}: ${todo.title}`);
}

todoList.complete(1);

console.log("\nAfter completing #1:");
console.log(`  Pending: ${todoList.listPending().length}`);
console.log(`  Completed: ${todoList.listCompleted().length}`);
