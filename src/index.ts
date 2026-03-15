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
for (const todo of todoList.listCompleted()) {
  console.log(`  [x] #${todo.id}: ${todo.title} (completed: ${todo.completedAt?.toISOString()})`);
}
console.log(`  Pending: ${todoList.listPending().length}`);
console.log(`  Completed: ${todoList.listCompleted().length}`);

todoList.uncomplete(1);

console.log("\nAfter uncompleting #1:");
const todo1 = todoList.list().find((t) => t.id === 1);
console.log(`  [${todo1?.completed ? "x" : " "}] #${todo1?.id}: ${todo1?.title} (completedAt: ${todo1?.completedAt})`);
