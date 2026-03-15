import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { TodoList } from "../todo.js";

function assertIsDate(value: unknown): asserts value is Date {
  assert.ok(value instanceof Date);
}

describe("TodoList", () => {
  let todoList: TodoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  describe("add", () => {
    it("新規Todoの completedAt は null である", () => {
      const todo = todoList.add("テストタスク");

      assert.equal(todo.completedAt, null);
    });

    it("新規Todoの completed は false である", () => {
      const todo = todoList.add("テストタスク");

      assert.equal(todo.completed, false);
    });

    it("新規Todoの createdAt は Date である", () => {
      const todo = todoList.add("テストタスク");

      assert.ok(todo.createdAt instanceof Date);
    });
  });

  describe("complete", () => {
    it("完了にすると completedAt に現在日時が記録される", () => {
      const todo = todoList.add("テストタスク");
      const before = new Date();

      const completed = todoList.complete(todo.id);

      assert.ok(completed !== undefined);
      assert.ok(completed.completedAt instanceof Date);
      assert.ok(completed.completedAt.getTime() >= before.getTime());
      assert.ok(completed.completedAt.getTime() <= new Date().getTime());
    });

    it("完了にすると completed が true になる", () => {
      const todo = todoList.add("テストタスク");

      const completed = todoList.complete(todo.id);

      assert.ok(completed !== undefined);
      assert.equal(completed.completed, true);
    });

    it("存在しないIDを指定すると undefined を返す", () => {
      const result = todoList.complete(999);

      assert.equal(result, undefined);
    });

    it("既に完了済みのTodoを再度完了にすると completedAt が更新される", () => {
      const todo = todoList.add("テストタスク");
      const firstCompleted = todoList.complete(todo.id);
      assert.ok(firstCompleted !== undefined);
      assertIsDate(firstCompleted.completedAt);
      const firstCompletedAt = firstCompleted.completedAt;

      const result = todoList.complete(todo.id);

      assert.ok(result !== undefined);
      assertIsDate(result.completedAt);
      assert.ok(result.completedAt.getTime() >= firstCompletedAt.getTime());
      assert.equal(result.completed, true);
    });
  });

  describe("uncomplete", () => {
    it("未完了に戻すと completedAt が null になる", () => {
      const todo = todoList.add("テストタスク");
      todoList.complete(todo.id);

      const uncompleted = todoList.uncomplete(todo.id);

      assert.ok(uncompleted !== undefined);
      assert.equal(uncompleted.completedAt, null);
    });

    it("未完了に戻すと completed が false になる", () => {
      const todo = todoList.add("テストタスク");
      todoList.complete(todo.id);

      const uncompleted = todoList.uncomplete(todo.id);

      assert.ok(uncompleted !== undefined);
      assert.equal(uncompleted.completed, false);
    });

    it("存在しないIDを指定すると undefined を返す", () => {
      const result = todoList.uncomplete(999);

      assert.equal(result, undefined);
    });

    it("完了していないTodoを未完了にしても completedAt は null のまま", () => {
      const todo = todoList.add("テストタスク");

      const result = todoList.uncomplete(todo.id);

      assert.ok(result !== undefined);
      assert.equal(result.completedAt, null);
      assert.equal(result.completed, false);
    });
  });

  describe("complete と uncomplete の連携", () => {
    it("完了→未完了→再完了で completedAt が正しく遷移する", () => {
      const todo = todoList.add("テストタスク");

      // 初期状態: completedAt は null
      assert.equal(todo.completedAt, null);

      // 完了: completedAt に日時が入る
      todoList.complete(todo.id);
      assertIsDate(todo.completedAt);

      // 未完了に戻す: completedAt が null になる
      todoList.uncomplete(todo.id);
      assert.equal(todo.completedAt, null);

      // 再完了: completedAt に新しい日時が入る
      todoList.complete(todo.id);
      assertIsDate(todo.completedAt);
    });

    it("completed と completedAt の整合性が保たれる", () => {
      const todo = todoList.add("テストタスク");

      // 未完了状態: completed=false, completedAt=null
      assert.equal(todo.completed, false);
      assert.equal(todo.completedAt, null);

      // 完了状態: completed=true, completedAt=Date
      todoList.complete(todo.id);
      assert.equal(todo.completed, true);
      assertIsDate(todo.completedAt);

      // 未完了に戻す: completed=false, completedAt=null
      todoList.uncomplete(todo.id);
      assert.equal(todo.completed, false);
      assert.equal(todo.completedAt, null);
    });
  });

  describe("listCompleted / listPending との連携", () => {
    it("完了済みリストのTodoは completedAt を持つ", () => {
      todoList.add("タスク1");
      const todo2 = todoList.add("タスク2");
      todoList.complete(todo2.id);

      const completed = todoList.listCompleted();

      assert.equal(completed.length, 1);
      assert.ok(completed[0]!.completedAt instanceof Date);
    });

    it("未完了リストのTodoは completedAt が null である", () => {
      const todo1 = todoList.add("タスク1");
      todoList.add("タスク2");
      todoList.complete(todo1.id);

      const pending = todoList.listPending();

      assert.equal(pending.length, 1);
      assert.equal(pending[0]!.completedAt, null);
    });
  });
});
