export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
}

export class TodoList {
  private todos: Todo[] = [];
  private nextId = 1;

  add(title: string): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
      completedAt: null,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  complete(id: number): Todo | undefined {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = true;
      todo.completedAt = new Date();
    }
    return todo;
  }

  uncomplete(id: number): Todo | undefined {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = false;
      todo.completedAt = null;
    }
    return todo;
  }

  remove(id: number): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }

  list(): Todo[] {
    return [...this.todos];
  }

  listPending(): Todo[] {
    return this.todos.filter((t) => !t.completed);
  }

  listCompleted(): Todo[] {
    return this.todos.filter((t) => t.completed);
  }
}
