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
        <li v-for="(todo, index) in todos" :key="index">
          <div class="view">
            <input class="toggle" type="checkbox" />
            <label>{{ todo.text }}</label>
            <button class="destroy" @click="delTodo(todo)"></button>
          </div>
          <input class="edit" type="text" />
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

export default {
  name: 'App',
  setup() {
    const todos = ref([])

    return {
      ...useAdd(todos),
      ...useDel(todos),
      todos,
    }
  },
}
</script>

<style></style>
