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
    <section class="main" v-show="count">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="allDone"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :class="{ editing: editingTodo === todo, completed: todo.completed }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
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
    <footer class="footer" v-show="count">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong>
        {{ remainingCount > 1 ? 'items' : 'item' }} left
      </span>
      <ul class="filters">
        <li><a href="#/all">All</a></li>
        <li><a href="#/active">Active</a></li>
        <li><a href="#/completed">Completed</a></li>
      </ul>
      <button
        class="clear-completed"
        v-show="count > remainingCount"
        @click="clearCompleted"
      >
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
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import useLocalStorage from './utils/useLocalStorage'

const storage = useLocalStorage()

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

  const clearCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.completed)
  }

  return {
    delTodo,
    clearCompleted,
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

// 4. 切换待办事项
const useFilter = (todos) => {
  const allDone = computed({
    get() {
      return todos.value.every((todo) => todo.completed)
    },
    set(value) {
      todos.value.forEach((todo) => (todo.completed = value))
    },
  })

  const filter = {
    all: (list) => list,
    active: (list) => list.filter((item) => !item.completed),
    completed: (list) => list.filter((item) => item.completed),
  }
  const type = ref('all')
  const filteredTodos = computed(() => filter[type.value](todos.value))
  const count = computed(() => todos.value.length)
  const remainingCount = computed(
    () => todos.value.filter((todo) => !todo.completed).length
  )

  const onHashChange = () => {
    const hash = window.location.hash.replace('#/', '')
    if (filter[hash]) {
      type.value = hash
    } else {
      type.value = 'all'
      window.location.hash = ''
    }
  }

  onMounted(() => {
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange)
  })

  return {
    allDone,
    filteredTodos,
    count,
    remainingCount,
  }
}

// 5. 存储待办事项
const useStorage = () => {
  const KEY = 'TODOKEYS'

  const todos = ref(storage.getItem(KEY) || [])

  watchEffect(() => {
    storage.setItem(KEY, todos.value)
  })

  return todos
}

export default {
  name: 'App',
  setup() {
    const todos = useStorage()
    const { delTodo, clearCompleted } = useDel(todos)

    return {
      ...useAdd(todos),
      delTodo,
      clearCompleted,
      todos,
      ...useEdit(delTodo),
      ...useFilter(todos),
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
