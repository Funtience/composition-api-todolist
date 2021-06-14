<template>
  <section id="app" class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autocomplete="off"
        autofocus
        v-model="input"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="(todo, index) in todos"
          :key="index"
          :class="{ editing: editingTodo === todo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="delTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-editing-focus="editingTodo === todo"
            v-model="todo.text"
            @keyup.enter="editDone(todo)"
            @blur="editDone(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">
        <strong>1</strong>
        item left
      </span>
      <ul class="filters">
        <li><a href="#/all">All</a></li>
        <li><a href="#/active">Active</a></li>
        <li><a href="#/completed">Completed</a></li>
      </ul>
      <button class="clear-completed">
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by <a href="https://www.lagou.com">教瘦</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script>
import './assets/index.css'
import { ref } from 'vue'

// 1. 添加待办事项
const useAdd = (todos) => {
  const input = ref('')

  const addTodo = () => {
    let text = input.value.trim()
    if (text.length) {
      todos.value.unshift({
        text,
        completed: false,
      })
      input.value = ''
    }
  }

  return {
    input,
    addTodo,
  }
}

// 2. 删除待办事项
const useDel = (todos) => {
  const delTodo = (todo) => {
    const index = todos.value.findIndex((t) => t === todo)
    todos.value.splice(index, 1)
  }

  return {
    delTodo,
  }
}

// 3. 编辑待办事项
const useEdit = (delTodo) => {
  const editingTodo = ref(null)
  let beforeEditingText = ''

  const editTodo = (todo) => {
    editingTodo.value = todo
    beforeEditingText = todo.text
  }

  const editDone = (todo) => {
    let text = todo.text.trim()
    text.length || delTodo(todo)
    editingTodo.value = null
  }

  const cancelEdit = (todo) => {
    editingTodo.value = null
    todo.text = beforeEditingText
  }

  return {
    editingTodo,
    editTodo,
    editDone,
    cancelEdit,
  }
}

export default {
  name: 'App',
  setup() {
    const todos = ref([])
    const { delTodo } = useDel(todos)

    return {
      ...useAdd(todos),
      delTodo,
      todos,
      ...useEdit(delTodo),
    }
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus()
    },
  },
}
</script>

<style></style>
